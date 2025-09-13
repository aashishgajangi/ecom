import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DEFAULT_TYPOGRAPHY, DEFAULT_SPACING, DEFAULT_BORDERS } from '@/types/theme';

// POST - Import theme(s) (admin)
export async function POST(request: NextRequest) {
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

    const { 
      themes, 
      overwriteExisting = false,
      skipInvalid = true 
    } = await request.json();

    if (!themes || !Array.isArray(themes)) {
      return NextResponse.json(
        { error: 'Invalid import data. Expected array of themes.' },
        { status: 400 }
      );
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: [] as string[]
    };

    for (const themeData of themes) {
      try {
        // Validate required fields
        if (!themeData.name || !themeData.slug || !themeData.colorScheme) {
          if (skipInvalid) {
            results.skipped++;
            results.errors.push(`Skipped theme: Missing required fields (name, slug, colorScheme)`);
            continue;
          } else {
            return NextResponse.json(
              { error: `Invalid theme data: Missing required fields for theme "${themeData.name || 'Unknown'}"` },
              { status: 400 }
            );
          }
        }

        // Check if theme with slug already exists
        const existingTheme = await prisma.theme.findUnique({
          where: { slug: themeData.slug }
        });

        if (existingTheme) {
          if (overwriteExisting) {
            // Update existing theme
            await prisma.theme.update({
              where: { slug: themeData.slug },
              data: {
                name: themeData.name,
                description: themeData.description,
                colorScheme: themeData.colorScheme,
            typography: (themeData.typography || DEFAULT_TYPOGRAPHY) as any,
            spacing: (themeData.spacing || DEFAULT_SPACING) as any,
            borders: (themeData.borders || DEFAULT_BORDERS) as any,
                version: themeData.version || '1.0.0',
                tags: themeData.tags || [],
                preview: themeData.preview,
                isActive: true,
                isSystem: false // Imported themes are never system themes
              }
            });
            results.imported++;
          } else {
            results.skipped++;
            results.errors.push(`Skipped theme "${themeData.name}": Theme with slug "${themeData.slug}" already exists`);
          }
        } else {
          // Create new theme
          await prisma.theme.create({
            data: {
              name: themeData.name,
              slug: themeData.slug,
              description: themeData.description,
              colorScheme: themeData.colorScheme,
              typography: (themeData.typography || DEFAULT_TYPOGRAPHY) as any,
              spacing: (themeData.spacing || DEFAULT_SPACING) as any,
              borders: (themeData.borders || DEFAULT_BORDERS) as any,
              version: themeData.version || '1.0.0',
              tags: themeData.tags || [],
              preview: themeData.preview,
              isActive: true,
              isDefault: false,
              isSystem: false,
              createdBy: (session.user as any).id
            }
          });
          results.imported++;
        }

      } catch (error) {
        if (skipInvalid) {
          results.skipped++;
          results.errors.push(`Error importing theme "${themeData.name || 'Unknown'}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        } else {
          throw error;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.imported} themes imported, ${results.skipped} skipped.`,
      results
    });

  } catch (error) {
    console.error('Error importing themes:', error);
    return NextResponse.json(
      { error: 'Failed to import themes' },
      { status: 500 }
    );
  }
}
