#!/usr/bin/env python3
"""
generate_initial_state.py

Generates two CSVs:
 - initial_state_visible.csv (what players see: attributes, variance, strength, tournament price)
 - initial_state_internal.csv (admin/internal: true_strength, distribution spec, tournament price)

Requires a local `distributions.py` module with function:
    probability_A_beats_B(meanA, meanB, distA_spec, distB_spec, trials_mc=...)
"""

import csv
import json
import random
import math
from distributions import probability_A_beats_B

# -------------------
# CONFIG
# -------------------
NUM_TEAMS = 32
OUTPUT_FILE_VISIBLE = "initial_state_visible.csv"
OUTPUT_FILE_INTERNAL = "initial_state_internal.csv"
RNG_SEED = 42

DISTRIBUTION_POOL = [
    {'name': 'normal', 'params': {'sd': 0.04}},
    {'name': 'student_t', 'params': {'df': 3, 'scale': 0.06}},
    {'name': 'mixture_normal', 'params': {'p': 0.3, 'delta': 0.07, 'sd1': 0.03, 'sd2': 0.07}},
    {'name': 'logistic', 'params': {'s': 0.05}},
    {'name': 'laplace', 'params': {'b': 0.05}},
    {'name': 'max_of_n', 'params': {'n': 3, 'sd': 0.05}},
    {'name': 'skew_normal_approx', 'params': {'sd': 0.05, 'rho': 0.7}},
    {'name': 'beta', 'params': {'k': 50}}
]

ATTRIBUTE_WEIGHTS = {
    "offense": 0.35,
    "defense": 0.30,
    "chemistry": 0.20,
    "injury_risk": 0.15
}

# -------------------
# TEAM GENERATION
# -------------------
def generate_teams(num_teams):
    teams = []
    for i in range(num_teams):
        offense = round(random.uniform(0.4, 0.9), 3)
        defense = round(random.uniform(0.4, 0.9), 3)
        chemistry = round(random.uniform(0.4, 0.9), 3)
        injury_risk = round(random.uniform(0.0, 0.6), 3)
        variance = round(random.uniform(0.01, 0.2), 3)

        strength = (
            ATTRIBUTE_WEIGHTS["offense"] * offense
            + ATTRIBUTE_WEIGHTS["defense"] * defense
            + ATTRIBUTE_WEIGHTS["chemistry"] * chemistry
            + ATTRIBUTE_WEIGHTS["injury_risk"] * (1 - injury_risk)
        )
        strength = round(strength, 3)

        dist_spec = random.choice(DISTRIBUTION_POOL)
        true_strength = round(strength * (1 - variance), 3)

        team = {
            "team_id": i + 1,
            "team_name": f"Team_{i+1}",
            "offense": offense,
            "defense": defense,
            "chemistry": chemistry,
            "injury_risk": injury_risk,
            "variance": variance,
            "strength": strength,
            "true_strength": true_strength,
            "dist_name": dist_spec["name"],
            "dist_params": dist_spec["params"]
        }
        teams.append(team)
    return teams

# -------------------
# TOURNAMENT PRICES
# -------------------
def compute_tournament_prices(teams):
    """Estimate each team's tournament win price using pairwise avg prob ** rounds_to_win."""
    rounds_to_win = int(math.log2(len(teams)))
    for team in teams:
        total_prob = 0.0
        for other in teams:
            if other is team:
                continue
            prob = probability_A_beats_B(
                team["true_strength"], other["true_strength"],
                {'name': team["dist_name"], 'params': team["dist_params"]},
                {'name': other["dist_name"], 'params': other["dist_params"]},
                trials_mc=800
            )
            total_prob += prob

        avg_p = total_prob / (len(teams) - 1)
        tournament_prob = avg_p ** rounds_to_win

        # Add Gaussian noise (~3%) and clamp to [0.005, 0.995]
        noisy_prob = max(0.01* (1 + random.gauss(0, 0.06)), min(0.995, tournament_prob * (1 + random.gauss(0, 0.09))))
        team["tournament_price"] = round(noisy_prob * 100, 2)
    return teams

