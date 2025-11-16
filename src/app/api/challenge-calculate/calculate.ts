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
  costBasis: Record<string, Record<string, number>>;
}

export interface PortfolioState {
  cumulative_pnl: number;
  liquid_balance: number;
  total_invested: number;
  positions: Record<string, number>; // team_asset -> quantity
  cost_basis?: Record<string, number>; // team_asset -> average entry price
  unrealized_pnl?: number; // Current unrealized P&L from Asset 2 mark-to-market
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
  portfolio?: Record<string, PortfolioState>,
  roundNum?: number
): CalculateRoundResult | null {
  const playerPositions: Record<string, { asset1: Position[]; asset2: Position[] }> = {};
  const playerUnrealizedPnl: Record<string, number> = {};
  const playerAsset1Pnl: Record<string, number> = {};
  const playerHoldings: Record<string, Record<string, number>> = {}; // player_id -> {team_asset: quantity}
  const playerCostBasis: Record<string, Record<string, number>> = {}; // player_id -> {team_asset: avg_price}
  
  // Check if this is the Finals round
  const isFinals = roundNum === 5;
  
  // Initialize player records and load existing holdings from portfolio
  for (const trade of trades) {
    if (!playerPositions[trade.player_id]) {
      playerPositions[trade.player_id] = { asset1: [], asset2: [] };
      playerUnrealizedPnl[trade.player_id] = 0;
      playerAsset1Pnl[trade.player_id] = 0;
      
      // Load existing holdings and cost basis from portfolio
      if (portfolio && portfolio[trade.player_id]) {
        if (portfolio[trade.player_id].positions) {
          playerHoldings[trade.player_id] = { ...portfolio[trade.player_id].positions };
        } else {
          playerHoldings[trade.player_id] = {};
        }
        if (portfolio[trade.player_id].cost_basis) {
          playerCostBasis[trade.player_id] = { ...portfolio[trade.player_id].cost_basis };
        } else {
          playerCostBasis[trade.player_id] = {};
        }
      } else {
        playerHoldings[trade.player_id] = {};
        playerCostBasis[trade.player_id] = {};
      }
    }
  }
  
  // In Finals, also initialize players who have existing Asset 2 holdings but no new trades
  if (isFinals && portfolio) {
    for (const [playerId, playerState] of Object.entries(portfolio)) {
      if (!playerPositions[playerId]) {
        playerPositions[playerId] = { asset1: [], asset2: [] };
        playerUnrealizedPnl[playerId] = 0;
        playerAsset1Pnl[playerId] = 0;
        playerHoldings[playerId] = { ...playerState.positions };
        playerCostBasis[playerId] = { ...(playerState.cost_basis || {}) };
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
    
    // Update holdings and cost basis
    if (trade.action === 'buy') {
      const oldQty = playerHoldings[trade.player_id][holdingKey] || 0;
      const oldCost = playerCostBasis[trade.player_id][holdingKey] || 0;
      const newQty = oldQty + trade.quantity;
      
      // Calculate weighted average cost basis
      if (newQty > 0) {
        const totalCost = (oldQty * oldCost) + (trade.quantity * trade.price);
        playerCostBasis[trade.player_id][holdingKey] = totalCost / newQty;
      }
      
      playerHoldings[trade.player_id][holdingKey] = newQty;
    } else if (trade.action === 'sell') {
      playerHoldings[trade.player_id][holdingKey] -= trade.quantity;
      // Cost basis stays the same when selling (FIFO/average cost)
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
  
  // Calculate Asset 2 P&L
  if (isFinals) {
    // In Finals: Use cost basis method to settle ALL Asset 2 holdings
    // This avoids double-counting and uses the original purchase price
    for (const [playerId, holdings] of Object.entries(playerHoldings)) {
      const costBasis = playerCostBasis[playerId] || {};
      
      for (const [key, quantity] of Object.entries(holdings)) {
        // Only process Asset 2 holdings
        if (!key.endsWith('_2') || quantity === 0) continue;
        
        const teamId = key.replace('_2', '');
        const teamWon = outcomes[teamId];
        const settlementPrice = teamWon ? 100.0 : 0.0;
        const entryPrice = costBasis[key] || 0;
        
        // Calculate P&L using cost basis (original purchase price)
        const pnl = quantity * (settlementPrice - entryPrice);
        
        // Add to realized P&L
        if (!playerAsset1Pnl[playerId]) {
          playerAsset1Pnl[playerId] = 0;
        }
        playerAsset1Pnl[playerId] += pnl;
      }
    }
  } else {
    // Regular rounds: Calculate Asset 2 P&L based on ALL holdings (not just current trades)
    // Use cost basis to mark-to-market
    for (const [playerId, holdings] of Object.entries(playerHoldings)) {
      const costBasis = playerCostBasis[playerId] || {};
      
      for (const [key, quantity] of Object.entries(holdings)) {
        // Only process Asset 2 holdings
        if (!key.endsWith('_2') || quantity === 0) continue;
        
        const teamId = key.replace('_2', '');
        const teamLost = !outcomes[teamId];
        const entryPrice = costBasis[key] || 0;
        
        let currentPrice: number;
        let isRealized: boolean;
        
        if (teamLost) {
          // Team lost - realize at $0
          currentPrice = 0.0;
          isRealized = true;
          console.log(`Current price: $${currentPrice} (team lost, realized at $0)`);
        } else {
          // Team still alive - mark to market at current round price
          currentPrice = roundPrices[teamId]?.asset2 || 0;
          isRealized = false;
          console.log(`Current price from roundPrices[${teamId}].asset2: $${currentPrice}`);
        }
        
        // Calculate P&L using cost basis
        const pnl = quantity * (currentPrice - entryPrice);
        console.log(`P&L = ${quantity} × ($${currentPrice} - $${entryPrice}) = $${pnl}`);
        
        if (isRealized) {
          // Realized P&L (team lost)
          playerAsset1Pnl[playerId] = (playerAsset1Pnl[playerId] || 0) + pnl;
          console.log(`Added to REALIZED P&L`);
        } else {
          // Unrealized P&L (mark-to-market)
          playerUnrealizedPnl[playerId] = (playerUnrealizedPnl[playerId] || 0) + pnl;
          console.log(`Added to UNREALIZED P&L`);
        }
      }
    }
  }
  
  // Combine payouts
  const playerPayouts: Record<string, PlayerPayout> = {};
  
  // Get all players (from trades or from holdings in Finals)
  const allPlayers = new Set<string>();
  for (const playerId of Object.keys(playerPositions)) {
    allPlayers.add(playerId);
  }
  if (isFinals) {
    for (const playerId of Object.keys(playerHoldings)) {
      allPlayers.add(playerId);
    }
  }
  
  for (const playerId of allPlayers) {
    let asset1Realized = playerAsset1Pnl[playerId] || 0;
    let asset2Pnl = playerUnrealizedPnl[playerId] || 0;
    
    // In Finals, all Asset 2 P&L is already realized (handled above)
    // No need to convert here
    
    const totalPayout = asset1Realized + asset2Pnl;
    
    playerPayouts[playerId] = {
      asset1_realized: asset1Realized,
      asset2_pnl: asset2Pnl,
      total: totalPayout,
    };
  }
  
  // Clear Asset 1 holdings (they expire at end of round)
  // Also clear Asset 2 holdings if it's Finals (all positions settled)
  for (const playerId of Object.keys(playerHoldings)) {
    const holdingsToRemove: string[] = [];
    for (const key of Object.keys(playerHoldings[playerId])) {
      if (key.endsWith('_1')) {
        holdingsToRemove.push(key);
      }
      // Clear Asset 2 holdings in Finals
      if (isFinals && key.endsWith('_2')) {
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
    costBasis: playerCostBasis,
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
  holdings: Record<string, Record<string, number>>,
  costBasis: Record<string, Record<string, number>>
): Record<string, PortfolioState> {
  // Include all players who either have trades OR have payouts (from existing positions)
  const playersInRound = new Set<string>();
  for (const trade of trades) {
    playersInRound.add(trade.player_id);
  }
  for (const playerId of Object.keys(payouts)) {
    playersInRound.add(playerId);
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
    const realizedThisRound = payoutData.asset1_realized; // Realized P&L this round
    const unrealizedThisRound = payoutData.asset2_pnl; // Current unrealized P&L (mark-to-market)
    const previousUnrealized = updatedPortfolio[playerId].unrealized_pnl || 0; // Previous round's unrealized
    
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
    
    // Update liquid balance with total P&L (includes unrealized gains)
    updatedPortfolio[playerId].liquid_balance += roundTotal;
    
    // Update positions and cost basis with new holdings
    updatedPortfolio[playerId].positions = holdings[playerId] || {};
    updatedPortfolio[playerId].cost_basis = costBasis[playerId] || {};
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

