import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get specific page with all fields
    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });

  } catch (error) {
    console.error('Get page error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
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

    // Check if slug already exists for another page
    const existingPage = await prisma.page.findFirst({
      where: {
        slug,
        id: { not: id }
      }
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
        where: { 
          isHomepage: true,
          id: { not: id }
        },
        data: { isHomepage: false }
      });
    }

    // Update page with all fields
    const page = await prisma.page.update({
      where: { id },
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
      message: 'Page updated successfully'
    });

  } catch (error) {
    console.error('Update page error:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Delete page
    await prisma.page.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    });

  } catch (error) {
    console.error('Delete page error:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
