import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the homepage (page where isHomepage is true)
    const homepage = await prisma.page.findFirst({
      where: { 
        isHomepage: true,
        isPublished: true 
      }
    });

    if (!homepage) {
      return NextResponse.json({ page: null });
    }

    return NextResponse.json({ page: homepage });

  } catch (error) {
    console.error('Get homepage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage' },
      { status: 500 }
    );
  }
}
