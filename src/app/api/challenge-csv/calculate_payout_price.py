import csv
import argparse
import os
import random

def load_teams(prices_file):
    teams = {}
    with open(prices_file, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            teams[row["team_id"]] = {
                "team_name": row["team_name"],
                "tournament_price": float(row.get("tournament_price", 0))
            }
    return teams

def load_outcomes(outcomes_file, round_num):
    outcomes = {}
    with open(outcomes_file, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if int(row["round"]) == round_num:
                outcomes[row["team_id"]] = row["winner"] == "1"
    return outcomes

def load_trades(trades_file):
    trades = []
    with open(trades_file, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            team_id = (row.get("team_id") or "").strip()
            action = (row.get("action") or "").strip().lower()
            player_id = (row.get("player_id") or "").strip()
            quantity_raw = row.get("quantity")
            if not team_id or not action or not player_id:
                continue
            if action not in ("buy", "sell"):
                continue
            try:
                quantity = float(quantity_raw)
            except (TypeError, ValueError):
                quantity = 0.0
            trades.append({
                "player_id": player_id,
                "team_id": team_id,
                "action": action,
                "quantity": quantity
            })
    return trades

def calculate_round(teams, outcomes, trades):
    # Initialize player payouts
    player_payouts = {}
    # Initialize buy/sell counts per team for slippage
    team_trades = {team_id: {"buy": 0, "sell": 0} for team_id in teams}

    # Aggregate trades per team and player
    for trade in trades:
        team_id = trade["team_id"]
        action = trade["action"]
        qty = trade["quantity"]
        player_id = trade["player_id"]
        if team_id not in team_trades:
            team_trades[team_id] = {"buy": 0, "sell": 0}
        team_trades[team_id][action] += qty
        if player_id not in player_payouts:
            player_payouts[player_id] = 0.0

    # Apply payouts and slippage
    updated_prices = {}
    for team_id, counts in team_trades.items():
        old_price = teams[team_id]["tournament_price"]
        total_buys = counts["buy"]
        total_sells = counts["sell"]
        net_trades = total_buys - total_sells

        # Slippage factor ±2%
        slip = 0.02 * net_trades
        # Clamp slip to [-0.2, 0.2] for sanity
        slip = max(min(slip, 0.2), -0.2)

        won = outcomes.get(team_id, False)
        # Determine new price
        if won:
            new_price = old_price * (1 + 0.1 + slip)
        else:
            new_price = old_price * (1 - 0.05 + slip)

        updated_prices[team_id] = {
            "old_price": old_price,
            "new_price": new_price,
            "slip": slip,
            "buys": total_buys,
            "sells": total_sells
        }

    # Calculate player payouts
    for trade in trades:
        team_id = trade["team_id"]
        player_id = trade["player_id"]
        qty = trade["quantity"]
        action = trade["action"]
        won = outcomes.get(team_id, False)
        old_price = teams[team_id]["tournament_price"]

        # Base payout calculation
        if action == "buy":
            if won:
                payout = qty * old_price * 1.0  # win multiplier
            else:
                payout = -qty * old_price
        elif action == "sell":
            if won:
                payout = -qty * old_price
            else:
                payout = qty * old_price
        else:
            payout = 0

        player_payouts[player_id] += payout

    return updated_prices, player_payouts

def save_updated_prices(updated_prices, output_file):
    with open(output_file, "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["team_id", "old_price", "new_price", "buys", "sells", "slip"])
        for team_id, vals in updated_prices.items():
            writer.writerow([
                team_id,
                round(vals["old_price"], 2),
                round(vals["new_price"], 2),
                vals["buys"],
                vals["sells"],
                round(vals["slip"], 4)
            ])

def save_player_payouts(player_payouts, output_file):
    with open(output_file, "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["player_id", "total_payout"])
        for player_id, payout in player_payouts.items():
            writer.writerow([player_id, round(payout, 2)])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--round", type=int, required=True, help="Round number")
    parser.add_argument("--trades", type=str, required=True, help="Path to mock trades CSV")
    parser.add_argument("--prices", type=str, default="initial_prices.csv", help="Path to current prices CSV")
    parser.add_argument("--outcomes", type=str, default="tournament_outcomes.csv", help="Path to tournament outcomes CSV")
    args = parser.parse_args()

    teams = load_teams(args.prices)
    outcomes = load_outcomes(args.outcomes, args.round)
    trades = load_trades(args.trades)

    updated_prices, player_payouts = calculate_round(teams, outcomes, trades)

    # Save outputs
    save_updated_prices(updated_prices, f"updated_prices_round{args.round}.csv")
    save_player_payouts(player_payouts, f"payouts_round{args.round}.csv")

    print(f"Round {args.round} calculations complete.")
    print(f"Updated prices saved to updated_prices_round{args.round}.csv")
    print(f"Player payouts saved to payouts_round{args.round}.csv")

if __name__ == "__main__":
    main()
