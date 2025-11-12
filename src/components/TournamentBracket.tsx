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

export default function TournamentBracket() {
  const [round, setRound] = useState<number>(1);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          complete: (results) => {
            const parsedMatches: Match[] = results.data
              .filter((row: any) => row.round && row.teamA)
              .map((row: any) => ({
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
          error: (error) => {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-4">
        <label className="text-lg font-medium text-[#463f3a]">View Round:</label>
        <select
          value={round}
          onChange={(e) => setRound(parseInt(e.target.value))}
          className="px-6 py-2 border border-[#c0ae9f] rounded-lg bg-white text-[#2e2b28] focus:outline-none focus:ring-2 focus:ring-[#d26b2c] focus:border-transparent"
        >
          <option value={1}>Round of 16</option>
          <option value={2}>Round of 8</option>
          <option value={3}>Quarterfinals</option>
          <option value={4}>Semifinals</option>
          <option value={5}>Finals</option>
          <option value={6}>Champion</option>
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
