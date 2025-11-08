#!/usr/bin/env python3
"""
simulate_tournament_and_slippage.py (robust)

- Reads an internal CSV that contains two tables:
    (A) team table (team_id, team_name, true_strength, dist_name, dist_params, tournament_price)
    (B) optional "# Round 1 matchups" table (match_id, team_A_id, team_B_id, team_A, team_B, team_A_price, team_B_price)

- If matchups found, uses them for Round 1; otherwise randomly seeds round 1.
- Simulates matches and advances winners through rounds.
- Loads player trades and applies slippage to produce updated prices.
"""

import csv
import json
import random
import math
from collections import defaultdict
from distributions import probability_A_beats_B
import os

# -------------------
# CONFIG
# -------------------
RNG_SEED = 99
SLIPPAGE_COEFF = 0.03  # base alpha for price adjustments

# Resolve paths relative to this script directory so it works regardless of CWD
BASE_DIR = os.path.dirname(__file__)
INPUT_INTERNAL_CSV = os.path.join(BASE_DIR, "initial_state_internal.csv")
INPUT_TRADES_CSV = os.path.join(BASE_DIR, "mock_player_trades.csv")

OUTPUT_RESULTS = "tournament_results.csv"
OUTPUT_UPDATED_PRICES = "updated_prices.csv"

random.seed(RNG_SEED)

# -------------------
# UTIL: split mixed CSV into two CSV strings
# -------------------
import io

def split_internal_file(path):
    """
    Read file and split into 'teams' section and optional 'matchups' section.
    Returns (teams_csv_text, matchups_csv_text_or_None).
    Logic: find first line that starts with '# Round' or that has header 'match_id,'.
    """
    with open(path, "r", newline='') as f:
        lines = f.readlines()

    # find a split marker
    split_index = None
    for i, line in enumerate(lines):
        s = line.strip()
        if not s:
            continue
        if s.startswith("# Round") or s.lower().startswith("match_id") or s.startswith("match_id,"):
            split_index = i
            break

    if split_index is None:
        teams_text = "".join(lines).strip()
        return teams_text, None

    teams_lines = lines[:split_index]
    matchup_lines = lines[split_index:]

    # If the matchup section starts with a comment like '# Round 1 matchups', remove the comment line
    if matchup_lines and matchup_lines[0].strip().startswith("#"):
        # drop the comment line but keep following header if present
        matchup_lines = matchup_lines[1:]

    return "".join(teams_lines).strip(), "".join(matchup_lines).strip()

