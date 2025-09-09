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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: {
          include: {
            _count: {
              select: { products: true }
            }
          },
          orderBy: { order: 'asc' }
        },
        parentCategory: true,
        _count: {
          select: {
            products: true,
            subcategories: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
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
    const {
      name,
      slug,
      description,
      image,
      icon,
      parentId,
      seoTitle,
      seoDescription,
      isActive,
      order
    } = body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current category)
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Category slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prevent circular parent relationship
    if (parentId) {
      const wouldCreateCycle = await checkCyclicRelationship(id, parentId);
      if (wouldCreateCycle) {
        return NextResponse.json(
          { error: 'Cannot set parent category as it would create a circular relationship' },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        slug: slug || existingCategory.slug,
        description: description !== undefined ? description : existingCategory.description,
        image: image !== undefined ? image : existingCategory.image,
        icon: icon !== undefined ? icon : existingCategory.icon,
        parentId: parentId !== undefined ? (parentId || null) : existingCategory.parentId,
        seoTitle: seoTitle !== undefined ? seoTitle : existingCategory.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existingCategory.seoDescription,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive,
        order: order !== undefined ? order : existingCategory.order,
        updatedAt: new Date()
      },
      include: {
        parentCategory: true,
        _count: {
          select: {
            products: true,
            subcategories: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
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
    // Check if category exists and get its data
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        subcategories: true
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has products
    if (category.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products. Move or delete products first.' },
        { status: 400 }
      );
    }

    // Check if category has subcategories
    if (category.subcategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Delete subcategories first.' },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

// Helper function to check for circular parent relationships
async function checkCyclicRelationship(categoryId: string, parentId: string): Promise<boolean> {
  if (categoryId === parentId) {
    return true;
  }

  const parent = await prisma.category.findUnique({
    where: { id: parentId },
    select: { parentId: true }
  });

  if (!parent?.parentId) {
    return false;
  }

  return checkCyclicRelationship(categoryId, parent.parentId);
}
