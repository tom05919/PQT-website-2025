'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Team {
  team: string;
  offense: string;
  defense: string;
  home_game_advantage: string;
  chemistry: string;
  injury_risk: string;
}

type SortField = 'team' | 'offense' | 'defense' | 'home_game_advantage' | 'chemistry' | 'injury_risk';
type ViewMode = 'cards' | 'comparison' | 'stats';

export default function TournamentInfoPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('team');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [compareTeams, setCompareTeams] = useState<string[]>([]);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tournament/team-stats')
      .then((res) => res.json())
      .then((data) => {
        const teamsData = data.teams || [];
        setTeams(teamsData);
        setFilteredTeams(teamsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching team stats:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...teams];

    if (searchQuery) {
      filtered = filtered.filter((team) =>
        team.team.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortField === 'team') {
        const aVal = a[sortField] as string;
        const bVal = b[sortField] as string;
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const aVal = parseFloat(a[sortField] as string);
      const bVal = parseFloat(b[sortField] as string);
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    setFilteredTeams(filtered);
  }, [teams, searchQuery, sortField, sortDirection]);

  const formatStat = (value: string): number => {
    return parseFloat(value) * 100;
  };

  const getTeamRank = (team: Team, field: SortField): number => {
    const sorted = [...teams].sort((a, b) => {
      const aVal = parseFloat(a[field]);
      const bVal = parseFloat(b[field]);
      return bVal - aVal;
    });
    return sorted.findIndex((t) => t.team === team.team) + 1;
  };

  const toggleCompare = (teamName: string) => {
    setCompareTeams((prev) =>
      prev.includes(teamName)
        ? prev.filter((t) => t !== teamName)
        : prev.length < 3
        ? [...prev, teamName]
        : prev
    );
  };

  const getOverallScore = (team: Team): number => {
    const offense = formatStat(team.offense);
    const defense = formatStat(team.defense);
    const chemistry = formatStat(team.chemistry);
    const homeAdv = formatStat(team.home_game_advantage);
    const injuryRisk = formatStat(team.injury_risk);
    return (offense * 0.3 + defense * 0.3 + chemistry * 0.2 + homeAdv * 0.15 - injuryRisk * 0.05);
  };

  const getTeamCategory = (team: Team): string => {
    const score = getOverallScore(team);
    if (score > 60) return 'Elite';
    if (score > 45) return 'Strong';
    if (score > 30) return 'Competitive';
    return 'Underdog';
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Elite': return 'text-[#b46b35] border-[#b46b35]';
      case 'Strong': return 'text-[#8b5638] border-[#8b5638]';
      case 'Competitive': return 'text-[#9d6b4a] border-[#9d6b4a]';
      default: return 'text-[#5b514c] border-[#5b514c]';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#d2c3b3] min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#b46b35] border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  // Comparison View
  if (viewMode === 'comparison' && compareTeams.length > 0) {
    const compareData = compareTeams.map(name => teams.find(t => t.team === name)).filter(Boolean) as Team[];
    
    return (
      <div className="bg-[#d2c3b3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2e2b28]">
                Team Comparison
              </h1>
              <button
                onClick={() => setViewMode('cards')}
                className="px-4 py-2 bg-[#d8c6b8] text-[#2e2b28] rounded-lg hover:bg-[#c0ae9f] transition-colors font-medium"
              >
                Back to Cards
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {compareData.map((team, idx) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#d8c6b8] rounded-xl p-6 border-2 border-[#b46b35]"
              >
                <h2 className="text-2xl font-serif font-bold text-[#b46b35] mb-4">{team.team}</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Offense', value: team.offense, color: 'bg-[#b46b35]' },
                    { label: 'Defense', value: team.defense, color: 'bg-[#8b5638]' },
                    { label: 'Chemistry', value: team.chemistry, color: 'bg-[#a06133]' },
                    { label: 'Home Adv', value: team.home_game_advantage, color: 'bg-[#9d6b4a]' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#463f3a]">{stat.label}</span>
                        <span className="text-[#2e2b28] font-semibold">
                          {formatStat(stat.value).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#c0ae9f] rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${formatStat(stat.value)}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-full ${stat.color} rounded-full`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Stats View
  if (viewMode === 'stats') {
    const statsData = [
      { label: 'Offense', field: 'offense' as SortField, color: '#b46b35' },
      { label: 'Defense', field: 'defense' as SortField, color: '#8b5638' },
      { label: 'Chemistry', field: 'chemistry' as SortField, color: '#a06133' },
      { label: 'Home Advantage', field: 'home_game_advantage' as SortField, color: '#9d6b4a' },
    ];

    return (
      <div className="bg-[#d2c3b3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2e2b28]">
                Statistical Analysis
              </h1>
              <button
                onClick={() => setViewMode('cards')}
                className="px-4 py-2 bg-[#d8c6b8] text-[#2e2b28] rounded-lg hover:bg-[#c0ae9f] transition-colors font-medium"
              >
                Back to Cards
              </button>
            </div>
          </motion.div>

          <div className="space-y-8">
            {statsData.map((stat) => {
              const sorted = [...teams].sort((a, b) => {
                const aVal = parseFloat(a[stat.field]);
                const bVal = parseFloat(b[stat.field]);
                return bVal - aVal;
              });

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#d8c6b8] rounded-xl p-6 border-2 border-[#c0ae9f]"
                >
                  <h2 className="text-2xl font-serif font-semibold text-[#2e2b28] mb-4">
                    {stat.label} Rankings
                  </h2>
                  <div className="space-y-3">
                    {sorted.map((team, idx) => (
                      <div key={team.team} className="flex items-center space-x-4">
                        <div className="w-12 text-center text-[#463f3a] font-semibold">
                          #{idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-[#2e2b28]">{team.team}</span>
                            <span className="text-[#463f3a] font-semibold">
                              {formatStat(team[stat.field]).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-[#c0ae9f] rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${formatStat(team[stat.field])}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: stat.color }}
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#d2c3b3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2e2b28] mb-4">
            Tournament Intelligence Center
          </h1>
          <p className="text-[#463f3a] text-lg max-w-2xl mx-auto">
            Comprehensive team analytics, rankings, and strategic insights for informed decision-making
          </p>
          <div className="w-24 h-1 bg-[#b46b35] mx-auto mt-4"></div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Teams', value: teams.length },
            { label: 'Elite Teams', value: teams.filter(t => getOverallScore(t) > 60).length },
            { label: 'Avg Offense', value: (teams.reduce((sum, t) => sum + formatStat(t.offense), 0) / teams.length).toFixed(1) + '%' },
            { label: 'Avg Defense', value: (teams.reduce((sum, t) => sum + formatStat(t.defense), 0) / teams.length).toFixed(1) + '%' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="bg-[#d8c6b8] rounded-xl p-4 border-2 border-[#c0ae9f] hover:border-[#b46b35] transition-all"
            >
              <div className="text-2xl font-serif font-bold text-[#b46b35] mb-1">{stat.value}</div>
              <div className="text-xs text-[#463f3a] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#d8c6b8] rounded-xl p-6 mb-8 border-2 border-[#c0ae9f]"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2e2b28] mb-2">
                Search Teams
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type team name to search..."
                className="w-full px-4 py-3 bg-[#c0ae9f] border border-[#bda89a] rounded-lg text-[#2e2b28] focus:outline-none focus:ring-2 focus:ring-[#b46b35] transition-all placeholder:text-[#5b514c]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2e2b28] mb-2">
                Sort By
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="w-full px-4 py-3 bg-[#c0ae9f] border border-[#bda89a] rounded-lg text-[#2e2b28] focus:outline-none focus:ring-2 focus:ring-[#b46b35]"
              >
                <option value="team">Team Name</option>
                <option value="offense">Offense</option>
                <option value="defense">Defense</option>
                <option value="chemistry">Chemistry</option>
                <option value="home_game_advantage">Home Advantage</option>
                <option value="injury_risk">Injury Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2e2b28] mb-2">
                Direction
              </label>
              <button
                onClick={() =>
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                }
                className="w-full px-4 py-3 bg-[#c0ae9f] border border-[#bda89a] rounded-lg text-[#2e2b28] hover:bg-[#bda89a] transition-colors font-medium"
              >
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center space-x-4">
            {(['cards', 'comparison', 'stats'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-2 rounded-lg transition-all font-medium ${
                  viewMode === mode
                    ? 'bg-[#b46b35] text-white shadow-lg'
                    : 'bg-[#c0ae9f] text-[#2e2b28] hover:bg-[#bda89a]'
                }`}
              >
                {mode === 'cards' ? 'Card View' : mode === 'comparison' ? 'Compare' : 'Stats View'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Comparison Bar */}
        {compareTeams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#d8c6b8] border-2 border-[#b46b35] rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-[#2e2b28] font-semibold">Comparing Teams ({compareTeams.length}/3):</span>
                {compareTeams.map((team) => (
                  <motion.span
                    key={team}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-[#b46b35] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                  >
                    {team}
                  </motion.span>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode('comparison')}
                  className="px-4 py-2 bg-[#b46b35] text-white rounded-lg hover:bg-[#a06133] transition-colors font-medium"
                >
                  View Comparison
                </button>
                <button
                  onClick={() => setCompareTeams([])}
                  className="px-4 py-2 bg-[#c0ae9f] text-[#2e2b28] rounded-lg hover:bg-[#bda89a] transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Teams Grid */}
        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => {
              const overallScore = getOverallScore(team);
              const category = getTeamCategory(team);
              const isSelected = selectedTeam === team.team;
              const isComparing = compareTeams.includes(team.team);

              return (
                <motion.div
                  key={team.team}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  onClick={() => setSelectedTeam(isSelected ? null : team.team)}
                  className={`bg-[#d8c6b8] rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'border-[#b46b35] shadow-2xl scale-105'
                      : isComparing
                      ? 'border-[#8b5638] shadow-lg'
                      : 'border-[#c0ae9f] hover:border-[#b46b35] hover:shadow-lg'
                  }`}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#b46b35]/10 via-transparent to-[#8b5638]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h2 className="text-2xl font-serif font-bold text-[#b46b35]">
                            {team.team}
                          </h2>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(category)}`}>
                            {category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-[#463f3a]">
                          <span>Overall: <span className="text-[#b46b35] font-bold">{overallScore.toFixed(1)}%</span></span>
                          <span>Rank: <span className="text-[#2e2b28] font-semibold">#{teams.sort((a, b) => getOverallScore(b) - getOverallScore(a)).findIndex(t => t.team === team.team) + 1}</span></span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(team.team);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isComparing
                            ? 'bg-[#8b5638] text-white shadow-lg'
                            : 'bg-[#c0ae9f] text-[#2e2b28] hover:bg-[#bda89a]'
                        }`}
                      >
                        {isComparing ? 'Selected' : 'Compare'}
                      </button>
                    </div>

                    {/* Overall Score Bar */}
                    <div className="mb-5">
                      <div className="w-full bg-[#c0ae9f] rounded-full h-4 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${overallScore}%` }}
                          transition={{ duration: 1.2, delay: index * 0.05, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#b46b35] to-[#8b5638] rounded-full shadow-lg"
                        ></motion.div>
                      </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'Offense', value: team.offense, color: '#b46b35', rank: getTeamRank(team, 'offense') },
                        { label: 'Defense', value: team.defense, color: '#8b5638', rank: getTeamRank(team, 'defense') },
                        { label: 'Chemistry', value: team.chemistry, color: '#a06133', rank: getTeamRank(team, 'chemistry') },
                        { label: 'Home Adv', value: team.home_game_advantage, color: '#9d6b4a', rank: getTeamRank(team, 'home_game_advantage') },
                      ].map((stat) => (
                        <motion.div
                          key={stat.label}
                          onMouseEnter={() => setHoveredStat(`${team.team}-${stat.label}`)}
                          onMouseLeave={() => setHoveredStat(null)}
                          whileHover={{ scale: 1.05 }}
                          className="bg-[#c0ae9f] rounded-lg p-3 hover:bg-[#bda89a] transition-all border border-transparent hover:border-[#b46b35]/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#463f3a] font-medium">{stat.label}</span>
                            <span className="text-xs text-[#5b514c] bg-[#d8c6b8] px-1.5 py-0.5 rounded">
                              #{stat.rank}
                            </span>
                          </div>
                          <div className="text-xl font-bold text-[#2e2b28] mb-2">
                            {formatStat(stat.value).toFixed(1)}%
                          </div>
                          <div className="w-full bg-[#bda89a] rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${formatStat(stat.value)}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
                              className="h-full rounded-full shadow-sm"
                              style={{ backgroundColor: stat.color }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Injury Risk Indicator */}
                    {formatStat(team.injury_risk) > 20 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#8b5638]/20 border border-[#8b5638]/50 rounded-lg p-2 mb-4"
                      >
                        <span className="text-xs text-[#8b5638] font-medium">
                          High Injury Risk: {formatStat(team.injury_risk).toFixed(1)}%
                        </span>
                      </motion.div>
                    )}

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-[#c0ae9f] space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-[#463f3a]">Injury Risk</span>
                              <div className="text-[#2e2b28] font-semibold">
                                {formatStat(team.injury_risk).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="text-[#463f3a]">Category</span>
                              <div className="font-semibold text-[#b46b35]">
                                {category}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-[#463f3a] pt-2 border-t border-[#c0ae9f]">
                            Rankings: #{getTeamRank(team, 'offense')} Offense • #{getTeamRank(team, 'defense')} Defense • #{getTeamRank(team, 'chemistry')} Chemistry
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="/tournament/round_1"
            className="inline-block bg-[#b46b35] text-white px-10 py-4 rounded-xl font-semibold hover:bg-[#a06133] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View Round 1 Bracket →
          </a>
        </motion.div>
      </div>
    </div>
  );
}