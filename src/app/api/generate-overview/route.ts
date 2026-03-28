import { NextRequest, NextResponse } from 'next/server';
import { generateOverview } from '@/lib/minimax';
import { StartupInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: StartupInput = {
      name: body.name,
      description: body.description || '',
    };

    if (!input.name) {
      return NextResponse.json(
        { error: 'Startup name is required' },
        { status: 400 }
      );
    }

    const overview = await generateOverview(input);
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error generating overview:', error);
    return NextResponse.json(
      { error: 'Failed to generate overview' },
      { status: 500 }
    );
  }
}
