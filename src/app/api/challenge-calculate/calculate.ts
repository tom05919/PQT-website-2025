import fs from 'node:fs';
import path from 'node:path';

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const records: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const record: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }
    records.push(record);
  }
  
  return records;
}

interface RoundPrices {
  [teamId: string]: {
    asset1: number;
    asset2: number;
  };
}

interface Trade {
  player_id: string;
  team_id: string;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  asset: string;
}

interface Position {
  team: string;
  quantity: number;
  price: number;
  type: 'buy' | 'sell';
}

interface PlayerPayout {
  asset1_realized: number;
  asset2_pnl: number;
  total: number;
}

interface CalculateRoundResult {
  payouts: Record<string, PlayerPayout>;
  holdings: Record<string, Record<string, number>>;
}

export interface PortfolioState {
  cumulative_pnl: number;
  liquid_balance: number;
  total_invested: number;
  positions: Record<string, number>;
}

export function loadOutcomes(outcomesFile: string, roundNum: number): Record<string, boolean> {
  const outcomes: Record<string, boolean> = {};
  const content = fs.readFileSync(outcomesFile, 'utf-8');
  const records = parseCSV(content);
  
  for (const row of records) {
    if (parseInt(row.round || '0') === roundNum) {
      outcomes[row.team_id] = row.winner === '1';
    }
  }
  return outcomes;
}

export function loadRoundPrices(pricesFile: string): RoundPrices {
  const prices: RoundPrices = {};
  try {
    const content = fs.readFileSync(pricesFile, 'utf-8');
    const records = parseCSV(content);
    
    for (const row of records) {
      const teamA = (row.team_A || '').trim();
      const teamB = (row.team_B || '').trim();
      
      if (teamA) {
        if (!prices[teamA]) {
          prices[teamA] = { asset1: 0, asset2: 0 };
        }
        prices[teamA].asset1 = parseFloat(row.team_A_price || '0');
        prices[teamA].asset2 = parseFloat(row.team_A_tournament_price || '0');
      }
      
      if (teamB) {
        if (!prices[teamB]) {
          prices[teamB] = { asset1: 0, asset2: 0 };
        }
        prices[teamB].asset1 = parseFloat(row.team_B_price || '0');
        prices[teamB].asset2 = parseFloat(row.team_B_tournament_price || '0');
      }
    }
  } catch (error) {
    console.error('Error loading round prices:', error);
  }
  return prices;
}

export function loadTrades(tradesFile: string, roundPrices: RoundPrices): Trade[] {
  const trades: Trade[] = [];
  const content = fs.readFileSync(tradesFile, 'utf-8');
  const records = parseCSV(content);
  
  for (const row of records) {
    const teamId = (row.team_id || row.team || '').trim();
    const action = (row.action || '').trim().toUpperCase();
    const playerId = (row.player_id || '').trim();
    const assetType = (row.asset || '1').trim();
    
    if (!teamId || !action || !playerId) {
      continue;
    }
    if (action !== 'BUY' && action !== 'SELL') {
      continue;
    }
    
    const quantity = parseFloat(row.quantity || '0') || 0;
    let price = 0;
    
    if (roundPrices[teamId]) {
      if (assetType === '1') {
        price = roundPrices[teamId].asset1 || 0;
      } else {
        price = roundPrices[teamId].asset2 || 0;
      }
    }
    
    trades.push({
      player_id: playerId,
      team_id: teamId,
      action: action.toLowerCase() as 'buy' | 'sell',
      quantity,
      price,
      asset: assetType,
    });
  }
  return trades;
}

export function loadPortfolioState(portfolioFile: string): Record<string, PortfolioState> {
  const portfolio: Record<string, PortfolioState> = {};
  try {
    const content = fs.readFileSync(portfolioFile, 'utf-8');
    const data = JSON.parse(content);
    
    for (const [playerId, state] of Object.entries(data)) {
      const s = state as Partial<PortfolioState>;
      portfolio[playerId] = {
        cumulative_pnl: parseFloat(String(s.cumulative_pnl || 0)),
        liquid_balance: parseFloat(String(s.liquid_balance || 500)),
        total_invested: parseFloat(String(s.total_invested || 0)),
        positions: (s.positions as Record<string, number>) || {},
      };
    }
  } catch (_error) {
    // File doesn't exist or invalid JSON - return empty portfolio
    console.log('Portfolio file not found or invalid, starting fresh');
  }
  return portfolio;
}

