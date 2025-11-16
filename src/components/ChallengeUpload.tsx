'use client';

import { useState, useRef, useEffect } from 'react';

interface PayoutResult {
  player_id: string;
  asset1_realized: number;
  asset2_pnl: number;
  total_payout: number;
}

interface PriceResult {
  team_id: string;
  old_price: number;
  new_price: number;
  buys: number;
  sells: number;
  slip: number;
}

// Password mapping for each round
const ROUND_PASSWORDS: Record<number, string> = {
  1: 'round1',
  2: 'round2',
  3: 'round3',
  4: 'round4',
  5: 'round5',
};

interface PortfolioState {
  [playerId: string]: {
    cumulative_pnl: number;
    liquid_balance: number;
    total_invested: number;
    positions: Record<string, number>;
    cost_basis?: Record<string, number>;
    unrealized_pnl?: number; // Track current unrealized P&L to avoid double-counting
  };
}

// Session storage helpers
const PORTFOLIO_STORAGE_KEY = 'challenge_portfolio_state';

function loadPortfolioFromSession(): PortfolioState {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(PORTFOLIO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (err) {
    console.error('Failed to load portfolio from session:', err);
    return {};
  }
}

function savePortfolioToSession(portfolio: PortfolioState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
  } catch (err) {
    console.error('Failed to save portfolio to session:', err);
  }
}

