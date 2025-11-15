import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

export const runtime = 'nodejs';

const execFileAsync = promisify(execFile);

interface PortfolioState {
  cumulative_pnl: number;
  liquid_balance: number;
  total_invested: number;
  positions: Record<string, number>;
}

interface PriceResult {
  team_id: string;
  old_price: number;
  new_price: number;
  buys: number;
  sells: number;
  slip: number;
}

// Ensure portfolio directory exists
const projectRoot = process.cwd();
const portfolioDir = path.join(projectRoot, 'data', 'portfolios');
const portfolioPath = path.join(portfolioDir, 'portfolio_state.json');

// Create portfolio directory if it doesn't exist
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
}

// Load portfolio state
function loadPortfolioState(): Record<string, PortfolioState> {
  try {
    if (fs.existsSync(portfolioPath)) {
      const data = fs.readFileSync(portfolioPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading portfolio state:', error);
  }
  return {};
}

// Save portfolio state
function savePortfolioState(state: Record<string, PortfolioState>): void {
  try {
    fs.writeFileSync(portfolioPath, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Error saving portfolio state:', error);
  }
}

export async function POST(req: NextRequest) {
  // API endpoint for calculating tournament round payouts and updating portfolio state.
  // Handles file uploads, portfolio state management, and communicates with Python script.
  const scriptDir = path.join(projectRoot, 'src', 'app', 'api', 'challenge-csv');
  const scriptPath = path.join(scriptDir, 'calculate_payout_price.py');

  // Load current portfolio state
  const portfolioState = loadPortfolioState();

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

    // Create a persistent portfolio directory if it doesn't exist
    const portfolioDir = path.join(projectRoot, 'data', 'portfolios');
    if (!fs.existsSync(portfolioDir)) {
      fs.mkdirSync(portfolioDir, { recursive: true });
    }

    // Create a temporary directory for processing
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'challenge-'));
    const uploadedFile = path.join(tmpDir, 'mock_trades.csv');
    const portfolioPath = path.join(portfolioDir, 'portfolio_state.json');

    // Save the uploaded trades file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(uploadedFile, Buffer.from(buffer));

    // Load portfolio state from disk (from previous round) - JSON format
    let currentPortfolio: Record<string, PortfolioState> = {};
    if (fs.existsSync(portfolioPath)) {
      try {
        const diskData = fs.readFileSync(portfolioPath, 'utf-8');
        currentPortfolio = JSON.parse(diskData);
      } catch (e) {
        console.error('Failed to load portfolio from disk:', e);
      }
    }

    // If no portfolio on disk, use the one from frontend (first round scenario)
    if (Object.keys(currentPortfolio).length === 0 && portfolioJson) {
      try {
        currentPortfolio = JSON.parse(portfolioJson) as Record<string, PortfolioState>;
      } catch (e) {
        console.error('Failed to parse portfolio from frontend:', e);
      }
    }

    // Save portfolio state to JSON file for Python script
    fs.writeFileSync(portfolioPath, JSON.stringify(currentPortfolio, null, 2));

    // Ensure required CSV files exist (generate if missing)
    const initialPricesPath = path.join(scriptDir, 'initial_prices.csv');
    const tournamentOutcomesPath = path.join(scriptDir, 'tournament_outcomes.csv');

    if (!fs.existsSync(initialPricesPath) || !fs.existsSync(tournamentOutcomesPath)) {
      // Generate missing CSV files
      await execFileAsync('python3', [
        path.join(scriptDir, 'generate_initial_state.py')
      ], {
        cwd: scriptDir,
        env: process.env,
        timeout: 10_000,
        maxBuffer: 5 * 1024 * 1024,
      }).catch(() => {
        // If script doesn't exist, continue anyway
      });
    }

    // Password mapping (must match frontend and Python script)
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

    // Run the Python script with password
    let pythonOutput = '';
    const roundPricesPath = path.join(scriptDir, `round_${round}_prices.csv`);
    try {
      const result = await execFileAsync('python3', [
        scriptPath,
        '--round', round,
        '--trades', uploadedFile,
        '--password', password,
        '--round-prices', roundPricesPath,
        '--portfolio', portfolioPath
      ], {
        cwd: scriptDir,
        env: process.env,
        timeout: 30_000,
        maxBuffer: 10 * 1024 * 1024,
      });
      pythonOutput = result.stdout || '';
    } catch (execErr: unknown) {
      // Check if it's a password error or spending limit error
      if (execErr instanceof Error) {
        const errorMessage = execErr.message || '';
        console.error('Python script execution error:', errorMessage);
        if (errorMessage.includes('PASSWORD_ERROR')) {
          return new Response(
            JSON.stringify({ error: 'Incorrect password for this round' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
        if (errorMessage.includes('SPENDING_LIMIT_ERROR')) {
          return new Response(
            JSON.stringify({ error: 'Insufficient funds. You cannot exceed $500 in spending unless you have made profits.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      console.error('Python script error:', execErr);
    }

    // Read output files
    const payoutsPath = path.join(scriptDir, `payouts_round${round}.csv`);

    if (!fs.existsSync(payoutsPath)) {
      throw new Error(`Output file not generated: ${payoutsPath}`);
    }

    const payoutsCsv = fs.readFileSync(payoutsPath, 'utf-8');

    // Parse payouts CSV - new format: player_id, asset1_realized, asset2_pnl, total_payout
    const payoutLines = payoutsCsv.trim().split('\n');
    const payouts = payoutLines.slice(1).map((line) => {
      const parts = line.split(',');
      return {
        player_id: parts[0],
        asset1_realized: parseFloat(parts[1]) || 0, // asset1_realized is 2nd column
        asset2_pnl: parseFloat(parts[2]) || 0, // asset2_pnl is 3rd column
        total_payout: parseFloat(parts[3]) || 0, // total_payout is 4th column
      };
    });

    // Extract portfolio state from Python output
    let portfolioData: Record<string, PortfolioState> = {};
    const portfolioStart = pythonOutput.indexOf('PORTFOLIO_JSON:{');
    if (portfolioStart !== -1) {
      try {
        // Find the JSON object end
        let braceCount = 0;
        let jsonEnd = portfolioStart + 'PORTFOLIO_JSON:'.length;
        for (let i = jsonEnd; i < pythonOutput.length; i++) {
          if (pythonOutput[i] === '{') braceCount++;
          else if (pythonOutput[i] === '}') braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
        
        const jsonStr = pythonOutput.substring(portfolioStart + 'PORTFOLIO_JSON:'.length, jsonEnd);
        const rawData = JSON.parse(jsonStr);
        
        // Transform the data to ensure it matches the PortfolioState interface
        portfolioData = Object.fromEntries(
          Object.entries(rawData).map(([playerId, data]: [string, any]) => [
            playerId,
            {
              cumulative_pnl: data.cumulative_pnl || 0,
              liquid_balance: data.liquid_balance || 0,
              total_invested: data.total_invested || 0,
              positions: data.positions || {}
            }
          ])
        );
      } catch (e) {
        console.error('Failed to parse portfolio JSON:', e);
      }
    }

    // Prices are now static (from round_N_prices.csv), so just return empty array
    // The frontend will still display the structure
    const prices: PriceResult[] = [];

    // Clean up temporary directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
    
    // Save the updated portfolio state
    if (portfolioData) {
      savePortfolioState(portfolioData);
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
