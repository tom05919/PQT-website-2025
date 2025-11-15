import { NextRequest } from 'next/server';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {
  loadOutcomes,
  loadRoundPrices,
  loadTrades,
  loadPortfolioState,
  calculateRound,
  validateSpendingLimits,
  updatePortfolio,
  savePlayerPayouts,
  type PortfolioState,
} from './calculate';

export const runtime = 'nodejs';

interface PriceResult {
  team_id: string;
  old_price: number;
  new_price: number;
  buys: number;
  sells: number;
  slip: number;
}

// Save portfolio state
function savePortfolioState(state: Record<string, PortfolioState>, portfolioPath: string): void {
  try {
    // Ensure directory exists before writing
    const portfolioDir = path.dirname(portfolioPath);
    if (!fs.existsSync(portfolioDir)) {
      fs.mkdirSync(portfolioDir, { recursive: true });
    }
    console.log('SAVING PORTFOLIO to', portfolioPath);
    console.log('PORTFOLIO CONTENT:', JSON.stringify(state, null, 2));
    fs.writeFileSync(portfolioPath, JSON.stringify(state, null, 2));
    console.log('PORTFOLIO SAVED SUCCESSFULLY');
  } catch (error) {
    console.error('Error saving portfolio state:', error);
  }
}

export async function POST(req: NextRequest) {
  // API endpoint for calculating tournament round payouts and updating portfolio state.
  // Handles file uploads, portfolio state management, and performs calculations in TypeScript.
  const projectRoot = process.cwd();
  const scriptDir = path.join(projectRoot, 'src', 'app', 'api', 'challenge-csv');
  
  // Use /tmp for portfolio storage on Vercel (read-only filesystem except /tmp)
  // For local development, use data/portfolios
  const isVercel = process.env.VERCEL === '1';
  const portfolioDir = isVercel 
    ? path.join(os.tmpdir(), 'portfolios')
    : path.join(projectRoot, 'data', 'portfolios');
  const portfolioPath = path.join(portfolioDir, 'portfolio_state.json');

  try {
    // Parse form data from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const round = formData.get('round') as string;
    const portfolioJson = formData.get('portfolio') as string | null;

    // Validate required parameters
    if (!file || !round) {
      return new Response(
        JSON.stringify({ error: 'Missing file or round parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a temporary directory for processing
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'challenge-'));
    const uploadedFile = path.join(tmpDir, 'mock_trades.csv');

    // Save the uploaded trades file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(uploadedFile, Buffer.from(buffer));

    // Use portfolio from frontend (sessionStorage is source of truth)
    let portfolio: Record<string, PortfolioState> = {};
    
    if (portfolioJson) {
      try {
        portfolio = JSON.parse(portfolioJson) as Record<string, PortfolioState>;
        console.log('LOADING PORTFOLIO FROM FRONTEND:', JSON.stringify(portfolio, null, 2));
      } catch (e) {
        console.error('Failed to parse portfolio from frontend:', e);
        portfolio = {};
      }
    } else {
      console.log('NO PORTFOLIO PROVIDED FROM FRONTEND, starting fresh');
    }

    // Ensure portfolio directory exists before writing
    if (!fs.existsSync(portfolioDir)) {
      fs.mkdirSync(portfolioDir, { recursive: true });
    }

    // Load required CSV files
    const tournamentOutcomesPath = path.join(scriptDir, 'tournament_outcomes.csv');
    const roundPricesPath = path.join(scriptDir, `round_${round}_prices.csv`);

    if (!fs.existsSync(tournamentOutcomesPath)) {
      throw new Error(`Tournament outcomes file not found: ${tournamentOutcomesPath}`);
    }
    if (!fs.existsSync(roundPricesPath)) {
      throw new Error(`Round prices file not found: ${roundPricesPath}`);
    }

    // Password mapping (must match frontend)
    const roundPasswords: Record<string, string> = {
      '1': 'round1',
      '2': 'round2',
      '3': 'round3',
      '4': 'round4',
      '5': 'round5',
    };

    const password = roundPasswords[round];
    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Invalid round number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Load outcomes and round prices
    const outcomes = loadOutcomes(tournamentOutcomesPath, parseInt(round));
    console.log('LOADED OUTCOMES FOR ROUND', round, ':', JSON.stringify(outcomes, null, 2));
    const roundPrices = loadRoundPrices(roundPricesPath);
    console.log('LOADED ROUND PRICES:', JSON.stringify(roundPrices, null, 2));

    // Load trades
    const trades = loadTrades(uploadedFile, roundPrices);
    console.log('LOADED TRADES:', JSON.stringify(trades, null, 2));

    // Initialize players in portfolio if needed
    for (const trade of trades) {
      if (!portfolio[trade.player_id]) {
        portfolio[trade.player_id] = {
          cumulative_pnl: 0,
          liquid_balance: 500,
          total_invested: 0,
          positions: {},
        };
      }
    }

    // Validate spending limits
    try {
      validateSpendingLimits(trades, portfolio);
    } catch (error) {
      if (error instanceof Error && error.message === 'SPENDING_LIMIT_ERROR') {
        return new Response(
          JSON.stringify({ error: 'Insufficient funds. You cannot exceed $500 in spending unless you have made profits.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }

    // Calculate payouts
    let result;
    try {
      result = calculateRound(outcomes, trades, roundPrices, portfolio);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('POSITION_ERROR:')) {
        const errorMessage = error.message.replace('POSITION_ERROR:', '');
        return new Response(
          JSON.stringify({ error: `Position error: ${errorMessage}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }
    
    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Failed to calculate payouts due to position error' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const playerPayouts = result.payouts;
    const updatedHoldings = result.holdings;
    
    console.log('PLAYER PAYOUTS:', JSON.stringify(playerPayouts, null, 2));
    console.log('UPDATED HOLDINGS:', JSON.stringify(updatedHoldings, null, 2));

    // Update portfolio
    const updatedPortfolio = updatePortfolio(trades, playerPayouts, portfolio, updatedHoldings);
    console.log('UPDATED PORTFOLIO:', JSON.stringify(updatedPortfolio, null, 2));

    // Save payouts CSV
    const payoutsOutputPath = path.join(portfolioDir, `payouts_round${round}.csv`);
    savePlayerPayouts(playerPayouts, payoutsOutputPath);

    // Save updated portfolio state
    savePortfolioState(updatedPortfolio, portfolioPath);

    // Convert payouts to response format
    const payouts = Object.entries(playerPayouts).map(([playerId, payout]) => ({
      player_id: playerId,
      asset1_realized: payout.asset1_realized,
      asset2_pnl: payout.asset2_pnl,
      total_payout: payout.total,
    }));

    // Convert portfolio to response format
    const portfolioData: Record<string, PortfolioState> = {};
    for (const [playerId, state] of Object.entries(updatedPortfolio)) {
      portfolioData[playerId] = {
        cumulative_pnl: state.cumulative_pnl,
        liquid_balance: state.liquid_balance,
        total_invested: state.total_invested,
        positions: state.positions || {},
      };
    }

    // Prices are now static (from round_N_prices.csv), so just return empty array
    const prices: PriceResult[] = [];

    // Clean up temporary directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
    
    // Save the updated portfolio state
    if (portfolioData && Object.keys(portfolioData).length > 0) {
      savePortfolioState(portfolioData, portfolioPath);
    }

    return new Response(
      JSON.stringify({ payouts, prices, portfolio: portfolioData }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error in challenge-calculate:', message);
    return new Response(
      JSON.stringify({ error: `Calculation failed: ${message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
