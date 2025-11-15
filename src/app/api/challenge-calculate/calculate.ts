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
  roundPrices: RoundPrices
): Record<string, PlayerPayout> {
  const playerPositions: Record<string, { asset1: Position[]; asset2: Position[] }> = {};
  const playerUnrealizedPnl: Record<string, number> = {};
  const playerAsset1Pnl: Record<string, number> = {};
  
  // Initialize player records
  for (const trade of trades) {
    if (!playerPositions[trade.player_id]) {
      playerPositions[trade.player_id] = { asset1: [], asset2: [] };
      playerUnrealizedPnl[trade.player_id] = 0;
      playerAsset1Pnl[trade.player_id] = 0;
    }
  }
  
  // Process trades
  for (const trade of trades) {
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
  
  return playerPayouts;
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
  portfolio: Record<string, PortfolioState>
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
    
    // Update liquid balance and total invested based on trades
    for (const trade of trades) {
      if (trade.player_id === playerId) {
        const cost = trade.quantity * trade.price;
        if (trade.action === 'buy') {
          updatedPortfolio[playerId].liquid_balance -= cost;
          updatedPortfolio[playerId].total_invested += cost;
        } else {
          updatedPortfolio[playerId].liquid_balance += cost;
          updatedPortfolio[playerId].total_invested -= cost;
        }
      }
    }
    
    // Add round P&L to liquid balance
    updatedPortfolio[playerId].liquid_balance += roundTotal;
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

