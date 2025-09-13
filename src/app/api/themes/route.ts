import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_COLOR_SCHEME, DEFAULT_TYPOGRAPHY, DEFAULT_SPACING, DEFAULT_BORDERS } from '@/types/theme';

// GET - Get all public themes and active theme
export async function GET() {
  try {
    // Get theme settings
    let themeSettings = await prisma.themeSettings.findFirst({
      include: {
        activeTheme: true
      }
    });

    // Get all active themes
    const themes = await prisma.theme.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { isSystem: 'desc' },
        { name: 'asc' }
      ]
    });

    // If no theme settings exist, create default
    if (!themeSettings) {
      // Create default theme first if it doesn't exist
      let defaultTheme = await prisma.theme.findFirst({
        where: { isDefault: true }
      });

      if (!defaultTheme) {
        defaultTheme = await prisma.theme.create({
          data: {
            name: 'Ecom Green',
            slug: 'ecom-green',
            description: 'Default green theme for Ecom platform',
            isActive: true,
            isDefault: true,
            isSystem: true,
            colorScheme: DEFAULT_COLOR_SCHEME as any,
            typography: DEFAULT_TYPOGRAPHY as any,
            spacing: DEFAULT_SPACING as any,
            borders: DEFAULT_BORDERS as any,
            version: '1.0.0',
            tags: ['default', 'green', 'nature']
          }
        });
      }

      // Create theme settings
      themeSettings = await prisma.themeSettings.create({
        data: {
          activeThemeId: defaultTheme.id,
          allowUserThemes: true,
          enableDarkMode: true
        },
        include: {
          activeTheme: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      themes,
      activeTheme: themeSettings.activeTheme,
      settings: {
        allowUserThemes: themeSettings.allowUserThemes,
        enableDarkMode: themeSettings.enableDarkMode
      }
    });

  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

// POST - Switch active theme (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const { themeId } = await request.json();

    if (!themeId) {
      return NextResponse.json(
        { error: 'Theme ID is required' },
        { status: 400 }
      );
    }

    // Verify theme exists and is active
    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        isActive: true
      }
    });

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found or not active' },
        { status: 404 }
      );
    }

    // Update theme settings
    let themeSettings = await prisma.themeSettings.findFirst();

    if (themeSettings) {
      themeSettings = await prisma.themeSettings.update({
        where: { id: themeSettings.id },
        data: { activeThemeId: themeId },
        include: { activeTheme: true }
      });
    } else {
      themeSettings = await prisma.themeSettings.create({
        data: {
          activeThemeId: themeId,
          allowUserThemes: true,
          enableDarkMode: true
        },
        include: { activeTheme: true }
      });
    }

    // Fetch the active theme
    const activeTheme = await prisma.theme.findUnique({
      where: { id: themeId }
    });

    return NextResponse.json({
      success: true,
      message: 'Theme switched successfully',
      activeTheme
    });

  } catch (error) {
    console.error('Error switching theme:', error);
    return NextResponse.json(
      { error: 'Failed to switch theme' },
      { status: 500 }
    );
  }
}