# -------------------
# LOAD TEAMS (robust)
# -------------------
def load_teams_and_matchups(path):
    teams_csv_text, matchups_csv_text = split_internal_file(path)

    # Parse teams
    teams = []
    if not teams_csv_text:
        raise RuntimeError("No team section found in internal CSV.")

    # csv.DictReader from string
    teams_f = io.StringIO(teams_csv_text)
    reader = csv.DictReader(teams_f)
    for row in reader:
        # skip rows without numeric team_id
        team_id_raw = (row.get("team_id") or "").strip()
        if not team_id_raw or not team_id_raw.lstrip().isdigit():
            continue
        # safe dist_params parsing
        raw_params = (row.get("dist_params") or "").strip()
        # fix common CSV double-quote pattern: row might be like: "{""df"": 3, ""scale"": 0.06}"
        if raw_params.startswith('"') and raw_params.endswith('"'):
            # remove outer quotes
            raw_inner = raw_params[1:-1]
            # replace doubled quotes with single quotes
            raw_inner = raw_inner.replace('""', '"')
            params_text = raw_inner
        else:
            params_text = raw_params.replace('""', '"')

        try:
            params = json.loads(params_text) if params_text else {}
        except Exception:
            print(f"Warning: Could not parse dist_params for team {row.get('team_id')}:{row.get('team_name')}: {params_text}")
            params = {}

        try:
            team = {
                "team_id": int(team_id_raw),
                "team_name": row.get("team_name") or f"Team_{team_id_raw}",
                "true_strength": float(row.get("true_strength") or 0.0),
                "dist_name": (row.get("dist_name") or "").strip(),
                "dist_params": params,
                "tournament_price": float(row.get("tournament_price") or 0.0),
            }
        except Exception as e:
            print(f"Warning: skipping malformed team row: {row}; error: {e}")
            continue
        teams.append(team)

    # Parse matchups (if present)
    matchups = []
    if matchups_csv_text:
        mm_f = io.StringIO(matchups_csv_text)
        # try to detect whether header exists; if first non-empty line contains commas, assume header exists
        mm_first_line = mm_f.readline()
        if not mm_first_line:
            matchups = []
        else:
            # reset pointer to start for DictReader
            mm_f.seek(0)
            mm_reader = csv.DictReader(mm_f)
            # accept rows that have a number in match_id
            for row in mm_reader:
                mid_raw = (row.get("match_id") or "").strip()
                if not mid_raw or not mid_raw.lstrip().isdigit():
                    continue
                try:
                    m = {
                        "match_id": int(mid_raw),
                        "team_A_id": int((row.get("team_A_id") or "").strip()),
                        "team_B_id": int((row.get("team_B_id") or "").strip()),
                        "team_A": row.get("team_A") or "",
                        "team_B": row.get("team_B") or "",
                        "team_A_price": float(row.get("team_A_price") or 0.0),
                        "team_B_price": float(row.get("team_B_price") or 0.0)
                    }
                    matchups.append(m)
                except Exception as e:
                    # skip if any field missing / malformed
                    print(f"Warning: skipping malformed matchup row: {row} -> {e}")
                    continue

    return teams, matchups

# -------------------
# SIMULATE A SINGLE MATCH
# -------------------
def simulate_match(teamA, teamB, trials=1000):
    """Return winner dict and probabilities."""
    # if dist_name missing, fallback to normal with small sd
    def make_spec(team):
        name = team.get("dist_name") or "normal"
        params = team.get("dist_params") or {}
        return {'name': name, 'params': params}

    specA = make_spec(teamA)
    specB = make_spec(teamB)

    pA = probability_A_beats_B(teamA["true_strength"], teamB["true_strength"], specA, specB, trials_mc=trials)
    # ensure numeric
    pA = float(max(0.0, min(1.0, pA)))
    winner = teamA if random.random() < pA else teamB
    loser = teamB if winner is teamA else teamA

    return {
        "teamA_id": teamA["team_id"],
        "teamB_id": teamB["team_id"],
        "teamA_name": teamA["team_name"],
        "teamB_name": teamB["team_name"],
        "probA": round(pA, 4),
        "probB": round(1 - pA, 4),
        "winner": winner,
        "loser": loser
    }

# -------------------
# RUN TOURNAMENT
# -------------------
def simulate_tournament(teams, initial_matchups=None):
    """
    If initial_matchups provided, use them for round 1 (matchup team ids must match teams).
    Otherwise randomly seed the bracket using teams list.
    Returns matches_list (ordered by rounds) and champion
    """
    id_to_team = {t["team_id"]: t for t in teams}
    # Round 1
    current_competitors = []

    if initial_matchups:
        # use initial matchups: find team objects by id
        for m in initial_matchups:
            a = id_to_team.get(m["team_A_id"])
            b = id_to_team.get(m["team_B_id"])
            if not a or not b:
                raise RuntimeError(f"Matchup references missing team id: {m}")
            current_competitors.append((a, b))
    else:
        # random seeding: create pairs
        shuffled = teams[:]
        random.shuffle(shuffled)
        for i in range(0, len(shuffled), 2):
            a = shuffled[i]
            b = shuffled[i+1]
            current_competitors.append((a, b))

    matches = []
    round_num = 1
    while True:
        print(f"Simulating round {round_num} with {len(current_competitors)} matches...")
        next_round_pairs = []
        for pair in current_competitors:
            teamA, teamB = pair
            res = simulate_match(teamA, teamB)
            res["round"] = round_num
            matches.append(res)
            next_round_pairs.append(res["winner"])
        # if only one winner, champion found
        if len(next_round_pairs) == 1:
            champion = next_round_pairs[0]
            break
        # prepare next round: pair winners sequentially
        new_pairs = []
        for i in range(0, len(next_round_pairs), 2):
            new_pairs.append((next_round_pairs[i], next_round_pairs[i+1]))
        current_competitors = new_pairs
        round_num += 1

    return matches, champion

