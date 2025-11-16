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

    const filePath = path.join(
      process.cwd(),
      'game_data',
      'PQT info',
      'Pairings',
      'all_games.csv'
    );

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const allHeaders = lines[0].split(',');
    // Skip the first empty header, get the rest
    const headers = allHeaders.slice(1).map(h => h.trim());

    // Filter games by round and parse
    const games = lines.slice(1)
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

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error reading pairings:', error);
    return NextResponse.json(
      { error: 'Failed to read pairings' },
      { status: 500 }
    );
  }
}
