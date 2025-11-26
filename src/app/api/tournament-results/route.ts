import { NextRequest } from 'next/server';
import path from 'node:path';
import fs from 'node:fs';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const projectRoot = process.cwd();
  const csvPath = path.join(
    projectRoot,
    'src',
    'app',
    'api',
    'challenge-csv',
    'tournament_results.csv'
  );

  try {
    if (!fs.existsSync(csvPath)) {
      return new Response('Tournament results file not found', { status: 404 });
    }

    const csvText = await fs.promises.readFile(csvPath, 'utf-8');

    return new Response(csvText, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(`Error loading tournament results: ${message}`, {
      status: 500,
    });
  }
}