# -------------------
# LOAD TRADES
# -------------------
def load_player_trades(path):
    """
    Expect CSV columns: player_id,match_id,team,action,quantity,price
    Returns flows: dict keyed by match_id -> {'buy': {team: qty}, 'sell': {...}}
    """
    flows = defaultdict(lambda: {'buy': defaultdict(int), 'sell': defaultdict(int)})
    try:
        with open(path, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                mid_raw = (row.get("match_id") or "").strip()
                if not mid_raw:
                    continue
                try:
                    mid = int(mid_raw)
                except:
                    continue
                team = (row.get("team") or "").strip()
                action = (row.get("action") or "").strip().lower()
                qty = int((row.get("quantity") or "0").strip() or 0)
                if action not in ("buy", "sell"):
                    continue
                flows[mid][action][team] += qty
    except FileNotFoundError:
        print("No player trades file found; continuing without flows.")
    return flows

# -------------------
# APPLY SLIPPAGE
# -------------------
def apply_slippage_to_matches(matches, flows):
    """
    For each match in matches list (order preserved), compute B and S per team and produce new prices.
    Returns list of dicts with new_team_A_price/new_team_B_price and buy/sell counts.
    """
    updated = []
    for idx, m in enumerate(matches, start=1):
        match_id = idx  # note: our matches list is 1-indexed in output earlier
        teamA = m["teamA_name"]
        teamB = m["teamB_name"]
        # aggregate
        buys_A = flows.get(match_id, {}).get('buy', {}).get(teamA, 0)
        sells_A = flows.get(match_id, {}).get('sell', {}).get(teamA, 0)
        buys_B = flows.get(match_id, {}).get('buy', {}).get(teamB, 0)
        sells_B = flows.get(match_id, {}).get('sell', {}).get(teamB, 0)

        # total buy/sell for teamA and teamB combined
        B = buys_A + buys_B
        S = sells_A + sells_B
        if (B + S) == 0:
            net = 0.0
        else:
            net = (B - S) / float(B + S)

        # current prices derived from simulated probabilities (m["probA"], m["probB"])
        pA = m["probA"] * 100.0
        pB = m["probB"] * 100.0

        slip = SLIPPAGE_COEFF * net
        new_pA = round(max(0.01, min(99.99, pA * (1 + slip))), 2)
        new_pB = round(max(0.01, min(99.99, pB * (1 - slip))), 2)
        # normalize so they sum approximately to 100 (small rounding)
        total = new_pA + new_pB
        if total != 0:
            new_pA = round(new_pA / total * 100.0, 2)
            new_pB = round(100.0 - new_pA, 2)

        updated.append({
            "match_id": match_id,
            "team_A": teamA,
            "team_B": teamB,
            "old_team_A_price": round(pA, 2),
            "old_team_B_price": round(pB, 2),
            "new_team_A_price": new_pA,
            "new_team_B_price": new_pB,
            "buys_A": buys_A,
            "sells_A": sells_A,
            "buys_B": buys_B,
            "sells_B": sells_B,
            "B_total": B,
            "S_total": S,
            "net": round(net, 4),
            "slip": round(slip, 4)
        })
    return updated

# -------------------
# SAVE OUTPUTS
# -------------------
def save_results(matches, champion, path=OUTPUT_RESULTS):
    with open(path, "w", newline='') as f:
        w = csv.writer(f)
        w.writerow(["round", "winner_id", "winner_name", "loser_id", "loser_name", "probA", "probB"])
        for m in matches:
            w.writerow([m["round"], m["winner"]["team_id"], m["winner"]["team_name"],
                        m["loser"]["team_id"], m["loser"]["team_name"],
                        m["probA"], m["probB"]])
        w.writerow([])
        w.writerow(["Champion", champion["team_name"], champion["team_id"]])
    print(f"Wrote tournament results to {path}")

def save_updated_prices(updated, path=OUTPUT_UPDATED_PRICES):
    keys = ["match_id", "team_A", "team_B", "old_team_A_price", "old_team_B_price",
            "new_team_A_price", "new_team_B_price", "buys_A", "sells_A", "buys_B", "sells_B",
            "B_total", "S_total", "net", "slip"]
    with open(path, "w", newline='') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for row in updated:
            writer.writerow(row)
    print(f"Wrote updated prices to {path}")

import csv
from collections import defaultdict

def calculate_player_payouts(trades_csv, results_csv, output_csv):
    """Compute payouts for each player based on match outcomes.
    Adapts to the current tournament_results.csv format (no explicit match_id column)."""
    # Resolve paths relative to this script directory
    results_path = os.path.join(BASE_DIR, results_csv)
    trades_path = os.path.join(BASE_DIR, trades_csv)
    output_path = os.path.join(BASE_DIR, output_csv)

    # Load results: tournament_results.csv has columns:
    # ["round","winner_id","winner_name","loser_id","loser_name","probA","probB"]
    # Enumerate rows to synthesize match_id (= row order), skip blanks and "Champion" footer.
    results = {}
    with open(results_path, newline="") as f:
        reader = csv.DictReader(f)
        match_index = 0
        for row in reader:
            rnd = (row.get("round") or "").strip()
            if not rnd or rnd.lower() == "champion":
                continue
            winner_name = (row.get("winner_name") or "").strip()
            if not winner_name:
                continue
            match_index += 1
            results[match_index] = winner_name

    # Initialize player balances
    player_payouts = defaultdict(float)

    # Process trades (expects: player_id,match_id,team,action,quantity,price)
    with open(trades_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            mid_raw = (row.get("match_id") or "").strip()
            if not mid_raw:
                continue
            try:
                match_id = int(mid_raw)
            except ValueError:
                continue
            player_id = (row.get("player_id") or "").strip()
            team = (row.get("team") or "").strip()
            action = (row.get("action") or "").strip().lower()
            try:
                qty = float((row.get("quantity") or "0").strip() or 0)
                price = float((row.get("price") or "0").strip() or 0)
            except ValueError:
                continue

            winner = results.get(match_id)
            if not winner:
                continue  # match not resolved yet or out of range

            # Calculate payout
            if team == winner:
                if action == "buy":
                    payout = qty * (1 - price)
                else:  # sell
                    payout = -qty * price
            else:
                if action == "buy":
                    payout = -qty * price
                else:  # sell
                    payout = qty * price

            player_payouts[player_id] += payout

    # Write to output CSV
    with open(output_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["player_id", "total_payout"])
        for player, total in player_payouts.items():
            writer.writerow([player, round(total, 2)])

# -------------------
# MAIN
# -------------------
def main():
    teams, initial_matchups = load_teams_and_matchups(INPUT_INTERNAL_CSV)
    print(f"Loaded {len(teams)} teams, {len(initial_matchups) if initial_matchups else 0} initial matchups")

    matches, champion = simulate_tournament(teams, initial_matchups if initial_matchups else None)

    flows = load_player_trades(INPUT_TRADES_CSV)
    updated = apply_slippage_to_matches(matches, flows)

    save_results(matches, champion)
    save_updated_prices(updated)

    calculate_player_payouts(
        trades_csv="mock_player_trades.csv",
        results_csv="tournament_results.csv",
        output_csv="player_payouts.csv"
    )

if __name__ == "__main__":
    main()