export function calculateRound(
  outcomes: Record<string, boolean>,
  trades: Trade[],
  roundPrices: RoundPrices,
  portfolio?: Record<string, PortfolioState>
): CalculateRoundResult | null {
  const playerPositions: Record<string, { asset1: Position[]; asset2: Position[] }> = {};
  const playerUnrealizedPnl: Record<string, number> = {};
  const playerAsset1Pnl: Record<string, number> = {};
  const playerHoldings: Record<string, Record<string, number>> = {}; // player_id -> {team_asset: quantity}
  
  // Initialize player records and load existing holdings from portfolio
  for (const trade of trades) {
    if (!playerPositions[trade.player_id]) {
      playerPositions[trade.player_id] = { asset1: [], asset2: [] };
      playerUnrealizedPnl[trade.player_id] = 0;
      playerAsset1Pnl[trade.player_id] = 0;
      
      // Load existing holdings from portfolio
      if (portfolio && portfolio[trade.player_id] && portfolio[trade.player_id].positions) {
        playerHoldings[trade.player_id] = { ...portfolio[trade.player_id].positions };
      } else {
        playerHoldings[trade.player_id] = {};
      }
    }
  }
  
  // Process trades and validate positions
  for (const trade of trades) {
    const holdingKey = `${trade.team_id}_${trade.asset}`;
    
    if (!playerHoldings[trade.player_id][holdingKey]) {
      playerHoldings[trade.player_id][holdingKey] = 0;
    }
    
    // Check if sell would result in negative position (overselling)
    if (trade.action === 'sell') {
      const currentHolding = playerHoldings[trade.player_id][holdingKey];
      if (currentHolding < trade.quantity) {
        throw new Error(`POSITION_ERROR:Player ${trade.player_id} trying to sell ${trade.quantity} of ${trade.team_id} asset ${trade.asset}, but only owns ${currentHolding}`);
      }
    }
    
    // Update holdings
    if (trade.action === 'buy') {
      playerHoldings[trade.player_id][holdingKey] += trade.quantity;
    } else if (trade.action === 'sell') {
      playerHoldings[trade.player_id][holdingKey] -= trade.quantity;
    }
    
    const position: Position = {
      team: trade.team_id,
      quantity: trade.quantity,
      price: trade.price,
      type: trade.action,
    };
    
    if (trade.asset === '1') {
      playerPositions[trade.player_id].asset1.push(position);
    } else {
      playerPositions[trade.player_id].asset2.push(position);
    }
  }
  
  // Calculate Asset 1 realized P&L (expires at end of round)
  for (const [playerId, positions] of Object.entries(playerPositions)) {
    for (const position of positions.asset1) {
      const payout = outcomes[position.team] ? position.quantity * 100.0 : 0.0;
      const cost = position.quantity * position.price;
      
      let pnl: number;
      if (position.type === 'buy') {
        pnl = payout - cost;
      } else {
        pnl = cost - payout;
      }
      
      playerAsset1Pnl[playerId] = (playerAsset1Pnl[playerId] || 0) + pnl;
    }
  }
  
  // Calculate Asset 2 P&L (realized if team lost, unrealized if team still alive)
  for (const [playerId, positions] of Object.entries(playerPositions)) {
    const teamPositions: Record<string, Position[]> = {};
    
    for (const position of positions.asset2) {
      if (!teamPositions[position.team]) {
        teamPositions[position.team] = [];
      }
      teamPositions[position.team].push(position);
    }
    
    for (const [team, teamPosList] of Object.entries(teamPositions)) {
      const teamLost = !outcomes[team];
      const settlementPrice = teamLost ? 0.0 : (roundPrices[team]?.asset2 || 0);
      
      for (const position of teamPosList) {
        let pnl: number;
        if (position.type === 'buy') {
          pnl = position.quantity * (settlementPrice - position.price);
        } else {
          pnl = position.quantity * (position.price - settlementPrice);
        }
        
        if (teamLost) {
          // Realized loss - add to asset1 bucket for realized losses (though it's really asset2 realized)
          // This matches Python logic where player_asset1_pnl includes realized asset2 losses
          playerAsset1Pnl[playerId] = (playerAsset1Pnl[playerId] || 0) + pnl;
        } else {
          // Unrealized P&L for asset2
          playerUnrealizedPnl[playerId] = (playerUnrealizedPnl[playerId] || 0) + pnl;
        }
      }
    }
  }
  
  // Combine payouts
  const playerPayouts: Record<string, PlayerPayout> = {};
  for (const playerId of Object.keys(playerPositions)) {
    const asset1Realized = playerAsset1Pnl[playerId] || 0;
    const asset2Pnl = playerUnrealizedPnl[playerId] || 0;
    const totalPayout = asset1Realized + asset2Pnl;
    
    playerPayouts[playerId] = {
      asset1_realized: asset1Realized,
      asset2_pnl: asset2Pnl,
      total: totalPayout,
    };
  }
  
  // Clear Asset 1 holdings (they expire at end of round)
  for (const playerId of Object.keys(playerHoldings)) {
    const holdingsToRemove: string[] = [];
    for (const key of Object.keys(playerHoldings[playerId])) {
      if (key.endsWith('_1')) {
        holdingsToRemove.push(key);
      }
    }
    for (const key of holdingsToRemove) {
      delete playerHoldings[playerId][key];
    }
  }
  
  return {
    payouts: playerPayouts,
    holdings: playerHoldings,
  };
}

