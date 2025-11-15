# Challenge System Overview

## Table of Contents
1. [Challenge Objective](#challenge-objective)
2. [How the Challenge Works](#how-the-challenge-works)
3. [Current Implementation](#current-implementation)
4. [Conversation Summary](#conversation-summary)
5. [Known Issues & Limitations](#known-issues--limitations)

---

## Challenge Objective

The challenge is a **tournament simulation game** where players compete by trading financial contracts based on tournament matchup outcomes. The goal is to:

1. **Simulate a multi-round tournament bracket** (16 teams → 8 → 4 → 2 → 1 winner)
2. **Allow players to trade contracts** representing:
   - **Asset 1 (Matchup Outcome):** Contract that pays $100 if their team wins the round, $0 if they lose
   - **Asset 2 (Tournament Winner):** Contract that pays $100 if their team wins the entire tournament, $0 otherwise
3. **Track player performance** across rounds:
   - Cumulative profit/loss (P&L)
   - Liquid balance (available cash)
   - Amount invested in positions
4. **Enforce market rules:**
   - Players start with $500 spending limit
   - Can spend more if they make profits
   - Prices adjust with market demand (slippage)
5. **Create a competitive leaderboard** showing who made the most profit

---

## How the Challenge Works

### Tournament Structure
- **Round of 16:** 16 teams → 8 winners
- **Round of 8:** 8 teams → 4 winners
- **Quarterfinals:** 4 teams → 2 winners
- **Semifinals:** 2 teams → 1 winner
- **Finals:** Winner determined
- **Champion:** Winner is declared

### Player Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Player opens challenge page                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Portal displays:                                          │
│    - Portfolio summary (cumulative P&L, liquid balance)     │
│    - Calculate Payouts tab (for each round)                 │
│    - Tournament Bracket tab (view matchups & winners)       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. For Each Round:                                           │
│    a) View tournament bracket for current round             │
│    b) Upload CSV file with buy/sell orders                  │
│       Format: player_id, team_id, action, quantity, asset  │
│    c) System calculates payouts & updates portfolio         │
│    d) Portfolio accumulates across all rounds               │
└─────────────────────────────────────────────────────────────┘
```

### Pricing Mechanism
- Prices are generated per round with realistic noise
- Prices vary by team and matchup based on win probability
- Slippage applied based on buy/sell volume
- Players see prices when they calculate (not before)

---

## Current Implementation

### Architecture Overview

```
Frontend (React/Next.js)
├── ChallengeUpload.tsx
│   ├─ Portfolio display (sessionStorage)
│   ├─ Round selection
│   ├─ CSV upload
│   └─ Payout calculation
├── TournamentBracket.tsx
│   ├─ Bracket visualization
│   ├─ Round selection
│   └─ Password protection
└── Challenge page
    └─ Tab-based navigation

Backend (Next.js API Routes)
├── /api/challenge-calculate
│   ├─ Receives: CSV file + portfolio state
│   ├─ Creates temp portfolio CSV
│   └─ Calls Python script
├── /api/portfolio-state
│   └─ Returns portfolio from store (optional)
└── /api/tournament-results
    └─ Serves tournament results CSV

Python Scripts (src/app/api/challenge-csv/)
├── calculate_payout_price.py (Main calculation engine)
├── generate_initial_state.py
├── generate_round_prices.py
├── simulate_tournament.py
└── distributions.py
```

### Key Scripts & Files

#### 1. **calculate_payout_price.py** - Main Engine
**Purpose:** Calculate player payouts for a given round

**Input:**
- `--round` (1-5): Round number
- `--trades`: Uploaded CSV file with player trades
- `--round-prices`: Prices for current round
- `--portfolio`: Current portfolio state
- `--password`: Round password for verification

**Output:**
- `payouts_roundN.csv`: Player payouts (player_id, asset1_realized, asset2_pnl, total_payout)
- `PORTFOLIO_JSON`: Portfolio state as JSON (stdout)

**Logic:**
1. Load existing portfolio state
2. Load tournament outcomes & prices
3. **Validate spending limit:**
   - Check if player has liquid balance for trades
   - Return `SPENDING_LIMIT_ERROR` if insufficient funds
4. Load player trades
5. Calculate payouts:
   - **Asset 1:** Realized at round end (100 if win, 0 if lose)
   - **Asset 2:** Realized if team eliminated, otherwise unrealized
6. Update portfolio:
   - Cumulative P&L += round P&L
   - Liquid balance -= buy costs + sell proceeds + round P&L
   - Total invested += buy costs - sell proceeds
7. Output results

#### 2. **tournament_outcomes.csv** - Tournament Results
**Purpose:** Stores the tournament simulation results

**Format:**
```
team_id,round,winner
Team_1,1,1
Team_2,1,0
...
```

**Importance:** Determines if teams won/lost each round, used to calculate Asset 1 payouts

#### 3. **round_N_prices.csv** - Round Prices
**Purpose:** Official prices for each team's assets in a given round

**Format:**
```
round,team_A,team_B,team_A_price,team_B_price,team_A_tournament_price,team_B_tournament_price
1,Team_9,Team_18,1.03,98.97,1,28.66
```

**Importance:**
- Prices are fixed per round (no real-time pricing)
- Players don't see prices until they calculate
- Prevents arbitrage opportunities
- Created by `generate_round_prices.py`

#### 4. **portfolio_state.csv** - Portfolio Tracking
**Purpose:** Persistent storage of player portfolio state

**Format:**
```
player_id,cumulative_pnl,liquid_balance,total_invested
p025,43.71,443.71,56.29
p026,-50.00,450.00,50.00
```

**Importance:**
- Should maintain state across rounds
- **CURRENTLY NOT WORKING AS INTENDED** (see Known Issues)

#### 5. **ChallengeUpload.tsx** - Frontend Component
**Purpose:** Upload trades, calculate payouts, display portfolio

**Features:**
- Password protection per round
- Portfolio display (from sessionStorage)
- CSV file upload
- Payout results display
- Download payout CSV

**State Management:**
- `portfolio` state in sessionStorage
- Loaded on mount
- Updated after each calculation
- Sent to API on each request

#### 6. **TournamentBracket.tsx** - Tournament Visualization
**Purpose:** Display tournament bracket with round-by-round progression

**Features:**
- 6 round options (Round of 16 through Champion)
- Password protection
- Winners only visible in next round
- Matchup visualization

---

## Conversation Summary

### Problems

1. **Portfolio Not Updating Across Rounds** 

2. **Player's total asset is not able to effectively be tracked across rounds** 

3. **Calcualtor is still having trouble calulating longterm gain/loss (unrealized gain/loss) and shortterm gain/loss (realized gain/loss)** 




### Implementation Decisions

- **No Database:** Use browser sessionStorage for simplicity
- **Session-Based:** Portfolio resets when browser closes (acceptable for tournament)
- **Static Prices:** Prices locked per round, not dynamic during round
- **Password Protection:** Each round requires password to access
- **Temporary Files:** API creates temp CSV files for Python script

---

## Known Issues & Limitations

### 🔴 CRITICAL ISSUES

#### 1. **Portfolio State File (portfolio_state.csv) Not Used Properly**
**Problem:**
- The `portfolio_state.csv` file on disk is never updated by the frontend
- If system restarts, all portfolio data is lost
- Only sessionStorage persists data (within single browser session)
- No long-term persistence mechanism

**Impact:**
- Tournament data is lost if server restarts
- Players lose progress if browser closes
- Not suitable for production without database

**Expected Behavior:**
- Portfolio should persist across browser sessions
- Or clearly communicate that data resets

**Current Workaround:**
- Data persists in sessionStorage only during active session
- Fine for single-day tournament, not for multi-day

---

#### 2. **Spending Limit Check May Not Be Accurate**
**Problem:**
- Spending limit validation happens per trade
- If player has multiple trades in one upload, could exceed limit across trades
- No atomic transaction - first trade might pass but subsequent trades fail

**Impact:**
- Players might be able to exceed $500 spending if trades are combined

**Example:**
```
Trade 1: Buy 100 contracts at $3 = $300 (passes, liquid=$200 remaining)
Trade 2: Buy 100 contracts at $3 = $300 (fails, but Trade 1 already executed)
```

**Expected Behavior:**
- Either validate all trades before execution
- Or prevent partial execution

---

#### 3. **Asset 2 P&L Calculation Unclear**
**Problem:**
- Asset 2 is supposed to track if a team wins the entire tournament
- But payouts are calculated at end of each round
- Unclear what "unrealized P&L" means for Asset 2 mid-tournament

**Impact:**
- Players don't know what their Asset 2 position is worth
- No way to "exit" Asset 2 positions early
- Positions are locked until team is eliminated

**Expected Behavior:**
- Either: Allow players to sell Asset 2 at current market price
- Or: Clarify that Asset 2 cannot be sold/traded

---

#### 4. **No Price Visibility Before Trading**
**Problem:**
- Prices are hidden until player calculates (uploads CSV)
- Players must guess prices when creating CSV
- Creates unfair information asymmetry

**Impact:**
- Players can't make informed decisions
- Prices might be completely different than expected
- Trades calculated at different times see different prices

**Expected Behavior:**
- Either: Show prices before upload
- Or: Allow price inquiry endpoint
- Or: Clearly communicate that prices are unknown

---

#### 5. **Tournament Results & Brackets Hardcoded**
**Problem:**
- Tournament outcomes are pre-determined (`tournament_outcomes.csv`)
- No actual tournament simulation
- Results might not be realistic

**Impact:**
- Can't change tournament results mid-way
- Not a true simulation
- Players may notice predetermined patterns

**Expected Behavior:**
- Either: Generate realistic tournament simulation
- Or: Clearly label as predetermined for consistency

---

### ⚠️ DESIGN LIMITATIONS

#### 1. **No Real-Time Price Updates**
- Prices locked per round
- No price discovery mechanism
- No bid-ask spread

#### 2. **No Position Management UI**
- Players can't see current positions
- Can't exit positions early
- No portfolio breakdown by team

#### 3. **No Order History**
- Players can't see past orders
- Can't review trade history
- Can't analyze performance

#### 4. **No Settlement/Closing Mechanism**
- Unclear when Asset 1 position closes
- Asset 2 positions unclear
- No clear contract expiration

#### 5. **Password Security**
- Passwords stored in frontend code (visible in browser)
- Anyone with access to code can view passwords
- Not secure for real competition

#### 6. **No Multi-Player Features**
- No way to see opponent portfolios
- No leaderboard
- No real-time competition view

#### 7. **CSV Upload Friction**
- Players must manually create CSV files
- No in-app trading interface
- High barriers to entry

---

### 🟡 TECHNICAL DEBT

#### 1. **store.ts Still Exists But Unused**
- Backend store file created but not used
- Can be deleted now that using sessionStorage
- Creates confusion

#### 2. **portfolio-state API Route Optional**
- Endpoint exists but frontend doesn't use it
- Could be removed to simplify
- Left for debugging only

#### 3. **Python Script Dependencies**
- Multiple CSV files that must exist
- Fragile file path dependencies
- Hard to test in isolation

#### 4. **No Logging/Debugging**
- Hard to trace calculation errors
- No audit trail of trades
- Difficult to debug player issues

#### 5. **Error Messages Not Detailed**
- "Calculation failed" doesn't specify why
- Players don't know what went wrong
- Hard to debug CSV format issues

---

## Recommendations

### High Priority
1. **Add database** to persist portfolio data across sessions
2. **Fix spending limit validation** to be atomic across all trades
3. **Clarify Asset 2 mechanics** - can it be traded early?
4. **Show prices before upload** or provide price inquiry endpoint

### Medium Priority
1. Add position management UI
2. Implement order history tracking
3. Create detailed error messages
4. Add real-time tournament bracket updates

### Low Priority
1. Remove unused store.ts file
2. Simplify API routes
3. Add comprehensive logging
4. Implement leaderboard

---

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │
│ sessionStorage│
└──────┬───────┘
       │ (portfolio JSON)
       │
       ▼
┌──────────────────────────────┐
│  Frontend                    │
│  - ChallengeUpload.tsx       │
│  - TournamentBracket.tsx     │
└──────┬───────────────────────┘
       │ (CSV file + portfolio)
       │
       ▼
┌──────────────────────────────┐
│  API Route                   │
│  /challenge-calculate        │
│  - Receives portfolio        │
│  - Writes temp CSV           │
└──────┬───────────────────────┘
       │ (portfolio CSV)
       │
       ▼
┌──────────────────────────────┐
│  Python Script               │
│  calculate_payout_price.py   │
│  - Loads portfolio           │
│  - Calculates payouts        │
│  - Updates portfolio         │
│  - Outputs JSON              │
└──────┬───────────────────────┘
       │ (payouts + portfolio JSON)
       │
       ▼
┌──────────────────────────────┐
│  API Route                   │
│  - Extracts portfolio JSON   │
│  - Returns to frontend       │
└──────┬───────────────────────┘
       │ (payouts + portfolio)
       │
       ▼
┌──────────────────────────────┐
│  Frontend                    │
│  - Saves to sessionStorage   │
│  - Displays results          │
└──────────────────────────────┘
```

---

## Conclusion

The challenge system is **functionally working** for a single-session tournament but has several **design limitations and potential data loss issues**. The main concerns are:

1. **Data persistence** - portfolio data lost on browser close
2. **Spending limit accuracy** - potential edge cases
3. **Asset 2 clarity** - unclear trading mechanics
4. **User experience** - no price visibility, CSV friction
5. **Security** - passwords visible in code

For a production system, implementing a database and adding proper error handling/logging would significantly improve reliability and user experience.

