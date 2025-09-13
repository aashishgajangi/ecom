import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single theme (admin)
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    const theme = await prisma.theme.findUnique({
      where: { id },
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

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      theme
    });

  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}

// PUT - Update theme (admin)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    // Check if theme exists
    const existingTheme = await prisma.theme.findUnique({
      where: { id }
    });

    if (!existingTheme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    const {
      name,
      slug,
      description,
      colorScheme,
      typography,
      spacing,
      borders,
      isActive,
      isDefault,
      tags,
      preview
    } = await request.json();

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== existingTheme.slug) {
      const slugConflict = await prisma.theme.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Theme with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // If setting as default, unset any existing default
    if (isDefault && !existingTheme.isDefault) {
      await prisma.theme.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    // Update theme
    const updatedTheme = await prisma.theme.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(colorScheme && { colorScheme }),
        ...(typography && { typography }),
        ...(spacing && { spacing }),
        ...(borders && { borders }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
        ...(tags && { tags }),
        ...(preview !== undefined && { preview })
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

    // If this theme was set as default and active, update theme settings
    if (isDefault) {
      const themeSettings = await prisma.themeSettings.findFirst();
      
      if (themeSettings) {
        await prisma.themeSettings.update({
          where: { id: themeSettings.id },
          data: { activeThemeId: id }
        });
      } else {
        await prisma.themeSettings.create({
          data: {
            activeThemeId: id,
            allowUserThemes: true,
            enableDarkMode: true
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      theme: updatedTheme,
      message: 'Theme updated successfully'
    });

  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

// DELETE - Delete theme (admin)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    // Check if theme exists
    const theme = await prisma.theme.findUnique({
      where: { id }
    });

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Cannot delete system themes
    if (theme.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system themes' },
        { status: 400 }
      );
    }

    // If this is the active theme, switch to default first
    const themeSettings = await prisma.themeSettings.findFirst();
    if (themeSettings?.activeThemeId === id) {
      const defaultTheme = await prisma.theme.findFirst({
        where: { isDefault: true }
      });

      if (defaultTheme) {
        await prisma.themeSettings.update({
          where: { id: themeSettings.id },
          data: { activeThemeId: defaultTheme.id }
        });
      }
    }

    // Delete theme
    await prisma.theme.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Theme deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}
