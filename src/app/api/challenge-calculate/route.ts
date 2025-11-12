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

    // Run the Python script
    try {
      await execFileAsync('python3', [scriptPath, '--round', round, '--trades', uploadedFile], {
        cwd: scriptDir,
        env: process.env,
        timeout: 30_000,
        maxBuffer: 10 * 1024 * 1024,
      });
    } catch (execErr: unknown) {
      // Log error but continue - files might still be generated
      console.error('Python script error:', execErr);
    }

    // Read output files
    const payoutsPath = path.join(scriptDir, `payouts_round${round}.csv`);
    const pricesPath = path.join(scriptDir, `updated_prices_round${round}.csv`);

    if (!fs.existsSync(payoutsPath) || !fs.existsSync(pricesPath)) {
      throw new Error('Output files were not generated');
    }

    const payoutsCsv = fs.readFileSync(payoutsPath, 'utf-8');
    const pricesCsv = fs.readFileSync(pricesPath, 'utf-8');

    // Parse payouts CSV
    const payoutLines = payoutsCsv.trim().split('\n');
    const payoutsHeader = payoutLines[0].split(',');
    const payouts = payoutLines.slice(1).map((line) => {
      const [playerId, payout] = line.split(',');
      return {
        player_id: playerId,
        total_payout: parseFloat(payout),
      };
    });

    // Parse prices CSV
    const pricesLines = pricesCsv.trim().split('\n');
    const pricesHeader = pricesLines[0].split(',');
    const prices = pricesLines.slice(1).map((line) => {
      const parts = line.split(',');
      return {
        team_id: parts[0],
        old_price: parseFloat(parts[1]),
        new_price: parseFloat(parts[2]),
        buys: parseInt(parts[3], 10),
        sells: parseInt(parts[4], 10),
        slip: parseFloat(parts[5]),
      };
    });

    // Clean up temporary directory
    fs.rmSync(tmpDir, { recursive: true, force: true });

    return new Response(
      JSON.stringify({ payouts, prices }),
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

