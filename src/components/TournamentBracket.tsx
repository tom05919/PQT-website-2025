'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface Match {
  round: number;
  match_id: number;
  teamA_id: number;
  teamB_id: number;
  teamA: string;
  teamB: string;
  winner: string;
  loser: string;
}

// Password mapping for each round
const ROUND_PASSWORDS: Record<number, string> = {
  1: 'round1',
  2: 'round2',
  3: 'round3',
  4: 'round4',
  5: 'round5',
  6: 'champion',
};

export default function TournamentBracket() {
  const [round, setRound] = useState<number>(1);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlockedRounds, setUnlockedRounds] = useState<Set<number>>(new Set([1]));
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [selectedRoundForPassword, setSelectedRoundForPassword] = useState<number | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const csvResponse = await fetch('/api/tournament-results');

        if (!csvResponse.ok) {
          throw new Error('Failed to load tournament results');
        }

        const csvText = await csvResponse.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: { data: Record<string, string>[] }) => {
            const parsedMatches: Match[] = results.data
              .filter((row) => row.round && row.teamA)
              .map((row) => ({
                round: parseInt(row.round),
                match_id: parseInt(row.match_id),
                teamA_id: parseInt(row.teamA_id),
                teamB_id: parseInt(row.teamB_id),
                teamA: row.teamA,
                teamB: row.teamB,
                winner: row.winner,
                loser: row.loser,
              }));

            setMatches(parsedMatches);
          },
          error: (error: { message: string }) => {
            setError(`CSV parsing error: ${error.message}`);
          },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-[#463f3a]">Loading tournament bracket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

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
      <div className="flex items-center justify-center gap-4">
        <label className="text-lg font-medium text-[#463f3a]">View Round:</label>
        <select
          value={round}
          onChange={(e) => handleRoundChange(parseInt(e.target.value))}
          className="px-6 py-2 border border-[#c0ae9f] rounded-lg bg-white text-[#2e2b28] focus:outline-none focus:ring-2 focus:ring-[#d26b2c] focus:border-transparent"
        >
          <option value={1} >Round of 16 {unlockedRounds.has(1) ? '🔓' : '🔒'}</option>
          <option value={2} >Round of 8 {unlockedRounds.has(2) ? '🔓' : '🔒'}</option>
          <option value={3} >Quarterfinals {unlockedRounds.has(3) ? '🔓' : '🔒'}</option>
          <option value={4} >Semifinals {unlockedRounds.has(4) ? '🔓' : '🔒'}</option>
          <option value={5} >Finals {unlockedRounds.has(5) ? '🔓' : '🔒'}</option>
          <option value={6} >Champion {unlockedRounds.has(6) ? '🔓' : '🔒'}</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-[#c0ae9f]/60 overflow-x-auto">
        <BracketDisplay round={round} matches={matches} />
      </div>
    </div>
  );
}

interface BracketDisplayProps {
  round: number;
  matches: Match[];
}

function BracketDisplay({ round, matches }: BracketDisplayProps) {
  // Get matchups for current round (what's being played now)
  const currentRoundMatches = matches.filter((m) => m.round === round);

  // Get winners from PREVIOUS round (only show if not round 1)
  const previousRoundMatches =
    round > 1 ? matches.filter((m) => m.round === round - 1) : [];
  const previousRoundWinners = previousRoundMatches.map((m) => m.winner);

  if (round === 6) {
    // Special case: Round 6 is the champion view
    const finalsMatches = matches.filter((m) => m.round === 5);
    const champion = finalsMatches[0]?.winner;
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-7xl mb-4">👑</div>
        <div className="bg-yellow-50 rounded-xl p-8 border-3 border-yellow-400 min-w-[250px] text-center">
          <h3 className="text-sm font-medium text-[#5b514c] mb-2">
            Tournament Champion
          </h3>
          <div className="text-2xl font-bold text-yellow-800">
            {champion || 'TBD'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-max">
      <div className="flex gap-12 items-start">
        {/* Previous Round Winners (from last round) */}
        {round > 1 && previousRoundWinners.length > 0 && (
          <div>
            <h3 className="text-xl font-serif font-semibold text-[#463f3a] mb-6">
              Round {round - 1} Winners
            </h3>
            <div className="space-y-4">
              {previousRoundWinners.map((winner, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 rounded-lg p-4 border-2 border-green-400 min-w-[220px]"
                >
                  <div className="text-sm font-bold text-green-800 text-center">
                    ✓ {winner}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Arrow (only if there are previous winners) */}
        {round > 1 && (
          <div className="flex items-center px-6 h-64">
            <div className="text-5xl text-[#c0ae9f]">→</div>
          </div>
        )}

        {/* Current Round Matchups */}
        <div>
          <h3 className="text-xl font-serif font-semibold text-[#463f3a] mb-6">
            Round {round} Matchups
          </h3>
          <div className="space-y-4">
            {currentRoundMatches.map((match) => (
              <div
                key={match.match_id}
                className="bg-[#f5f1eb] rounded-lg p-4 border-2 border-[#c0ae9f] min-w-[220px] hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-semibold text-[#463f3a] p-2 bg-white rounded border border-[#e9e1d9] mb-2 text-center">
                  {match.teamA}
                </div>
                <div className="text-xs text-center text-[#5b514c] py-1 font-bold">
                  vs
                </div>
                <div className="text-sm font-semibold text-[#463f3a] p-2 bg-white rounded border border-[#e9e1d9] text-center">
                  {match.teamB}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
