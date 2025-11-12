import csv
import random
from datetime import datetime, timedelta
import os

# ==========================
# CONFIGURATION
# ==========================

NUM_PLAYERS = 40
NUM_ROUNDS = 5
ROUND_TEAM_COUNTS = [32, 16, 8, 4, 2]
OUTPUT_DIR = "./mock_trades_by_round"

# Probability and price config per round
ROUND_CONFIG = {
    1: {"p_buy": 1.0, "p_sell": 0.0, "price_sd": 15},
    2: {"p_buy": 0.6, "p_sell": 0.4, "price_sd": 10},
    3: {"p_buy": 0.55, "p_sell": 0.45, "price_sd": 8},
    4: {"p_buy": 0.5, "p_sell": 0.5, "price_sd": 5},
    5: {"p_buy": 0.45, "p_sell": 0.55, "price_sd": 3},
}

START_TIME = datetime(2025, 11, 11, 9, 0, 0)
TIME_GAP_RANGE = (5, 180)  # seconds between trades
TRADE_ID_START = 1


# ==========================
# HELPER FUNCTIONS
# ==========================

def random_price(mean=50, sd=10):
    price = random.gauss(mean, sd)
    return max(10, min(100, round(price, 2)))


def random_quantity():
    q = int(random.gauss(10, 5))
    return max(1, min(20, q))


def random_action(round_num):
    cfg = ROUND_CONFIG[round_num]
    if random.random() < cfg["p_buy"]:
        return "BUY"
    return "SELL"


def generate_trades_for_round(round_num, trade_id_start=1):
    """Generate a list of mock trades for a given round."""
    trades = []
    cfg = ROUND_CONFIG[round_num]
    num_teams = ROUND_TEAM_COUNTS[round_num - 1]

    players = [f"p{str(i).zfill(3)}" for i in range(1, NUM_PLAYERS + 1)]
    teams = [f"Team_{i}" for i in range(1, num_teams + 1)]

    current_time = START_TIME + timedelta(days=(round_num - 1))
    trade_id = trade_id_start

    num_trades = random.randint(150, 250)  # trades per round

    for _ in range(num_trades):
        player = random.choice(players)
        team = random.choice(teams)
        action = random_action(round_num)
        quantity = random_quantity()
        price = random_price(50, cfg["price_sd"])

        # write trade
        trades.append({
            "trade_id": trade_id,
            "player_id": player,
            "team_id": team,
            "round": round_num,
            "action": action,
            "quantity": quantity,
            "price": price,
            "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S")
        })

        # increment
        trade_id += 1
        current_time += timedelta(seconds=random.randint(*TIME_GAP_RANGE))

    return trades, trade_id


def write_trades_to_csv(trades, round_num):
    """Write trades to CSV for a specific round."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = os.path.join(OUTPUT_DIR, f"mock_trades_round{round_num}.csv")

    with open(filename, "w", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["trade_id", "player_id", "team_id", "round",
                        "action", "quantity", "price", "timestamp"]
        )
        writer.writeheader()
        writer.writerows(trades)

    print(f"✅ Wrote {len(trades)} trades to {filename}")


# ==========================
# MAIN SCRIPT
# ==========================

def main():
    trade_id = TRADE_ID_START
    for r in range(1, NUM_ROUNDS + 1):
        trades, trade_id = generate_trades_for_round(r, trade_id)
        write_trades_to_csv(trades, r)


if __name__ == "__main__":
    main()
