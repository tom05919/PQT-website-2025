#!/usr/bin/env python3
"""
Generate CSV files for each round showing:
- Asset 1: Matchup prices for that round
- Asset 2: Tournament winner prices (based on remaining teams)
With realistic noise to create mispricing opportunities.
"""

import csv
import json
import random
from collections import defaultdict

# Set seed for reproducibility
random.seed(42)

def add_noise(fair_price, noise_level=0.15):
    """
    Add realistic noise to a price.
    noise_level: how much deviation from fair price (0.15 = ±15% typical)
    """
    # Random noise with bias (can go higher or lower)
    noise_factor = random.gauss(1.0, noise_level)
    noisy_price = fair_price * noise_factor
    # Clamp to reasonable bounds (1-99)
    return max(1, min(99, noisy_price))

# Read tournament results
matches_by_round = defaultdict(list)
with open('tournament_results.csv', newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['round'] and row['teamA']:
            round_num = int(row['round'])
            matches_by_round[round_num].append({
                'match_id': int(row['match_id']),
                'round': round_num,
                'teamA': row['teamA'],
                'teamB': row['teamB'],
                'probA': float(row['probA']),
                'probB': float(row['probB']),
                'winner': row['winner'],
                'loser': row['loser'],
            })

# Read initial prices for tournament asset
tournament_prices = {}
with open('initial_state_visible.csv', newline='') as f:
    lines = f.readlines()
    in_team_section = False
    for line in lines:
        line = line.strip()
        if line.startswith('team_id,team_name'):
            in_team_section = True
            continue
        if not line or line.startswith('---'):
            in_team_section = False
            continue
        if in_team_section:
            parts = line.split(',')
            if len(parts) >= 9:
                team_name = parts[1]
                tournament_price = float(parts[8])
                tournament_prices[team_name] = tournament_price

# Track which teams are still alive (haven't lost yet)
alive_teams = set(tournament_prices.keys())

# Generate CSV for each round
for round_num in range(1, 6):
    matches = matches_by_round[round_num]
    
    if not matches:
        continue
    
    filename = f'round_{round_num}_prices.csv'
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        
        # Header
        writer.writerow(['match_id', 'round', 'team_A', 'team_B', 'team_A_price', 'team_B_price', 
                        'team_A_tournament_price', 'team_B_tournament_price'])
        
        # Write each matchup
        for match in matches:
            teamA = match['teamA']
            teamB = match['teamB']
            
            # Asset 1: Matchup prices (based on probabilities, scaled to 0-100, with noise)
            fair_priceA = match['probA'] * 100
            fair_priceB = match['probB'] * 100
            priceA = round(add_noise(fair_priceA, noise_level=0.12), 2)
            priceB = round(add_noise(fair_priceB, noise_level=0.12), 2)
            
            # Ensure prices sum close to 100 (re-normalize)
            total = priceA + priceB
            if total > 0:
                priceA = round(priceA / total * 100, 2)
                priceB = round(100 - priceA, 2)
            
            # Asset 2: Tournament prices (current values or 0 if eliminated, with noise)
            tournamentA = tournament_prices.get(teamA, 0)
            tournamentB = tournament_prices.get(teamB, 0)
            if tournamentA > 0:
                tournamentA = add_noise(tournamentA, noise_level=0.2)
            if tournamentB > 0:
                tournamentB = add_noise(tournamentB, noise_level=0.2)
            
            writer.writerow([
                match['match_id'],
                round_num,
                teamA,
                teamB,
                priceA,
                priceB,
                round(tournamentA, 2),
                round(tournamentB, 2)
            ])
    
    print(f"Generated {filename}")
    
    # Update alive_teams: remove losers from this round
    for match in matches:
        loser = match['loser']
        if loser in alive_teams:
            alive_teams.remove(loser)

print("\nDone! Generated 5 round price files.")

