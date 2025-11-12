'use client';

import { useState } from 'react';
import ChallengeUpload from '@/components/ChallengeUpload';
import TournamentBracket from '@/components/TournamentBracket';

export default function ChallengePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'calculate' | 'bracket'>('overview');

  return (
    <main className="min-h-screen bg-[#d2c3b3] text-[#2e2b28] font-sans antialiased">
      {/* Hero */}
      <section className="py-28 px-6 sm:px-10 lg:px-16 border-b border-[#c0ae9f]/50">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            Challenge
          </h1>
          <p className="text-lg md:text-xl text-[#463f3a] max-w-3xl mx-auto leading-relaxed">
            Download the latest dataset as a CSV, trade stocks, and calculate your payouts.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a
              href="/api/challenge-csv"
              className="inline-block bg-[#d26b2c] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#bb5e27] transition-colors"
            >
              Download Latest Dataset (CSV)
            </a>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-[#e9e1d9] border-b border-[#c0ae9f]/50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#d26b2c] text-[#d26b2c]'
                  : 'border-transparent text-[#463f3a] hover:text-[#d26b2c]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bracket')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'bracket'
                  ? 'border-[#d26b2c] text-[#d26b2c]'
                  : 'border-transparent text-[#463f3a] hover:text-[#d26b2c]'
              }`}
            >
              Tournament Bracket
            </button>
            <button
              onClick={() => setActiveTab('calculate')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'calculate'
                  ? 'border-[#d26b2c] text-[#d26b2c]'
                  : 'border-transparent text-[#463f3a] hover:text-[#d26b2c]'
              }`}
            >
              Calculate Payouts
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="bg-[#e9e1d9] rounded-2xl p-8 shadow-sm">
                <h2 className="text-3xl font-serif font-semibold mb-3">How It Works</h2>
                <ul className="space-y-3 text-[#463f3a]">
                  <li className="flex items-start">
                    <span className="text-[#b46b35] mr-3 text-lg">•</span>
                    Download the latest tournament data and initial team prices.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#b46b35] mr-3 text-lg">•</span>
                    Create buy and sell orders in CSV format (player trades).
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#b46b35] mr-3 text-lg">•</span>
                    Upload your trades and select the round to calculate payouts.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#b46b35] mr-3 text-lg">•</span>
                    View your payout results and updated prices.
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl p-8 border border-[#c0ae9f]/60">
                <h3 className="text-2xl font-serif font-semibold mb-3">Trade File Format</h3>
                <p className="text-[#463f3a] leading-relaxed mb-4">
                  Your trades CSV should have the following columns:
                </p>
                <div className="bg-[#f5f1eb] rounded p-4 text-sm font-mono text-[#463f3a] overflow-x-auto">
                  <div>player_id,team_id,round,action,quantity,price</div>
                  <div className="mt-2 text-xs text-[#5b514c]">
                    <div>• player_id: Your unique player identifier</div>
                    <div>• team_id: Team identifier (e.g., Team_1)</div>
                    <div>• round: Round number (1-5)</div>
                    <div>• action: BUY or SELL</div>
                    <div>• quantity: Number of contracts</div>
                    <div>• price: Price per contract (0-100)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bracket' && (
            <TournamentBracket />
          )}

          {activeTab === 'calculate' && (
            <ChallengeUpload />
          )}
        </div>
      </section>
    </main>
  );
}
