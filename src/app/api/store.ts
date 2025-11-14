/**
 * Shared in-memory store for portfolio data
 * Works in both development and production (serverless safe)
 */

interface PlayerPortfolio {
  cumulative_pnl: number;
  liquid_balance: number;
  total_invested: number;
}

// In-memory portfolio storage
export const portfolioStore: Record<string, PlayerPortfolio> = {};

export function getPortfolio(): Record<string, PlayerPortfolio> {
  return { ...portfolioStore };
}

export function updatePortfolio(playerId: string, state: PlayerPortfolio): void {
  portfolioStore[playerId] = state;
}

export function updateAllPortfolios(portfolios: Record<string, PlayerPortfolio>): void {
  for (const [playerId, state] of Object.entries(portfolios)) {
    portfolioStore[playerId] = state;
  }
}

export function clearPortfolios(): void {
  for (const key in portfolioStore) {
    delete portfolioStore[key];
  }
}

