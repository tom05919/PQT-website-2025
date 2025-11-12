'use client';

import { useState, useRef } from 'react';

interface PayoutResult {
  player_id: string;
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

export default function ChallengeUpload() {
  const [round, setRound] = useState<string>('1');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<PayoutResult[] | null>(null);
  const [prices, setPrices] = useState<PriceResult[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!round) {
      setError('Please select a round');
      return;
    }

    setLoading(true);
    setError(null);
    setPayouts(null);
    setPrices(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('round', round);

      const response = await fetch('/api/challenge-calculate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to calculate payouts');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setPayouts(result.payouts || []);
      setPrices(result.prices || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPayouts = () => {
    if (!payouts) return;

    const headers = ['player_id', 'total_payout'];
    const rows = payouts.map((p) => [p.player_id, p.total_payout.toFixed(2)]);

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

  return (
    <div className="space-y-8">
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
            onChange={(e) => setRound(e.target.value)}
            className="w-full px-4 py-3 border border-[#c0ae9f] rounded-lg bg-white text-[#2e2b28] focus:outline-none focus:ring-2 focus:ring-[#d26b2c] focus:border-transparent"
          >
            <option value="">-- Select a Round --</option>
            <option value="1">Round 1</option>
            <option value="2">Round 2</option>
            <option value="3">Round 3</option>
            <option value="4">Round 4</option>
            <option value="5">Round 5</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#463f3a] mb-2">
            Upload Trade File (CSV)
          </label>
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
          disabled={loading || !file || !round}
          className="w-full px-6 py-3 bg-[#d26b2c] text-white rounded-lg font-medium hover:bg-[#bb5e27] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Calculate Payouts'}
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

          {/* Updated Prices Results */}
          <div className="bg-white rounded-2xl p-8 border border-[#c0ae9f]/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-semibold text-[#2e2b28]">
                Updated Team Prices - Round {round}
              </h3>
              <button
                onClick={downloadPrices}
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
                      Team
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      Old Price
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      New Price
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      Buys
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      Sells
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-[#463f3a]">
                      Slippage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-[#f5f1eb]' : 'bg-white'}
                    >
                      <td className="py-3 px-4 text-[#2e2b28] font-medium">{price.team_id}</td>
                      <td className="text-right py-3 px-4 text-[#2e2b28]">
                        {price.old_price.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 text-[#2e2b28] font-medium">
                        {price.new_price.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 text-[#2e2b28]">{price.buys}</td>
                      <td className="text-right py-3 px-4 text-[#2e2b28]">{price.sells}</td>
                      <td className="text-right py-3 px-4 text-[#2e2b28]">
                        <span
                          className={
                            price.slip >= 0 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {price.slip >= 0 ? '+' : ''}
                          {price.slip.toFixed(4)}
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

