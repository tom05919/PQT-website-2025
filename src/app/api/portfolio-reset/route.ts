import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

const projectRoot = process.cwd();
const portfolioDir = path.join(projectRoot, 'data', 'portfolios');
const portfolioPath = path.join(portfolioDir, 'portfolio_state.json');

/**
 * DELETE /api/portfolio-reset
 * Resets the portfolio state by deleting the portfolio_state.json file
 * This allows starting fresh for a new tournament
 */
export async function DELETE(req: NextRequest) {
  try {
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

