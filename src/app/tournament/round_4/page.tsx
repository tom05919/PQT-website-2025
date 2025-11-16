'use client';

import React, { useEffect, useState } from 'react';
import Bracket from '@/components/Bracket';
import PasswordProtection from '@/components/PasswordProtection';

interface Game {
  game_id: number;
  round: string;
  home_team: string;
  away_team: string;
  prob_home_wins: number;
  home_wins: boolean;
  winner: string;
  home_team_cost_prob: number;
  home_team_tournament_bet: number;
  away_team_tournament_bet: number;
}

export default function Round4Page() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  // Check localStorage for previous verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verifiedRounds = JSON.parse(localStorage.getItem('tournament_verified_rounds') || '[]');
      if (verifiedRounds.includes(4)) {
        setVerified(true);
      }
    }
  }, []);

  useEffect(() => {
    if (verified) {
      fetch('/api/tournament/pairings/4')
        .then((res) => res.json())
        .then((data) => {
          setGames(data.games || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching pairings:', error);
          setLoading(false);
        });
    }
  }, [verified]);

  if (!verified) {
    return <PasswordProtection round={4} onVerified={() => setVerified(true)} />;
  }

  if (loading) {
    return (
      <div className="bg-[#d2c3b3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-[#463f3a]">
          Loading bracket...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#d2c3b3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Bracket games={games} roundName="Championship" />
      
      {/* Submission Form */}
      <div className="max-w-6xl mx-auto mt-12 mb-8">
        <div className="bg-[#d8c6b8] rounded-xl p-6 border-2 border-[#b46b35]">
          <h3 className="text-xl font-serif font-semibold text-[#2e2b28] mb-3">Submit Your Championship Prediction</h3>
          <p className="text-[#463f3a] text-sm mb-4">
            Make your pick for the championship game and submit it through the form below.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdWN0E9BdR14t-dik0JxuGpgUkGAnAOJwLPxHsvpCY1JsVcNQ/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#b46b35] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#a06133] transition-colors"
          >
            Submit Championship Prediction →
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex items-center justify-between">
          <a
            href="/tournament/round_3"
            className="px-6 py-3 bg-[#c0ae9f] text-[#2e2b28] rounded-xl font-medium hover:bg-[#bda89a] transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Round 3</span>
          </a>
          
          <div className="flex items-center space-x-2">
            <span className="text-[#463f3a] text-sm">Round 4 of 4</span>
          </div>
          
          <div className="px-6 py-3 text-[#463f3a]">
            <span>Final Round</span>
          </div>
        </div>
      </div>
    </div>
  );
}