export default function ChallengeUpload() {
  const [round, setRound] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<PayoutResult[] | null>(null);
  const [prices, setPrices] = useState<PriceResult[] | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
  const [unlockedRounds, setUnlockedRounds] = useState<Set<number>>(new Set([1]));
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [selectedRoundForPassword, setSelectedRoundForPassword] = useState<number | null>(null);
  const [completedRounds, setCompletedRounds] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load portfolio from session on mount
  useEffect(() => {
    const portfolioData = loadPortfolioFromSession();
    if (Object.keys(portfolioData).length > 0) {
      setPortfolio(portfolioData);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setPayouts(null); // Clear previous results when new file selected
      setPrices(null);
    }
  };

  const handleRoundChange = (newRound: number) => {
    if (!unlockedRounds.has(newRound)) {
      setSelectedRoundForPassword(newRound);
      setPasswordInput('');
      return;
    }
    setRound(newRound);
  };

  const handlePasswordSubmit = () => {
    if (!selectedRoundForPassword) return;
    
    if (passwordInput === ROUND_PASSWORDS[selectedRoundForPassword]) {
      const newUnlocked = new Set(unlockedRounds);
      newUnlocked.add(selectedRoundForPassword);
      setUnlockedRounds(newUnlocked);
      setRound(selectedRoundForPassword);
      setSelectedRoundForPassword(null);
      setPasswordInput('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleUpload = async () => {
    if (!round) {
      setError('Please select a round');
      return;
    }

    // Check if this round has already been calculated
    if (completedRounds.has(round)) {
      setError(`Round ${round} has already been calculated. You can only calculate each round once.`);
      return;
    }

    setLoading(true);
    setError(null);
    setPayouts(null);
    setPrices(null);

    try {
      const formData = new FormData();
      
      // If no file is selected, create an empty CSV (no trades)
      if (file) {
        formData.append('file', file);
      } else {
        // Create empty CSV with just headers
        const emptyCSV = 'player_id,team_id,action,quantity,asset\n';
        const blob = new Blob([emptyCSV], { type: 'text/csv' });
        formData.append('file', blob, 'empty_trades.csv');
      }
      
      formData.append('round', round.toString());
      // Pass current portfolio from session storage
      if (portfolio) {
        console.log('SENDING PORTFOLIO TO API:', JSON.stringify(portfolio, null, 2));
        formData.append('portfolio', JSON.stringify(portfolio));
      } else {
        console.log('NO PORTFOLIO TO SEND (starting fresh)');
      }

      const response = await fetch('/api/challenge-calculate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to calculate payouts');
      }

      setPayouts(result.payouts || []);
      setPrices(result.prices || []);

      // Save portfolio state to session storage
      if (result.portfolio) {
        // Merge with existing portfolio, ensuring result.portfolio takes precedence
        const updatedPortfolio = { ...(portfolio || {}), ...result.portfolio };
        console.log('RECEIVED PORTFOLIO FROM API:', JSON.stringify(result.portfolio, null, 2));
        console.log('SAVING UPDATED PORTFOLIO:', JSON.stringify(updatedPortfolio, null, 2));
        setPortfolio(updatedPortfolio);
        savePortfolioToSession(updatedPortfolio);
      } else if (portfolio) {
        // Keep existing portfolio if no new one returned
        console.log('NO PORTFOLIO RETURNED, keeping existing');
        setPortfolio(portfolio);
        savePortfolioToSession(portfolio);
      }

      // Mark this round as completed
      const newCompletedRounds = new Set(completedRounds);
      newCompletedRounds.add(round);
      setCompletedRounds(newCompletedRounds);
      
      // Clear the file input after successful calculation
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPayouts = () => {
    if (!payouts) return;

    const headers = ['player_id', 'asset1_realized', 'asset2_pnl', 'total_payout'];
    const rows = payouts.map((p) => [
      p.player_id,
      p.asset1_realized.toFixed(2),
      p.asset2_pnl.toFixed(2),
      p.total_payout.toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payouts_round_${round}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPrices = () => {
    if (!prices) return;

    const headers = ['team_id', 'old_price', 'new_price', 'buys', 'sells', 'slip'];
    const rows = prices.map((p) => [
      p.team_id,
      p.old_price.toFixed(2),
      p.new_price.toFixed(2),
      p.buys,
      p.sells,
      p.slip.toFixed(4),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `updated_prices_round_${round}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Password modal
  if (selectedRoundForPassword !== null) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 border border-[#c0ae9f]">
          <h2 className="text-2xl font-serif font-semibold text-[#463f3a] mb-4">
            Enter Password
          </h2>
          <p className="text-[#5b514c] mb-4">This round is password protected.</p>
          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            className="w-full px-4 py-2 border border-[#c0ae9f] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#d26b2c]"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedRoundForPassword(null);
                setPasswordInput('');
              }}
              className="flex-1 px-4 py-2 border border-[#c0ae9f] rounded-lg text-[#463f3a] hover:bg-[#f5f1eb] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSubmit}
              className="flex-1 px-4 py-2 bg-[#d26b2c] text-white rounded-lg hover:bg-[#bb5e27] transition-colors"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Status */}
      {portfolio && Object.keys(portfolio).length > 0 && (
        <div className="bg-gradient-to-r from-[#d26b2c] to-[#bb5e27] rounded-2xl p-8 shadow-sm text-white">
          <h2 className="text-2xl font-serif font-semibold mb-4">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(portfolio).map(([playerId, state]) => (
              <div key={playerId} className="bg-white/20 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Player: {playerId}</div>
                <div className="mb-2">
                  <div className="text-xs opacity-75">Cumulative P&L</div>
                  <div className="text-xl font-bold">{state.cumulative_pnl.toFixed(2)}</div>
                </div>
                <div className="mb-2">
                  <div className="text-xs opacity-75">Total Balance</div>
                  <div className="text-xl font-bold">${state.liquid_balance.toFixed(2)}</div>
                </div>
                <div className="mb-2">
                  <div className="text-xs opacity-75">Total Invested</div>
                  <div className="text-xl font-bold">${state.total_invested.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-[#e9e1d9] rounded-2xl p-8 shadow-sm">
        <h2 className="text-3xl font-serif font-semibold mb-6">Calculate Your Payouts</h2>

        {/* Round Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#463f3a] mb-2">
            Select Round
          </label>
          <select
            value={round}
            onChange={(e) => handleRoundChange(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-[#c0ae9f] rounded-lg bg-white text-[#2e2b28] focus:outline-none focus:ring-2 focus:ring-[#d26b2c] focus:border-transparent"
          >
            <option value="">-- Select a Round --</option>
            <option value={1}>Round of 16 {unlockedRounds.has(1) ? '🔓' : '🔒'} {completedRounds.has(1) ? '✓' : ''}</option>
            <option value={2}>Round of 8 {unlockedRounds.has(2) ? '🔓' : '🔒'} {completedRounds.has(2) ? '✓' : ''}</option>
            <option value={3}>Quarterfinals {unlockedRounds.has(3) ? '🔓' : '🔒'} {completedRounds.has(3) ? '✓' : ''}</option>
            <option value={4}>Semifinals {unlockedRounds.has(4) ? '🔓' : '🔒'} {completedRounds.has(4) ? '✓' : ''}</option>
            <option value={5}>Finals {unlockedRounds.has(5) ? '🔓' : '🔒'} {completedRounds.has(5) ? '✓' : ''}</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#463f3a] mb-2">
            Upload Trade File (CSV) - Optional
          </label>
          <p className="text-xs text-[#5b514c] mb-2">
            Leave empty if you don&apos;t want to make any trades this round
          </p>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1 px-4 py-3 border border-[#c0ae9f] rounded-lg bg-white text-[#2e2b28] focus:outline-none focus:ring-2 focus:ring-[#d26b2c] focus:border-transparent"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-[#d26b2c] text-white rounded-lg font-medium hover:bg-[#bb5e27] transition-colors"
            >
              Browse
            </button>
          </div>
          {file && (
            <p className="mt-2 text-sm text-[#5b514c]">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={handleUpload}
          disabled={loading || !file || !round || completedRounds.has(round)}
          className="w-full px-6 py-3 bg-[#d26b2c] text-white rounded-lg font-medium hover:bg-[#bb5e27] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : completedRounds.has(round) ? `Round ${round} Already Calculated ✓` : 'Calculate Payouts'}
        </button>
      </div>

      {/* Results Section */}
      {payouts && prices && (
        <div className="space-y-6">
          {/* Payouts Results */}
          <div className="bg-white rounded-2xl p-8 border border-[#c0ae9f]/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-semibold text-[#2e2b28]">
                Player Payouts - Round {round}
              </h3>
              <button
                onClick={downloadPayouts}
                className="px-4 py-2 bg-[#d26b2c] text-white rounded-lg text-sm font-medium hover:bg-[#bb5e27] transition-colors"
              >
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c0ae9f]">
                    <th className="text-left py-3 px-4 font-semibold text-[#463f3a]">
                      Player ID
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      Asset 1 (Realized)
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      Asset 2 P&L
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      Total Payout
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-[#f5f1eb]' : 'bg-white'}
                    >
                      <td className="py-3 px-4 text-[#2e2b28]">{payout.player_id}</td>
                      <td className="text-right py-3 px-4 text-[#2e2b28] font-medium">
                        <span
                          className={
                            payout.asset1_realized >= 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {payout.asset1_realized >= 0 ? '+' : ''}
                          {payout.asset1_realized.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 text-[#2e2b28] font-medium">
                        <span
                          className={
                            payout.asset2_pnl >= 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {payout.asset2_pnl >= 0 ? '+' : ''}
                          {payout.asset2_pnl.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 text-[#2e2b28] font-bold">
                        <span
                          className={
                            payout.total_payout >= 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {payout.total_payout >= 0 ? '+' : ''}
                          {payout.total_payout.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
