import { NextRequest } from 'next/server';
import { getPortfolio } from '@/app/api/store';

export async function GET(_req: NextRequest) {
  try {
    const portfolio = getPortfolio();
    return new Response(JSON.stringify({ portfolio }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error reading portfolio state:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to read portfolio state' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

