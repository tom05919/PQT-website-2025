import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const roundFileMap: { [key: string]: string } = {
  '1': 'sweet_16_pairings.csv',
  '2': 'elite_8_pairings.csv',
  '3': 'final_four_pairings.csv',
  '4': 'championship_pairings.csv',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ round: string }> }
) {
  try {
    const { round } = await params;
    const fileName = roundFileMap[round];

    if (!fileName) {
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
      fileName
    );

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const headers = lines[0].split(',');

    const games = lines.slice(1).map((line) => {
      const values = line.split(',');
      const game: { [key: string]: string | number | boolean } = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        const headerName = header.trim();
        
        if (headerName === 'game_id') {
          game[headerName] = parseInt(value) || 0;
        } else if (headerName === 'prob_home_wins') {
          game[headerName] = parseFloat(value) || 0;
        } else if (headerName === 'home_wins') {
          game[headerName] = value.toLowerCase() === 'true';
        } else {
          game[headerName] = value;
        }
      });
      return game;
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
