# Fix Verification for Calculate.ts

## The Bug
The original code was only accounting for BUY costs when converting P&L to payout, which caused incorrect liquid balance calculations, especially when there were SELL trades or after multiple rounds.

## The Fix
Changed the payout calculation to account for both BUY and SELL trades using a `netCostAdjustment`:
- For BUYs: Add cost (because payout = P&L + cost)
- For SELLs: Subtract cost (because for short positions, payout = cost - P&L)

## Test Cases

### Test 1: Buy position, team loses
- Initial: liquid_balance = 500
- Action: Buy 5 contracts at 50 (cost = 250)
- Outcome: Team loses → payout = 0, P&L = -250
- Expected: liquid_balance = 250
- Calculation:
  - After buy: 500 - 250 = 250
  - netCostAdjustment: +250 (buy)
  - After settlement: 250 + (-250 + 250) = 250 ✓

### Test 2: Buy position, team wins
- Initial: liquid_balance = 500
- Action: Buy 5 contracts at 50 (cost = 250)
- Outcome: Team wins → payout = 500, P&L = 250
- Expected: liquid_balance = 750
- Calculation:
  - After buy: 500 - 250 = 250
  - netCostAdjustment: +250 (buy)
  - After settlement: 250 + (250 + 250) = 750 ✓

### Test 3: Sell position, team wins (worst case)
- Initial: liquid_balance = 500
- Action: Sell 5 contracts at 50 (cost = 250)
- Outcome: Team wins → payout = 500, P&L = -250
- Expected: liquid_balance = 250
- Calculation:
  - After sell: 500 + 250 = 750 (received upfront)
  - netCostAdjustment: -250 (sell)
  - After settlement: 750 + (-250 - 250) = 250 ✓

### Test 4: Sell position, team loses (best case)
- Initial: liquid_balance = 500
- Action: Sell 5 contracts at 50 (cost = 250)
- Outcome: Team loses → payout = 0, P&L = 250
- Expected: liquid_balance = 750
- Calculation:
  - After sell: 500 + 250 = 750
  - netCostAdjustment: -250 (sell)
  - After settlement: 750 + (250 - 250) = 750 ✓

## Summary
The fix ensures that liquid balance is correctly updated by:
1. Subtracting cost when buying (money spent)
2. Adding cost when selling (money received)
3. Adding the full payout at settlement (not just P&L)

This prevents the "double subtraction" bug where costs were being deducted twice.

