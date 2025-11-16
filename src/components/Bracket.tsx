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
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);
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

  const getProbabilityColor = (prob: number) => {
    if (prob > 0.6) return 'text-[#8b5638]';
    if (prob < 0.4) return 'text-[#9d6b4a]';
    return 'text-[#a06133]';
  };

  const getProbabilityBgColor = (prob: number) => {
    if (prob > 0.6) return 'bg-[#8b5638]';
    if (prob < 0.4) return 'bg-[#9d6b4a]';
    return 'bg-[#a06133]';
  };

  const formatStat = (value: string): number => {
    return parseFloat(value) * 100;
  };

  const getTeamStrength = (teamName: string): number => {
    const team = teamStats[teamName];
    if (!team) return 0;
    const offense = formatStat(team.offense);
    const defense = formatStat(team.defense);
    const chemistry = formatStat(team.chemistry);
    return (offense + defense + chemistry) / 3;
  };

  // Calculate round statistics
  const closeGames = games.filter(g => Math.abs(g.prob_home_wins - 0.5) < 0.1).length;
  const avgProbSpread = games.length > 0 
    ? games.reduce((sum, g) => sum + Math.abs(g.prob_home_wins - 0.5), 0) / games.length * 100
    : 0;
  const mostCompetitive = games.length > 0
    ? games.reduce((closest, g) => {
        const spread = Math.abs(g.prob_home_wins - 0.5);
        return spread < closest.spread ? { game: g, spread } : closest;
      }, { game: games[0], spread: 1 })
    : null;

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
          Matchups and win probabilities from tournament data. Results will be revealed after games are played.
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
              <div className="text-sm text-[#463f3a] mb-1">Close Matchups</div>
              <div className="text-2xl font-bold text-[#2e2b28]">{closeGames}</div>
              <div className="text-xs text-[#5b514c] mt-1">Within 10% spread</div>
            </div>
            {mostCompetitive && (
              <div className="bg-[#c0ae9f] rounded-lg p-4">
                <div className="text-sm text-[#463f3a] mb-1">Most Competitive</div>
                <div className="text-lg font-bold text-[#2e2b28]">
                  {mostCompetitive.game.home_team} vs {mostCompetitive.game.away_team}
                </div>
                <div className="text-xs text-[#5b514c] mt-1">
                  {Math.abs(mostCompetitive.game.prob_home_wins - 0.5) * 100 < 1 ? 'Toss-up' : `${(Math.abs(mostCompetitive.game.prob_home_wins - 0.5) * 100).toFixed(1)}% spread`}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {games.map((game, index) => {
          // Use actual probability from CSV data
          const homeProb = Math.round(game.prob_home_wins * 100);
          const awayProb = 100 - homeProb;
          const homeStrength = getTeamStrength(game.home_team);
          const awayStrength = getTeamStrength(game.away_team);
          const isClose = Math.abs(homeProb - awayProb) < 10;
          const isSelected = selectedGame === game.game_id;

          return (
            <motion.div
              key={game.game_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredGame(game.game_id)}
              onMouseLeave={() => setHoveredGame(null)}
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
                  
                  {isClose && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mb-2"
                    >
                      <span className="text-xs bg-[#a06133]/20 text-[#8b5638] px-3 py-1 rounded-full font-medium">
                        Toss-Up Game
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Home Team Card */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`relative p-5 rounded-xl mb-4 transition-all ${
                    homeProb > awayProb
                      ? 'bg-gradient-to-r from-[#b46b35]/20 to-[#b46b35]/5 border-2 border-[#b46b35]/50'
                      : 'bg-[#c0ae9f] border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-5 h-5 rounded-full ${getProbabilityBgColor(game.prob_home_wins)} flex-shrink-0 shadow-lg`}></div>
                      <div>
                        <div className="font-serif font-bold text-xl text-[#2e2b28]">
                          {game.home_team}
                        </div>
                        <div className="text-xs text-[#463f3a] flex items-center space-x-2">
                          <span>Home</span>
                          {teamStats[game.home_team] && (
                            <>
                              <span>•</span>
                              <span className="font-medium">Strength: {homeStrength.toFixed(0)}%</span>
                              <a
                                href="/tournament/info"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#b46b35] hover:underline ml-1"
                                title="View team details"
                              >
                                Details
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getProbabilityColor(game.prob_home_wins)}`}>
                        {homeProb}%
                      </div>
                      <div className="text-xs text-[#463f3a]">Win Prob</div>
                    </div>
                  </div>
                  
                  {/* Probability Bar */}
                  <div className="mt-3 w-full bg-[#bda89a] rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${homeProb}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${getProbabilityBgColor(game.prob_home_wins)} rounded-full shadow-lg`}
                    ></motion.div>
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
                  className={`relative p-5 rounded-xl transition-all ${
                    awayProb > homeProb
                      ? 'bg-gradient-to-r from-[#8b5638]/20 to-[#8b5638]/5 border-2 border-[#8b5638]/50'
                      : 'bg-[#c0ae9f] border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-5 h-5 rounded-full ${getProbabilityBgColor(1 - game.prob_home_wins)} flex-shrink-0 shadow-lg`}></div>
                      <div>
                        <div className="font-serif font-bold text-xl text-[#2e2b28]">
                          {game.away_team}
                        </div>
                        <div className="text-xs text-[#463f3a] flex items-center space-x-2">
                          <span>Away</span>
                          {teamStats[game.away_team] && (
                            <>
                              <span>•</span>
                              <span className="font-medium">Strength: {awayStrength.toFixed(0)}%</span>
                              <a
                                href="/tournament/info"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#b46b35] hover:underline ml-1"
                                title="View team details"
                              >
                                Details
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getProbabilityColor(1 - game.prob_home_wins)}`}>
                        {awayProb}%
                      </div>
                      <div className="text-xs text-[#463f3a]">Win Prob</div>
                    </div>
                  </div>
                  
                  {/* Probability Bar */}
                  <div className="mt-3 w-full bg-[#bda89a] rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${awayProb}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                      className={`h-full ${getProbabilityBgColor(1 - game.prob_home_wins)} rounded-full shadow-lg`}
                    ></motion.div>
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

                {/* Hover Analysis */}
                {hoveredGame === game.game_id && !isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-[#c0ae9f]"
                  >
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-[#463f3a] font-medium mb-1">Matchup Analysis</div>
                        <div className="text-[#5b514c]">
                          {homeProb > awayProb ? (
                            <span>{game.home_team} is favored by {Math.abs(homeProb - awayProb)}%</span>
                          ) : awayProb > homeProb ? (
                            <span>{game.away_team} is favored by {Math.abs(homeProb - awayProb)}%</span>
                          ) : (
                            <span>Evenly matched game</span>
                          )}
                        </div>
                      </div>
                      {teamStats[game.home_team] && teamStats[game.away_team] && (
                        <div>
                          <div className="text-[#463f3a] font-medium mb-1">Quick Stats</div>
                          <div className="text-[#5b514c] space-y-0.5">
                            <div>Offense: {formatStat(teamStats[game.home_team].offense).toFixed(0)}% vs {formatStat(teamStats[game.away_team].offense).toFixed(0)}%</div>
                            <div>Defense: {formatStat(teamStats[game.home_team].defense).toFixed(0)}% vs {formatStat(teamStats[game.away_team].defense).toFixed(0)}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