# -------------------
# MATCHUPS (Round 1)
# -------------------
def compute_round_matchups(teams):
    """Shuffle and pair teams into (team_A, team_B) matchups for round 1 and compute match prices."""
    teams_copy = teams[:]  # don't mutate original order
    random.shuffle(teams_copy)
    matchups = []
    for i in range(0, len(teams_copy), 2):
        A = teams_copy[i]
        B = teams_copy[i + 1]
        pA = probability_A_beats_B(
            A["true_strength"], B["true_strength"],
            {'name': A["dist_name"], 'params': A["dist_params"]},
            {'name': B["dist_name"], 'params': B["dist_params"]},
            trials_mc=1200
        )

        # Add symmetric noise (~3%) to both sides, clamp, then renormalize
        pA_noisy = max(0.005, min(0.995, pA * (1 + random.gauss(0, 0.03))))
        pB_noisy = 1.0 - pA_noisy
        total = pA_noisy + pB_noisy
        pA_final = pA_noisy / total
        pB_final = pB_noisy / total

        matchups.append({
            "match_id": len(matchups) + 1,
            "round": 1,
            "team_A_id": A["team_id"],
            "team_B_id": B["team_id"],
            "team_A": A["team_name"],
            "team_B": B["team_name"],
            "team_A_price": round(pA_final * 100, 2),
            "team_B_price": round(pB_final * 100, 2)
        })
    return matchups

# -------------------
# CSV OUTPUT
# -------------------
def write_csv_visible(teams, matchups, filename):
    """Public file: team overview and round-1 matchups (human readable)."""
    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["--- TEAM OVERVIEW ---"])
        writer.writerow([
            "team_id", "team_name", "offense", "defense", "chemistry",
            "injury_risk", "variance", "strength", "tournament_price"
        ])
        for t in teams:
            writer.writerow([
                t["team_id"], t["team_name"], t["offense"], t["defense"],
                t["chemistry"], t["injury_risk"], t["variance"],
                t["strength"], t.get("tournament_price", "")
            ])

        writer.writerow([])
        writer.writerow(["--- ROUND 1 MATCHUPS ---"])
        writer.writerow(["match_id", "round", "team_A", "team_B", "team_A_price", "team_B_price"])
        for m in matchups:
            writer.writerow([
                m["match_id"], m["round"], m["team_A"], m["team_B"],
                m["team_A_price"], m["team_B_price"]
            ])

def write_csv_internal(teams, matchups, filename):
    """Internal admin file: includes true_strength and distribution metadata.
       Ensure we only write the fields listed in fieldnames to avoid csv.DictWriter errors.
    """
    fieldnames = [
        "team_id", "team_name", "true_strength", "dist_name", "dist_params", "tournament_price"
    ]
    with open(filename, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for t in teams:
            row = {
                "team_id": t["team_id"],
                "team_name": t["team_name"],
                "true_strength": t["true_strength"],
                "dist_name": t["dist_name"],
                "dist_params": json.dumps(t["dist_params"]),
                "tournament_price": t.get("tournament_price", "")
            }
            writer.writerow(row)

        # append matchups as a second CSV table in same file (simple convenience)
        f.write("\n\n# Round 1 matchups\n")
        mw = csv.writer(f)
        mw.writerow(["match_id", "team_A_id", "team_B_id", "team_A", "team_B", "team_A_price", "team_B_price"])
        for m in matchups:
            mw.writerow([
                m["match_id"], m["team_A_id"], m["team_B_id"], m["team_A"], m["team_B"],
                m["team_A_price"], m["team_B_price"]
            ])

# -------------------
# MAIN
# -------------------
def main():
    random.seed(RNG_SEED)
    print("Generating initial teams...")
    teams = generate_teams(NUM_TEAMS)
    print("Computing tournament prices (approx)...")
    teams = compute_tournament_prices(teams)
    print("Building round 1 matchups...")
    matchups = compute_round_matchups(teams)

    print(f"Writing visible CSV to {OUTPUT_FILE_VISIBLE} ...")
    write_csv_visible(teams, matchups, OUTPUT_FILE_VISIBLE)
    print(f"Writing internal CSV to {OUTPUT_FILE_INTERNAL} ...")
    write_csv_internal(teams, matchups, OUTPUT_FILE_INTERNAL)

    print("Done.")
    print(f"Public file: {OUTPUT_FILE_VISIBLE}")
    print(f"Internal file: {OUTPUT_FILE_INTERNAL}")
    print(f"Generated {len(matchups)} matchups for round 1.")

if __name__ == "__main__":
    main()
