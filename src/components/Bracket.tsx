'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface Team {
  team: string;
  offense: string;
  defense: string;
  home_game_advantage: string;
  chemistry: string;
  injury_risk: string;
}

interface BracketProps {
  games: Game[];
  roundName: string;
}

export default function Bracket({ games, roundName }: BracketProps) {
  const [teamStats, setTeamStats] = useState<{ [key: string]: Team }>({});
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/tournament/team-stats')
      .then((res) => res.json())
      .then((data) => {
        const statsMap: { [key: string]: Team } = {};
        (data.teams || []).forEach((team: Team) => {
          statsMap[team.team] = team;
        });
        setTeamStats(statsMap);
      })
      .catch((error) => console.error('Error fetching team stats:', error));
  }, []);

  const formatStat = (value: string): number => {
    return parseFloat(value) * 100;
  };

  // Calculate round statistics based on prices (multiply by 100 for display)
  const avgPrice = games.length > 0 
    ? games.reduce((sum, g) => sum + (g.home_team_cost_prob || 0) * 100, 0) / games.length
    : 0;
  const priceRange = games.length > 0
    ? {
        min: Math.min(...games.map(g => (g.home_team_cost_prob || 0) * 100)),
        max: Math.max(...games.map(g => (g.home_team_cost_prob || 0) * 100))
      }
    : { min: 0, max: 0 };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2e2b28] mb-2">
          {roundName}
        </h1>
        <div className="w-24 h-1 bg-[#b46b35] mx-auto mb-4"></div>
        <p className="text-[#463f3a] mt-4 max-w-2xl mx-auto">
          Matchups and prices from tournament data. Results will be revealed after games are played.
        </p>
      </motion.div>

      {/* Round Statistics Summary */}
      {games.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#d8c6b8] rounded-xl p-6 mb-8 border-2 border-[#c0ae9f]"
        >
          <h2 className="text-lg font-serif font-semibold text-[#2e2b28] mb-4">Round Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#c0ae9f] rounded-lg p-4">
              <div className="text-sm text-[#463f3a] mb-1">Total Games</div>
              <div className="text-2xl font-bold text-[#2e2b28]">{games.length}</div>
            </div>
            <div className="bg-[#c0ae9f] rounded-lg p-4">
              <div className="text-sm text-[#463f3a] mb-1">Avg Price</div>
              <div className="text-2xl font-bold text-[#2e2b28]">{avgPrice.toFixed(0)}</div>
              <div className="text-xs text-[#5b514c] mt-1">Home team cost</div>
            </div>
            <div className="bg-[#c0ae9f] rounded-lg p-4">
              <div className="text-sm text-[#463f3a] mb-1">Price Range</div>
              <div className="text-lg font-bold text-[#2e2b28]">
                {priceRange.min.toFixed(0)} - {priceRange.max.toFixed(0)}
              </div>
              <div className="text-xs text-[#5b514c] mt-1">Low to high</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {games.map((game, index) => {
          // Use actual prices from CSV data, multiply by 100 for display
          const homePrice = (game.home_team_cost_prob || 0) * 100;
          const awayPrice = (1 - (game.home_team_cost_prob || 0)) * 100;
          const isSelected = selectedGame === game.game_id;

          return (
            <motion.div
              key={game.game_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedGame(isSelected ? null : game.game_id)}
              className="bg-[#d8c6b8] rounded-xl p-6 border-2 border-[#c0ae9f] hover:border-[#b46b35] transition-all duration-300 relative overflow-hidden group cursor-pointer"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#b46b35]/10 via-transparent to-[#8b5638]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Game number badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs text-[#463f3a] font-mono bg-[#c0ae9f] px-3 py-1 rounded-full">
                  #{game.game_id}
                </span>
              </div>

              <div className="relative z-10">
                {/* Matchup Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-4 py-2 bg-[#c0ae9f] rounded-full border-2 border-[#b46b35]/50"
                    >
                      <span className="text-[#463f3a] font-bold text-sm">MATCHUP</span>
                    </motion.div>
                  </div>
                  
                </div>

                {/* Home Team Card */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="relative p-5 rounded-xl mb-4 transition-all bg-[#c0ae9f] border-2 border-transparent"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-5 h-5 rounded-full bg-[#b46b35] flex-shrink-0 shadow-lg"></div>
                      <div>
                        <div className="font-serif font-bold text-xl text-[#2e2b28]">
                          {game.home_team}
                        </div>
                        <div className="text-xs text-[#463f3a] flex items-center space-x-2">
                          <span>Home</span>
                          {teamStats[game.home_team] && (
                            <a
                              href="/tournament/info"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#b46b35] hover:underline ml-1"
                              title="View team details"
                            >
                              Details
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        <div className="text-2xl font-bold text-[#b46b35]">
                          {homePrice.toFixed(0)}
                        </div>
                        <div className="text-xs text-[#463f3a]">Match Bet</div>
                      </div>
                      <div className="pt-1 border-t border-[#bda89a]">
                        <div className="text-lg font-semibold text-[#8b5638]">
                          {game.home_team_tournament_bet}
                        </div>
                        <div className="text-xs text-[#463f3a]">Tournament Bet</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* VS Divider */}
                <div className="flex items-center justify-center py-2 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c0ae9f] to-[#c0ae9f]"></div>
                  <div className="mx-4 px-4 py-2 bg-[#c0ae9f] border-2 border-[#b46b35]/50 flex items-center justify-center">
                    <span className="text-[#b46b35] font-bold text-lg">VS</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#c0ae9f] to-[#c0ae9f]"></div>
                </div>

                {/* Away Team Card */}
                <motion.div
                  whileHover={{ scale: 1.02, x: -5 }}
                  className="relative p-5 rounded-xl transition-all bg-[#c0ae9f] border-2 border-transparent"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-5 h-5 rounded-full bg-[#8b5638] flex-shrink-0 shadow-lg"></div>
                      <div>
                        <div className="font-serif font-bold text-xl text-[#2e2b28]">
                          {game.away_team}
                        </div>
                        <div className="text-xs text-[#463f3a] flex items-center space-x-2">
                          <span>Away</span>
                          {teamStats[game.away_team] && (
                            <a
                              href="/tournament/info"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#b46b35] hover:underline ml-1"
                              title="View team details"
                            >
                              Details
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        <div className="text-2xl font-bold text-[#8b5638]">
                          {awayPrice.toFixed(0)}
                        </div>
                        <div className="text-xs text-[#463f3a]">Match Bet</div>
                      </div>
                      <div className="pt-1 border-t border-[#bda89a]">
                        <div className="text-lg font-semibold text-[#8b5638]">
                          {game.away_team_tournament_bet}
                        </div>
                        <div className="text-xs text-[#463f3a]">Tournament Bet</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Expanded Team Stats */}
                <AnimatePresence>
                  {isSelected && teamStats[game.home_team] && teamStats[game.away_team] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-[#c0ae9f]"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {/* Home Team Stats */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-[#b46b35] mb-2">
                            {game.home_team} Stats
                          </div>
                          {[
                            { label: 'Offense', value: teamStats[game.home_team].offense, color: '#b46b35' },
                            { label: 'Defense', value: teamStats[game.home_team].defense, color: '#8b5638' },
                            { label: 'Chemistry', value: teamStats[game.home_team].chemistry, color: '#a06133' },
                          ].map((stat) => (
                            <div key={stat.label} className="text-xs">
                              <div className="flex justify-between mb-1">
                                <span className="text-[#463f3a]">{stat.label}</span>
                                <span className="text-[#2e2b28] font-semibold">
                                  {formatStat(stat.value).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-[#bda89a] rounded-full h-1.5">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${formatStat(stat.value)}%`, backgroundColor: stat.color }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Away Team Stats */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-[#8b5638] mb-2">
                            {game.away_team} Stats
                          </div>
                          {[
                            { label: 'Offense', value: teamStats[game.away_team].offense, color: '#b46b35' },
                            { label: 'Defense', value: teamStats[game.away_team].defense, color: '#8b5638' },
                            { label: 'Chemistry', value: teamStats[game.away_team].chemistry, color: '#a06133' },
                          ].map((stat) => (
                            <div key={stat.label} className="text-xs">
                              <div className="flex justify-between mb-1">
                                <span className="text-[#463f3a]">{stat.label}</span>
                                <span className="text-[#2e2b28] font-semibold">
                                  {formatStat(stat.value).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-[#bda89a] rounded-full h-1.5">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${formatStat(stat.value)}%`, backgroundColor: stat.color }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
