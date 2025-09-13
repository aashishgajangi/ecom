import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Export theme(s) (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId');
    const includeSystem = searchParams.get('includeSystem') === 'true';

    let themes;

    if (themeId) {
      // Export single theme
      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
        select: {
          name: true,
          slug: true,
          description: true,
          colorScheme: true,
          typography: true,
          spacing: true,
          borders: true,
          version: true,
          tags: true,
          preview: true
        }
      });

      if (!theme) {
        return NextResponse.json(
          { error: 'Theme not found' },
          { status: 404 }
        );
      }

      themes = [theme];
    } else {
      // Export all themes (excluding system themes unless requested)
      themes = await prisma.theme.findMany({
        where: includeSystem ? {} : { isSystem: false },
        select: {
          name: true,
          slug: true,
          description: true,
          colorScheme: true,
          typography: true,
          spacing: true,
          borders: true,
          version: true,
          tags: true,
          preview: true
        },
        orderBy: { name: 'asc' }
      });
    }

    // Create export data
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: user.email,
      themes: themes,
      metadata: {
        totalThemes: themes.length,
        platform: 'Ecom',
        format: 'json'
      }
    };

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="ecom-themes-${Date.now()}.json"`);

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error exporting themes:', error);
    return NextResponse.json(
      { error: 'Failed to export themes' },
      { status: 500 }
    );
  }
}
