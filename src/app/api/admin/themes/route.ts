import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DEFAULT_COLOR_SCHEME, DEFAULT_TYPOGRAPHY, DEFAULT_SPACING, DEFAULT_BORDERS } from '@/types/theme';

// GET - Get all themes (admin)
export async function GET() {
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

    // Get all themes with creator info
    const themes = await prisma.theme.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { isDefault: 'desc' },
        { isSystem: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Get theme settings
    const themeSettings = await prisma.themeSettings.findFirst({
      include: {
        activeTheme: true
      }
    });

    return NextResponse.json({
      success: true,
      themes,
      activeTheme: themeSettings?.activeTheme,
      settings: themeSettings ? {
        allowUserThemes: themeSettings.allowUserThemes,
        enableDarkMode: themeSettings.enableDarkMode
      } : null
    });

  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

// POST - Create new theme (admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    console.log('Theme POST - Session:', session);
    console.log('Theme POST - Headers:', request.headers.get('cookie'));
    
    if (!session?.user || !(session.user as any).id) {
      console.log('Theme POST - No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });

    console.log('Theme POST - User from DB:', user);

    if (user?.role !== 'ADMIN') {
      console.log('Theme POST - User role is not ADMIN:', user?.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const {
      name,
      slug,
      description,
      colorScheme,
      typography,
      spacing,
      borders,
      isActive = true,
      isDefault = false,
      tags = [],
      preview
    } = await request.json();

    if (!name || !slug || !colorScheme) {
      return NextResponse.json(
        { error: 'Name, slug, and color scheme are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTheme = await prisma.theme.findUnique({
      where: { slug }
    });

    if (existingTheme) {
      return NextResponse.json(
        { error: 'Theme with this slug already exists' },
        { status: 400 }
      );
    }

    // If setting as default, unset any existing default
    if (isDefault) {
      await prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    // Create new theme
    const theme = await prisma.theme.create({
      data: {
        name,
        slug,
        description,
        isActive,
        isDefault,
        isSystem: false,
        colorScheme,
        typography: (typography || DEFAULT_TYPOGRAPHY) as any,
        spacing: (spacing || DEFAULT_SPACING) as any,
        borders: (borders || DEFAULT_BORDERS) as any,
        createdBy: (session.user as any).id,
        version: '1.0.0',
        tags,
        preview
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      theme,
      message: 'Theme created successfully'
    });

  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    );
  }
}
