import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const runtime = 'nodejs';

// Use /tmp for portfolio storage on Vercel (read-only filesystem except /tmp)
// For local development, use data/portfolios
function getPortfolioPath(): string {
  const projectRoot = process.cwd();
  const isVercel = process.env.VERCEL === '1';
  const portfolioDir = isVercel 
    ? path.join(os.tmpdir(), 'portfolios')
    : path.join(projectRoot, 'data', 'portfolios');
  return path.join(portfolioDir, 'portfolio_state.json');
}

/**
 * DELETE /api/portfolio-reset
 * Resets the portfolio state by deleting the portfolio_state.json file
 * This allows starting fresh for a new tournament
 */
export async function DELETE(_req: NextRequest) {
  try {
    const portfolioPath = getPortfolioPath();
    // Check if portfolio file exists
    if (fs.existsSync(portfolioPath)) {
      fs.unlinkSync(portfolioPath);
      return new Response(
        JSON.stringify({ message: 'Portfolio state reset successfully' }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'No portfolio state to reset' }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error resetting portfolio state:', message);
    return new Response(
      JSON.stringify({ error: `Failed to reset portfolio: ${message}` }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

