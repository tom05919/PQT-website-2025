#!/usr/bin/env python3
"""
simulate_tournament.py

Simulate the entire single-elimination tournament and write a CSV with results.

Outputs:
 - tournament_results.csv

Requires:
 - initial_state_internal.csv (teams table, may include an optional matchups table)
 - distributions.py (with probability_A_beats_B function)
"""

import csv
import io
import json
import random
import math
from collections import defaultdict
from distributions import probability_A_beats_B

INPUT_INTERNAL = "initial_state_internal.csv"
OUTPUT_RESULTS = "tournament_results.csv"
RNG_SEED = 12345

random.seed(RNG_SEED)


def split_internal_file(path):
    """Return (teams_text, matchups_text_or_None) by splitting on '# Round' or 'match_id' marker."""
    with open(path, "r", newline="") as f:
        lines = f.readlines()

    split_index = None
    for i, line in enumerate(lines):
        s = line.strip()
        if not s:
            continue
        if s.startswith("# Round") or s.lower().startswith("match_id") or s.startswith("match_id,"):
            split_index = i
            break

    if split_index is None:
        return "".join(lines).strip(), None

    teams_lines = lines[:split_index]
    matchup_lines = lines[split_index:]
    # drop comment if present
    if matchup_lines and matchup_lines[0].strip().startswith("#"):
        matchup_lines = matchup_lines[1:]
    return "".join(teams_lines).strip(), "".join(matchup_lines).strip()


def load_teams(path):
    """Load only the teams portion (robust JSON parsing of dist_params)."""
    teams_text, matchups_text = split_internal_file(path)
    if not teams_text:
        raise RuntimeError("No teams section found in internal CSV.")

    f = io.StringIO(teams_text)
    reader = csv.DictReader(f)
    teams = []
    for row in reader:
        team_id_raw = (row.get("team_id") or "").strip()
        if not team_id_raw or not team_id_raw.lstrip().isdigit():
            continue
        team_id = int(team_id_raw)
        name = (row.get("team_name") or f"Team_{team_id}").strip()
        ts = float(row.get("true_strength") or 0.0)
        dist_name = (row.get("dist_name") or "").strip()
        raw_params = (row.get("dist_params") or "").strip()
        # fix CSV double-quote style if present
        if raw_params.startswith('"') and raw_params.endswith('"'):
            inner = raw_params[1:-1].replace('""', '"')
            params_text = inner
        else:
            params_text = raw_params.replace('""', '"')
        try:
            params = json.loads(params_text) if params_text else {}
        except Exception:
            params = {}
        tournament_price = float(row.get("tournament_price") or 0.0)
        teams.append({
            "team_id": team_id,
            "team_name": name,
            "true_strength": ts,
            "dist_name": dist_name,
            "dist_params": params,
            "tournament_price": tournament_price
        })
    return teams


def load_initial_matchups(path):
    """If internal file included a matchups block, parse and return as list, else None."""
    _, matchups_text = split_internal_file(path)
    if not matchups_text:
        return None
    f = io.StringIO(matchups_text)
    reader = csv.DictReader(f)
    matchups = []
    for row in reader:
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
        except Exception:
            continue
    return matchups if matchups else None


def simulate_match(teamA, teamB, trials_mc=1200):
    specA = {"name": teamA.get("dist_name") or "normal", "params": teamA.get("dist_params") or {}}
    specB = {"name": teamB.get("dist_name") or "normal", "params": teamB.get("dist_params") or {}}
    pA = probability_A_beats_B(teamA["true_strength"], teamB["true_strength"], specA, specB, trials_mc=trials_mc)
    pA = max(0.0, min(1.0, float(pA)))
    winner = teamA if random.random() < pA else teamB
    loser = teamB if winner is teamA else teamA
    return {
        "probA": round(pA, 4),
        "probB": round(1.0 - pA, 4),
        "winner": winner,
        "loser": loser
    }


def simulate_tournament(teams, initial_matchups=None):
    """Simulate entire bracket. Return list of match records (with rounds)"""
    id_map = {t["team_id"]: t for t in teams}
    # Create initial pairings
    pairs = []
    if initial_matchups:
        # use provided matchups
        for m in initial_matchups:
            A = id_map.get(m["team_A_id"])
            B = id_map.get(m["team_B_id"])
            if A is None or B is None:
                # fallback to skipping invalid
                continue
            pairs.append((A, B))
    else:
        # random seeding
        shuffled = teams[:]
        random.shuffle(shuffled)
        for i in range(0, len(shuffled), 2):
            pairs.append((shuffled[i], shuffled[i+1]))

    matches_output = []
    round_num = 1
    match_id_global = 1
    current_pairs = pairs

    while current_pairs:
        next_round_teams = []
        for pair in current_pairs:
            teamA, teamB = pair
            res = simulate_match(teamA, teamB)
            winner = res["winner"]
            loser = res["loser"]
            record = {
                "round": round_num,
                "match_id": match_id_global,
                "teamA_id": teamA["team_id"],
                "teamB_id": teamB["team_id"],
                "teamA": teamA["team_name"],
                "teamB": teamB["team_name"],
                "probA": res["probA"],
                "probB": res["probB"],
                "winner_id": winner["team_id"],
                "loser_id": loser["team_id"],
                "winner": winner["team_name"],
                "loser": loser["team_name"]
            }
            matches_output.append(record)
            next_round_teams.append(winner)
            match_id_global += 1
        # pair winners sequentially
        if len(next_round_teams) == 1:
            break
        new_pairs = []
        for i in range(0, len(next_round_teams), 2):
            new_pairs.append((next_round_teams[i], next_round_teams[i+1]))
        current_pairs = new_pairs
        round_num += 1

    # return the flat list of match records
    return matches_output


def write_tournament_csv(matches, path=OUTPUT_RESULTS):
    """Write matches list to CSV."""
    fieldnames = [
        "round", "match_id",
        "teamA_id", "teamB_id", "teamA", "teamB",
        "probA", "probB",
        "winner_id", "loser_id", "winner", "loser"
    ]
    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for m in matches:
            writer.writerow(m)
    print(f"Wrote tournament results to {path}")


def main():
    teams = load_teams(INPUT_INTERNAL)
    initial_matchups = load_initial_matchups(INPUT_INTERNAL)
    print(f"Loaded {len(teams)} teams; using initial matchups: {bool(initial_matchups)}")
    matches = simulate_tournament(teams, initial_matchups)
    write_tournament_csv(matches)


if __name__ == "__main__":
    main()
