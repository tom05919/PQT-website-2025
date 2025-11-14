import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

export const runtime = 'nodejs';

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  const projectRoot = process.cwd();
  const scriptDir = path.join(projectRoot, 'src', 'app', 'api', 'challenge-csv');
  const scriptPath = path.join(scriptDir, 'calculate_payout_price.py');

  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const round = formData.get('round') as string;
    const portfolioJson = formData.get('portfolio') as string | null;

    if (!file || !round) {
      return new Response(
        JSON.stringify({ error: 'Missing file or round parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create temporary directory
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'challenge-'));
    const uploadedFile = path.join(tmpDir, 'mock_trades.csv');

    // Save uploaded file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(uploadedFile, Buffer.from(buffer));

    // Write portfolio state to temporary CSV file
    const portfolioPath = path.join(tmpDir, 'portfolio_state.csv');
    if (portfolioJson) {
      try {
        const portfolioData = JSON.parse(portfolioJson);
        const csv = ['player_id,cumulative_pnl,liquid_balance,total_invested'];
        for (const [playerId, state] of Object.entries(portfolioData)) {
          csv.push(
            `${playerId},${(state as any).cumulative_pnl},${(state as any).liquid_balance},${(state as any).total_invested}`
          );
        }
        fs.writeFileSync(portfolioPath, csv.join('\n'));
      } catch (e) {
        console.error('Failed to write portfolio CSV:', e);
        fs.writeFileSync(portfolioPath, 'player_id,cumulative_pnl,liquid_balance,total_invested\n');
      }
    } else {
      // Create empty portfolio file if none provided
      fs.writeFileSync(portfolioPath, 'player_id,cumulative_pnl,liquid_balance,total_invested\n');
    }

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
    let portfolioData: Record<string, { cumulative_pnl: number; liquid_balance: number; total_invested: number }> = {};
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
        portfolioData = JSON.parse(jsonStr) as Record<string, { cumulative_pnl: number; liquid_balance: number; total_invested: number }>;
      } catch (e) {
        console.error('Failed to parse portfolio JSON:', e);
      }
    }

    // Prices are now static (from round_N_prices.csv), so just return empty array
    // The frontend will still display the structure
    const prices: any[] = [];

    // Clean up temporary directory
    fs.rmSync(tmpDir, { recursive: true, force: true });

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

