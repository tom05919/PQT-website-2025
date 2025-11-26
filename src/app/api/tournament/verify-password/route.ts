import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { round, password } = await request.json();

    if (!round || !password) {
      return NextResponse.json(
        { error: 'Round and password required' },
        { status: 400 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      'game_data',
      'PQT info',
      'password.txt'
    );

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');

    const passwords: { [key: string]: string } = {};
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        passwords[key.trim()] = value.trim();
      }
    });

    const expectedPassword = passwords[`round_${round}`];

    if (!expectedPassword) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }

    if (password === expectedPassword) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json(
        { verified: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}
