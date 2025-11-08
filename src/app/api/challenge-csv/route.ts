import { NextRequest } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';

export const runtime = 'nodejs';

const execFileAsync = promisify(execFile);

export async function GET(_req: NextRequest) {
  // Expected script location (provided by user): src/app/api/challenge-csv/generate_initial_state.py
  const projectRoot = process.cwd();
  const scriptDir = path.join(projectRoot, 'src', 'app', 'api', 'challenge-csv');
  const scriptPath = path.join(scriptDir, 'generate_initial_state.py');
  const outputCsvPath = path.join(scriptDir, 'initial_state_visible.csv');

  // If the script doesn't exist yet, return a small sample CSV so the button still works
  if (!fs.existsSync(scriptPath)) {
    const sample = 'id,value\n1,42\n2,13\n';
    return new Response(sample, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="challenge.csv"',
        'Cache-Control': 'no-store',
      },
    });
  }

  try {
    // Run the python script; it writes initial_state_visible.csv in the same directory
    await execFileAsync('python3', [scriptPath], {
      cwd: scriptDir,
      env: process.env,
      timeout: 180_000,
      maxBuffer: 10 * 1024 * 1024,
    });

    // Read the generated CSV file
    const csvText = await fs.promises.readFile(outputCsvPath, 'utf-8');

    return new Response(csvText, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="challenge.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    const message = `CSV generation failed: ${err?.message || String(err)}`;
    return new Response(message, { status: 500 });
  }
}