export function validateSpendingLimits(
  trades: Trade[],
  portfolio: Record<string, PortfolioState>
): void {
  const playerCosts: Record<string, number> = {};
  
  // Accumulate buy costs per player
  for (const trade of trades) {
    if (trade.action === 'buy') {
      const cost = trade.quantity * trade.price;
      playerCosts[trade.player_id] = (playerCosts[trade.player_id] || 0) + cost;
    }
  }
  
  // Check against liquid balance
  for (const [playerId, totalCost] of Object.entries(playerCosts)) {
    const playerPortfolio = portfolio[playerId] || {
      cumulative_pnl: 0,
      liquid_balance: 500,
      total_invested: 0,
    };
    
    if (totalCost > playerPortfolio.liquid_balance) {
      throw new Error('SPENDING_LIMIT_ERROR');
    }
  }
}

export function updatePortfolio(
  trades: Trade[],
  payouts: Record<string, PlayerPayout>,
  portfolio: Record<string, PortfolioState>,
  holdings: Record<string, Record<string, number>>
): Record<string, PortfolioState> {
  const playersInRound = new Set<string>();
  for (const trade of trades) {
    playersInRound.add(trade.player_id);
  }
  
  const updatedPortfolio = { ...portfolio };
  
  for (const playerId of playersInRound) {
    if (!updatedPortfolio[playerId]) {
        updatedPortfolio[playerId] = {
          cumulative_pnl: 0,
          liquid_balance: 500,
          total_invested: 0,
          positions: {} as Record<string, number>,
        };
    }
    
    const payoutData = payouts[playerId] || { asset1_realized: 0, asset2_pnl: 0, total: 0 };
    const roundTotal = payoutData.total;
    
    // Update cumulative P&L
    updatedPortfolio[playerId].cumulative_pnl += roundTotal;
    
    // Calculate total cost for this player's trades this round
    let totalCostThisRound = 0;
    for (const trade of trades) {
      if (trade.player_id === playerId) {
        const cost = trade.quantity * trade.price;
        if (trade.action === 'buy') {
          totalCostThisRound += cost;
          updatedPortfolio[playerId].total_invested += cost;
        } else {
          totalCostThisRound -= cost; // Selling reduces cost
          updatedPortfolio[playerId].total_invested -= cost;
        }
      }
    }
    
    // Update liquid balance:
    // 1. Subtract costs of trades (cash out when buying)
    // 2. Add payouts from settlements (cash in when positions settle)
    // Since roundTotal = payout - cost, we have: payout = roundTotal + cost
    // liquid_balance change = -cost + payout = -cost + (roundTotal + cost) = roundTotal
    // Wait, that's wrong. Let me think again:
    // 
    // roundTotal = payout - cost (this is P&L)
    // We want: liquid_balance -= cost (for buys), liquid_balance += payout (for settlements)
    // So: liquid_balance change = -cost + payout = -cost + (roundTotal + cost) = roundTotal
    // 
    // Actually that's correct! But only if the trades in THIS round are the ones settling.
    // The issue is: trades in round N don't settle until end of round N.
    // So we need to:
    // 1. Subtract cost for NEW trades
    // 2. Add payout for OLD trades that are settling
    //
    // But in our system, trades settle at the END of the same round they're made.
    // So: liquid_balance = starting - cost + payout = starting + (payout - cost) = starting + roundTotal
    // 
    // NO WAIT. Let me re-read the logic. In calculateRound, we process ALL trades for the round
    // and calculate their P&L. So roundTotal includes the P&L for trades made THIS round.
    //
    // So the correct flow is:
    // - Start with liquid_balance
    // - Subtract cost of trades: liquid_balance -= totalCostThisRound
    // - Add payout from settlements: liquid_balance += (roundTotal + totalCostThisRound)
    // - Net effect: liquid_balance += roundTotal
    //
    // But that means liquid_balance should ONLY change by roundTotal, which is what we had!
    // 
    // The issue is: when do trades settle? Same round or next round?
    // Looking at the code, trades settle SAME round (Asset 1 expires at end of round).
    // 
    // So for Round 1:
    // - Buy 1 at $56.29 → cost = $56.29
    // - Team wins → payout = $100
    // - P&L = $100 - $56.29 = $43.71
    // - liquid_balance = $500 - $56.29 + $100 = $543.71
    // - Which equals: $500 + $43.71 = $543.71 ✅
    //
    // So the formula liquid_balance += roundTotal is CORRECT!
    // 
    // But the user says it's going UP when it should go DOWN.
    // That means roundTotal is POSITIVE when it should be NEGATIVE.
    // Let me check if there's an issue in the P&L calculation...
    
    updatedPortfolio[playerId].liquid_balance += roundTotal;
    
    // Update positions with new holdings
    updatedPortfolio[playerId].positions = holdings[playerId] || {};
  }
  
  return updatedPortfolio;
}

export function savePlayerPayouts(
  payouts: Record<string, PlayerPayout>,
  outputFile: string
): void {
  const outputDir = path.dirname(outputFile);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const rows: string[][] = [['player_id', 'asset1_realized', 'asset2_pnl', 'total_payout']];
  
  for (const [playerId, payout] of Object.entries(payouts)) {
    rows.push([
      playerId,
      payout.asset1_realized.toFixed(2),
      payout.asset2_pnl.toFixed(2),
      payout.total.toFixed(2),
    ]);
  }
  
  const csvContent = rows.map((row) => row.join(',')).join('\n');
  fs.writeFileSync(outputFile, csvContent);
}

