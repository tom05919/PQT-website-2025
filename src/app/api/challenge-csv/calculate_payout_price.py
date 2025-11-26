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
    """Load portfolio state from JSON file"""
    portfolio = {}  # player_id -> {cumulative_pnl, liquid_balance, total_invested}
    try:
        with open(portfolio_file, 'r') as f:
            data = json.load(f)
            # Convert to expected format (for backwards compatibility)
            for player_id, state in data.items():
                portfolio[player_id] = {
                    "cumulative_pnl": float(state.get("cumulative_pnl", 0)),
                    "liquid_balance": float(state.get("liquid_balance", 500)),
                    "total_invested": float(state.get("total_invested", 0))
                }
    except (FileNotFoundError, json.JSONDecodeError):
        # Try CSV format for backwards compatibility
        try:
            with open(portfolio_file, newline='') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    player_id = row.get("player_id", "").strip()
                    if player_id:
                        portfolio[player_id] = {
                            "cumulative_pnl": float(row.get("cumulative_pnl", 0)),
                            "liquid_balance": float(row.get("liquid_balance", 500)),
                            "total_invested": float(row.get("total_invested", 0))
                        }
        except FileNotFoundError:
            pass
    return portfolio

def save_portfolio_state(portfolio, portfolio_file):
    """Save updated portfolio state to JSON file"""
    # Ensure directory exists
    os.makedirs(os.path.dirname(portfolio_file), exist_ok=True)
    with open(portfolio_file, 'w') as f:
        json.dump(portfolio, f, indent=2)

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

def calculate_round(teams, outcomes, trades, round_prices, portfolio=None):
    """
    Calculate payouts with both realized and unrealized P&L.
    
    Asset 1: Expires after round. Payout = 100 if correct, 0 if incorrect.
    Asset 2: Carries forward. Track current position and P&L.
    """
    player_positions = {}  # player_id -> {"asset1": {...}, "asset2": {...}}
    player_realized_pnl = {}  # player_id -> realized P&L
    player_unrealized_pnl = {}  # player_id -> unrealized P&L
    player_asset1_pnl = {}  # player_id -> asset 1 P&L (realized at end of round)
    player_holdings = {}  # player_id -> {(team, asset): net_quantity}
    
    # Initialize player records
    for trade in trades:
        player_id = trade["player_id"]
        if player_id not in player_positions:
            player_positions[player_id] = {"asset1": [], "asset2": []}
            player_realized_pnl[player_id] = 0.0
            player_unrealized_pnl[player_id] = 0.0
            player_asset1_pnl[player_id] = 0.0
            player_holdings[player_id] = {}
    
    # Load existing holdings from portfolio (for Asset 2 which carries forward)
    if portfolio:
        for player_id in player_holdings:
            # TODO: We need to track holdings in portfolio state
            # For now, assume holdings start at 0 each round
            pass
    
    # Process trades and validate positions
    for trade in trades:
        player_id = trade["player_id"]
        team_id = trade["team_id"]
        action = trade["action"]
        quantity = trade["quantity"]
        price = trade["price"]
        asset = trade["asset"]
        
        # Create holding key
        holding_key = (team_id, asset)
        if holding_key not in player_holdings[player_id]:
            player_holdings[player_id][holding_key] = 0.0
        
        # Check if sell would result in negative position (overselling)
        if action == "sell":
            current_holding = player_holdings[player_id][holding_key]
            if current_holding < quantity:
                print(f"POSITION_ERROR:Player {player_id} trying to sell {quantity} of {team_id} asset {asset}, but only owns {current_holding}")
                return None
        
        # Update holdings
        if action == "buy":
            player_holdings[player_id][holding_key] += quantity
        elif action == "sell":
            player_holdings[player_id][holding_key] -= quantity
        
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
    # Ensure directory exists before writing
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
    
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
    parser.add_argument("--portfolio", type=str, default="portfolio_state.json", help="Path to portfolio state JSON file")
    parser.add_argument("--payouts-output", type=str, help="Path where payouts CSV should be saved (optional)")
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
    
    # Initialize all players first
    for trade in trades:
        player_id = trade["player_id"]
        if player_id not in portfolio:
            portfolio[player_id] = {
                "cumulative_pnl": 0,
                "liquid_balance": 500,
                "total_invested": 0
            }
    
    # Check spending limits before processing trades (accumulate costs per player)
    player_costs = {}  # player_id -> total buy cost
    for trade in trades:
        player_id = trade["player_id"]
        if trade["action"] == "buy":
            cost = trade["quantity"] * trade["price"]
            player_costs[player_id] = player_costs.get(player_id, 0) + cost
    
    # Check each player's total costs against their balance
    for player_id, total_cost in player_costs.items():
        available = portfolio[player_id]["liquid_balance"]
        if total_cost > available:
            print(f"SPENDING_LIMIT_ERROR")
            return
    
    player_payouts = calculate_round(teams, outcomes, trades, round_prices, portfolio)
    
    # Check if calculation failed due to position error
    if player_payouts is None:
        return
    
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
    
    # Save outputs - use provided payouts output path or default to script directory
    if args.payouts_output:
        payouts_output_path = args.payouts_output
    else:
        # Fallback to script directory
        payouts_output_path = os.path.join(os.path.dirname(args.portfolio) if args.portfolio and os.path.dirname(args.portfolio) else ".", f"payouts_round{args.round}.csv")
    
    save_player_payouts(player_payouts, payouts_output_path)
    save_portfolio_state(portfolio, args.portfolio)
    
    # Output portfolio state as JSON for API consumption
    portfolio_json = json.dumps(portfolio, indent=2)
    print(f"PORTFOLIO_JSON:{portfolio_json}")
    print(f"Round {args.round} calculations complete.")
    print(f"Player payouts saved to payouts_round{args.round}.csv")

if __name__ == "__main__":
    main()
