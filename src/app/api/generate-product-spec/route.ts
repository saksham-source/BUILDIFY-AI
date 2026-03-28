import { NextRequest, NextResponse } from 'next/server';
import { generateProductSpec } from '@/lib/minimax';
import { StartupOverview } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { overview, startupName } = body as {
      overview: StartupOverview;
      startupName: string;
    };

    if (!overview || !startupName) {
      return NextResponse.json(
        { error: 'Overview and startup name are required' },
        { status: 400 }
      );
    }

    const productSpec = await generateProductSpec(overview, startupName);
    return NextResponse.json(productSpec);
  } catch (error) {
    console.error('Error generating product spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate product spec' },
      { status: 500 }
    );
  }
}
