import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const roundNameMap: { [key: string]: string } = {
  '1': 'Sweet 16',
  '2': 'Elite 8',
  '3': 'Final Four',
  '4': 'Championship',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ round: string }> }
) {
  try {
    const { round } = await params;
    const roundName = roundNameMap[round];

    if (!roundName) {
      return NextResponse.json(
        { error: 'Invalid round number' },
        { status: 400 }
      );
    }

    // Read match bet prices from all_games.csv
    const matchBetPath = path.join(
      process.cwd(),
      'game_data',
      'PQT info',
      'Pairings',
      'all_games.csv'
    );

    const matchBetContent = fs.readFileSync(matchBetPath, 'utf-8');
    const matchBetLines = matchBetContent.trim().split('\n');
    const allHeaders = matchBetLines[0].split(',');
    // Skip the first empty header, get the rest
    const headers = allHeaders.slice(1).map(h => h.trim());

    // Filter games by round and parse
    const games = matchBetLines.slice(1)
      .map((line) => {
        const values = line.split(',');
        // Skip the first value (index column), get the rest
        const dataValues = values.slice(1);
        const game: { [key: string]: string | number | boolean } = {};
        
        headers.forEach((header, index) => {
          const value = dataValues[index]?.trim() || '';
          const headerName = header.trim();
          
          if (!headerName) return; // Skip empty headers
          
          if (headerName === 'game_id') {
            game[headerName] = parseInt(value) || 0;
          } else if (headerName === 'prob_home_wins' || headerName === 'home_team_cost_prob') {
            game[headerName] = parseFloat(value) || 0;
          } else if (headerName === 'home_wins') {
            game[headerName] = value.toLowerCase() === 'true';
          } else {
            game[headerName] = value;
          }
        });
        return game;
      })
      .filter((game) => game.round === roundName);

    // Read tournament bet prices from bet_team_wins_cost[26].csv
    const tournamentBetPath = path.join(
      process.cwd(),
      'game_data',
      'PQT info',
      'Pairings',
      'bet_team_wins_cost[26].csv'
    );

    const tournamentBetContent = fs.readFileSync(tournamentBetPath, 'utf-8');
    const tournamentBetLines = tournamentBetContent.trim().split('\n');
    const tournamentHeaders = tournamentBetLines[0].split(',').map(h => h.trim());
    
    // Create a map of team -> round -> price
    const tournamentPrices: { [team: string]: { [round: string]: number } } = {};
    
    tournamentBetLines.slice(1).forEach((line) => {
      const values = line.split(',');
      const teamName = values[0]?.trim();
      if (!teamName) return;
      
      tournamentPrices[teamName] = {};
      tournamentHeaders.slice(1).forEach((round, index) => {
        const price = parseFloat(values[index + 1]) || 0;
        tournamentPrices[teamName][round] = price;
      });
    });

    // Merge tournament bet prices into games
    games.forEach((game) => {
      const homeTeam = game.home_team as string;
      const awayTeam = game.away_team as string;
      
      game.home_team_tournament_bet = tournamentPrices[homeTeam]?.[roundName] || 0;
      game.away_team_tournament_bet = tournamentPrices[awayTeam]?.[roundName] || 0;
    });

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error reading pairings:', error);
    return NextResponse.json(
      { error: 'Failed to read pairings' },
      { status: 500 }
    );
  }
}
