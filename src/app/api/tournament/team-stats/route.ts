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

    const teamsMap = new Map<string, { [key: string]: string }>();
    
    lines.slice(1).forEach((line) => {
      const values = line.split(',');
      const team: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        team[header.trim()] = values[index]?.trim() || '';
      });
      const teamName = team.team?.trim();
      // Only add if team name exists and we haven't seen it before
      if (teamName && !teamsMap.has(teamName)) {
        teamsMap.set(teamName, team);
      }
    });

    const teams = Array.from(teamsMap.values());

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error reading team stats:', error);
    return NextResponse.json(
      { error: 'Failed to read team stats' },
      { status: 500 }
    );
  }
}
