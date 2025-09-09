import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tag
    });

  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, color, isActive } = body;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current tag)
    if (slug && slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Tag slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name: name || existingTag.name,
        slug: slug || existingTag.slug,
        description: description !== undefined ? description : existingTag.description,
        color: color !== undefined ? color : existingTag.color,
        isActive: isActive !== undefined ? isActive : existingTag.isActive,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      tag: updatedTag,
      message: 'Tag updated successfully'
    });

  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Check if tag exists and has products
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        products: true
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Delete tag relationships and the tag itself
    await prisma.$transaction(async (tx) => {
      // Remove tag from all products
      await tx.productTag.deleteMany({
        where: { tagId: id }
      });

      // Delete the tag
      await tx.tag.delete({
        where: { id }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
