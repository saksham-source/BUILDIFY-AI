import { NextRequest, NextResponse } from 'next/server';
import { generateOverviewWithFallback } from '@/lib/ai-client';
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

    const { data, model } = await generateOverviewWithFallback(input);
    return NextResponse.json({ ...data, model });
  } catch (error) {
    console.error('Error generating overview:', error);
    return NextResponse.json(
      { error: 'Failed to generate overview' },
      { status: 500 }
    );
  }
}
