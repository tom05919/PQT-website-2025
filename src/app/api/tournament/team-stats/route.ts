import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'game_data',
      'PQT info',
      'initial_team_stats.csv'
    );

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const headers = lines[0].split(',');

    const teams = lines.slice(1).map((line) => {
      const values = line.split(',');
      const team: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        team[header.trim()] = values[index]?.trim() || '';
      });
      return team;
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error reading team stats:', error);
    return NextResponse.json(
      { error: 'Failed to read team stats' },
      { status: 500 }
    );
  }
}
