import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Get all pages
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ pages });

  } catch (error) {
    console.error('Get pages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

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
      slug, 
      title, 
      content, 
      isPublished, 
      isHomepage, 
      template,
      metaTitle,
      metaDescription,
      metaKeywords,
      focusKeyword,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage
    } = await request.json();

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'Page with this slug already exists' },
        { status: 400 }
      );
    }

    // If setting as homepage, unset any existing homepage
    if (isHomepage) {
      await prisma.page.updateMany({
        where: { isHomepage: true },
        data: { isHomepage: false }
      });
    }

    // Create new page
    const page = await prisma.page.create({
      data: {
        slug,
        title,
        content: content || '',
        isPublished: isPublished || false,
        isHomepage: isHomepage || false,
        template: template || 'default',
        metaTitle: metaTitle || '',
        metaDescription: metaDescription || '',
        metaKeywords: metaKeywords || '',
        focusKeyword: focusKeyword || '',
        canonicalUrl: canonicalUrl || '',
        ogTitle: ogTitle || '',
        ogDescription: ogDescription || '',
        ogImage: ogImage || '',
        twitterTitle: twitterTitle || '',
        twitterDescription: twitterDescription || '',
        twitterImage: twitterImage || ''
      }
    });

    return NextResponse.json({
      success: true,
      page,
      message: 'Page created successfully'
    });

  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
