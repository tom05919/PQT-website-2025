import { NextRequest } from 'next/server';
import path from 'node:path';
import fs from 'node:fs';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const projectRoot = process.cwd();
  const csvPath = path.join(projectRoot, 'src', 'app', 'api', 'challenge-csv', 'initial_state_visible.csv');

  try {
    // Read the pre-generated CSV file
    const csvText = await fs.promises.readFile(csvPath, 'utf-8');

    return new Response(csvText, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="challenge.csv"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: unknown) {
    const message = `Failed to load CSV: ${
      err instanceof Error ? err.message : String(err)
    }`;
    return new Response(message, { status: 500 });
  }
}


