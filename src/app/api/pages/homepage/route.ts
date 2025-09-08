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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      metadata,
      metaTitle,
      metaDescription,
      metaKeywords,
      focusKeyword,
      ogTitle,
      ogDescription,
      ogImage,
      isPublished = true,
      slug = 'homepage'
    } = body;

    // First, remove homepage flag from any existing homepage
    await prisma.page.updateMany({
      where: { isHomepage: true },
      data: { isHomepage: false }
    });

    // Create or update the homepage
    const existingHomepage = await prisma.page.findFirst({
      where: { slug: 'homepage' }
    });

    let homepage;
    if (existingHomepage) {
      homepage = await prisma.page.update({
        where: { id: existingHomepage.id },
        data: {
          title,
          content,
          slug,
          isPublished,
          isHomepage: true,
          template: 'homepage',
          metadata,
          metaTitle,
          metaDescription,
          metaKeywords,
          focusKeyword,
          ogTitle,
          ogDescription,
          ogImage,
          updatedAt: new Date()
        }
      });
    } else {
      homepage = await prisma.page.create({
        data: {
          title,
          content,
          slug,
          isPublished,
          isHomepage: true,
          template: 'homepage',
          metadata,
          metaTitle,
          metaDescription,
          metaKeywords,
          focusKeyword,
          ogTitle,
          ogDescription,
          ogImage
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      page: homepage,
      message: 'Homepage updated successfully'
    });

  } catch (error) {
    console.error('Save homepage error:', error);
    return NextResponse.json(
      { error: 'Failed to save homepage' },
      { status: 500 }
    );
  }
}
