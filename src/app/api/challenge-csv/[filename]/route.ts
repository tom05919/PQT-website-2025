import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Only allow specific CSV files to be downloaded
    if (!filename.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Construct the file path
    const filePath = join(process.cwd(), 'src', 'app', 'api', 'challenge-csv', filename);
    
    // Read the file
    const fileContent = await readFile(filePath, 'utf-8');
    
    // Return the CSV file
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}

