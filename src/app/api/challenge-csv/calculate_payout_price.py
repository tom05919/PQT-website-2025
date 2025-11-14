import csv
import argparse
import os
import random
import json

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

def load_round_prices(prices_file, round_num):
    """Load prices for both assets from round_N_prices.csv"""
    prices = {}  # prices[team] = {"asset1": price, "asset2": price}
    try:
        with open(prices_file, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                teamA = row.get("team_A", "").strip()
                teamB = row.get("team_B", "").strip()
                
                if teamA:
                    if teamA not in prices:
                        prices[teamA] = {}
                    prices[teamA]["asset1"] = float(row.get("team_A_price", 0))
                    prices[teamA]["asset2"] = float(row.get("team_A_tournament_price", 0))
                
                if teamB:
                    if teamB not in prices:
                        prices[teamB] = {}
                    prices[teamB]["asset1"] = float(row.get("team_B_price", 0))
                    prices[teamB]["asset2"] = float(row.get("team_B_tournament_price", 0))
    except FileNotFoundError:
        pass
    return prices

def load_portfolio_state(portfolio_file):
    """Load portfolio state for all players"""
    portfolio = {}  # player_id -> {cumulative_pnl, liquid_balance, total_invested}
    try:
        with open(portfolio_file, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                player_id = row.get("player_id", "").strip()
                if player_id:
                    portfolio[player_id] = {
                        "cumulative_pnl": float(row.get("cumulative_pnl", 0)),
                        "liquid_balance": float(row.get("liquid_balance", 500)),  # Start with $500
                        "total_invested": float(row.get("total_invested", 0))
                    }
    except FileNotFoundError:
        pass
    return portfolio

def save_portfolio_state(portfolio, portfolio_file):
    """Save updated portfolio state"""
    with open(portfolio_file, "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["player_id", "cumulative_pnl", "liquid_balance", "total_invested"])
        for player_id, state in sorted(portfolio.items()):
            writer.writerow([
                player_id,
                round(state.get("cumulative_pnl", 0), 2),
                round(state.get("liquid_balance", 0), 2),
                round(state.get("total_invested", 0), 2)
            ])

def load_trades(trades_file, round_prices):
    """Load trades, supporting both asset 1 and asset 2. Prices are looked up from round_prices."""
    trades = []
    with open(trades_file, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Support both "team_id" and "team" column names
            team_id = (row.get("team_id") or row.get("team") or "").strip()
            action = (row.get("action") or "").strip().upper()
            player_id = (row.get("player_id") or "").strip()
            quantity_raw = row.get("quantity")
            asset_type = (row.get("asset") or "1").strip()  # Default to asset 1 if not specified
            
            if not team_id or not action or not player_id:
                continue
            if action not in ("BUY", "SELL"):
                continue
            try:
                quantity = float(quantity_raw)
            except (TypeError, ValueError):
                quantity = 0.0
            
            # Look up price from round_prices based on asset type
            if team_id in round_prices:
                if asset_type == "1":
                    price = round_prices[team_id].get("asset1", 0)
                else:  # asset 2
                    price = round_prices[team_id].get("asset2", 0)
            else:
                price = 0.0
            
            trades.append({
                "player_id": player_id,
                "team_id": team_id,
                "action": action.lower(),
                "quantity": quantity,
                "price": price,
                "asset": asset_type
            })
    return trades

def calculate_round(teams, outcomes, trades, round_prices):
    """
    Calculate payouts with both realized and unrealized P&L.
    
    Asset 1: Expires after round. Payout = 100 if correct, 0 if incorrect.
    Asset 2: Carries forward. Track current position and P&L.
    """
    player_positions = {}  # player_id -> {"asset1": {...}, "asset2": {...}}
    player_realized_pnl = {}  # player_id -> realized P&L
    player_unrealized_pnl = {}  # player_id -> unrealized P&L
    player_asset1_pnl = {}  # player_id -> asset 1 P&L (realized at end of round)
    
    # Initialize player records
    for trade in trades:
        player_id = trade["player_id"]
        if player_id not in player_positions:
            player_positions[player_id] = {"asset1": [], "asset2": []}
            player_realized_pnl[player_id] = 0.0
            player_unrealized_pnl[player_id] = 0.0
            player_asset1_pnl[player_id] = 0.0
    
    # Process trades
    for trade in trades:
        player_id = trade["player_id"]
        team_id = trade["team_id"]
        action = trade["action"]
        quantity = trade["quantity"]
        price = trade["price"]
        asset = trade["asset"]
        
        if asset == "1":
            # Asset 1: Track BUY/SELL positions
            if action == "buy":
                player_positions[player_id]["asset1"].append({
                    "team": team_id,
                    "quantity": quantity,
                    "price": price,
                    "type": "buy"
                })
            elif action == "sell":
                # Sell: Try to match with existing buy positions
                player_positions[player_id]["asset1"].append({
                    "team": team_id,
                    "quantity": quantity,
                    "price": price,
                    "type": "sell"
                })
        
        elif asset == "2":
            # Asset 2: Track positions like traditional securities
            if action == "buy":
                player_positions[player_id]["asset2"].append({
                    "team": team_id,
                    "quantity": quantity,
                    "price": price,
                    "type": "buy"
                })
            elif action == "sell":
                player_positions[player_id]["asset2"].append({
                    "team": team_id,
                    "quantity": quantity,
                    "price": price,
                    "type": "sell"
                })
    
    # Calculate Asset 1 realized P&L (expires at end of round)
    for player_id, positions in player_positions.items():
        for position in positions["asset1"]:
            team = position["team"]
            qty = position["quantity"]
            price = position["price"]
            
            # Asset 1 payout: 1.0 per contract if correct, 0 if incorrect
            # (price is on 0-100 scale, so payout should be on same scale)
            if outcomes.get(team, False):
                payout = qty * 100.0  # Each contract pays 100 if correct
            else:
                payout = 0.0
            
            # Cost basis (price is already on 0-100 scale)
            cost = qty * price
            
            # P&L calculation
            if position["type"] == "buy":
                pnl = payout - cost
            else:  # sell
                pnl = cost - payout
            
            player_asset1_pnl[player_id] += pnl
    
    # Calculate Asset 2 P&L (realized if team lost, unrealized if team still alive)
    updated_prices = {}
    team_trades_summary = {}
    
    for player_id, positions in player_positions.items():
        # Track positions by team
        team_positions = {}  # team -> list of buy/sell records
        
        for position in positions["asset2"]:
            team = position["team"]
            if team not in team_positions:
                team_positions[team] = []
            team_positions[team].append(position)
        
        # Calculate P&L for each team position
        for team, team_pos_list in team_positions.items():
            # Check if team is still alive (didn't lose in this round)
            team_lost = not outcomes.get(team, False)
            
            if team_lost:
                # Team lost - asset 2 is now worth 0 (realized loss)
                settlement_price = 0.0
            else:
                # Team still alive - use current market price (unrealized)
                settlement_price = round_prices.get(team, {}).get("asset2", 0)
            
            for position in team_pos_list:
                qty = position["quantity"]
                entry_price = position["price"]
                
                if position["type"] == "buy":
                    # Long position: profit if price goes up, loss if goes down
                    pnl = qty * (settlement_price - entry_price)
                else:  # sell
                    # Short position: profit if price goes down, loss if goes up
                    pnl = qty * (entry_price - settlement_price)
                
                # If team lost, this is realized P&L; otherwise unrealized
                if team_lost:
                    player_asset1_pnl[player_id] += pnl  # Add to asset1 bucket for realized losses
                else:
                    player_unrealized_pnl[player_id] += pnl  # Keep as unrealized
    
    # Combine asset1 (realized) and asset2 (may be realized or unrealized)
    player_payouts = {}
    for player_id in player_positions:
        # Asset 1 P&L is fully realized at end of round (expires)
        # Asset 2 P&L is realized if team lost, otherwise unrealized
        asset1_realized = player_asset1_pnl[player_id]
        asset2_pnl = player_unrealized_pnl[player_id]  # May include realized losses if team lost
        total_payout = asset1_realized + asset2_pnl
        
        player_payouts[player_id] = {
            "asset1_realized": asset1_realized,
            "asset2_pnl": asset2_pnl,
            "total": total_payout
        }
    
    return player_payouts

def save_player_payouts(player_payouts, output_file):
    with open(output_file, "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["player_id", "asset1_realized", "asset2_pnl", "total_payout"])
        for player_id, payouts in player_payouts.items():
            writer.writerow([
                player_id,
                round(payouts.get("asset1_realized", 0), 2),
                round(payouts.get("asset2_pnl", 0), 2),
                round(payouts.get("total", 0), 2)
            ])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--round", type=int, required=True, help="Round number")
    parser.add_argument("--trades", type=str, required=True, help="Path to trades CSV")
    parser.add_argument("--prices", type=str, default="initial_prices.csv", help="Path to current prices CSV")
    parser.add_argument("--outcomes", type=str, default="tournament_outcomes.csv", help="Path to tournament outcomes CSV")
    parser.add_argument("--round-prices", type=str, help="Path to round_N_prices.csv for asset prices")
    parser.add_argument("--password", type=str, required=False, help="Password for this round (optional)")
    parser.add_argument("--portfolio", type=str, default="portfolio_state.csv", help="Path to portfolio state CSV")
    args = parser.parse_args()

    teams = load_teams(args.prices)
    outcomes = load_outcomes(args.outcomes, args.round)
    
    # Load round prices (required for price lookups)
    round_prices = {}
    if args.round_prices:
        round_prices = load_round_prices(args.round_prices, args.round)
    else:
        print("Warning: No round prices file provided. Prices will default to 0.")
    
    trades = load_trades(args.trades, round_prices)
    
    # Load portfolio state
    portfolio = load_portfolio_state(args.portfolio)
    
    # Check spending limits before processing trades
    total_buy_cost = 0
    for trade in trades:
        player_id = trade["player_id"]
        if trade["action"] == "buy":
            cost = trade["quantity"] * trade["price"]
            total_buy_cost += cost
            
            # Initialize player if not in portfolio
            if player_id not in portfolio:
                portfolio[player_id] = {
                    "cumulative_pnl": 0,
                    "liquid_balance": 500,
                    "total_invested": 0
                }
            
            # Check if player has enough liquid balance
            available = portfolio[player_id]["liquid_balance"]
            if cost > available:
                print(f"SPENDING_LIMIT_ERROR")
                return
    
    player_payouts = calculate_round(teams, outcomes, trades, round_prices)
    
    # Track which players have trades in this round
    players_in_round = set()
    for trade in trades:
        players_in_round.add(trade["player_id"])
    
    # Update portfolio state with round results
    for player_id in players_in_round:
        if player_id not in portfolio:
            portfolio[player_id] = {
                "cumulative_pnl": 0,
                "liquid_balance": 500,
                "total_invested": 0
            }
        
        # Get payout data for this player (if they have positions that settled)
        payout_data = player_payouts.get(player_id, {})
        round_total = payout_data.get("total", 0)
        
        # Update cumulative P&L with round results
        portfolio[player_id]["cumulative_pnl"] += round_total
        
        # Update liquid balance and total invested based on trades
        # Note: We need to account for the cash flow from the round P&L
        for trade in trades:
            if trade["player_id"] == player_id:
                if trade["action"] == "buy":
                    portfolio[player_id]["liquid_balance"] -= trade["quantity"] * trade["price"]
                    portfolio[player_id]["total_invested"] += trade["quantity"] * trade["price"]
                elif trade["action"] == "sell":
                    portfolio[player_id]["liquid_balance"] += trade["quantity"] * trade["price"]
                    portfolio[player_id]["total_invested"] -= trade["quantity"] * trade["price"]
        
        # Add round P&L to liquid balance (realized gains/losses)
        portfolio[player_id]["liquid_balance"] += round_total
    
    # Save outputs
    save_player_payouts(player_payouts, f"payouts_round{args.round}.csv")
    save_portfolio_state(portfolio, args.portfolio)
    
    # Output portfolio state as JSON for API consumption
    portfolio_json = json.dumps(portfolio, indent=2)
    print(f"PORTFOLIO_JSON:{portfolio_json}")
    print(f"Round {args.round} calculations complete.")
    print(f"Player payouts saved to payouts_round{args.round}.csv")

if __name__ == "__main__":
    main()
