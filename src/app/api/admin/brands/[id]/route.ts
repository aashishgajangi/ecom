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
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brand
    });

  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
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
    const { name, slug, description, logo, website, isActive } = body;

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id }
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current brand)
    if (slug && slug !== existingBrand.slug) {
      const slugExists = await prisma.brand.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Brand slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        name: name || existingBrand.name,
        slug: slug || existingBrand.slug,
        description: description !== undefined ? description : existingBrand.description,
        logo: logo !== undefined ? logo : existingBrand.logo,
        website: website !== undefined ? website : existingBrand.website,
        isActive: isActive !== undefined ? isActive : existingBrand.isActive,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      brand: updatedBrand,
      message: 'Brand updated successfully'
    });

  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
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
    // Check if brand exists and has products
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        products: true
      }
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Check if brand has products
    if (brand.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete brand with existing products. Remove products from this brand first.' },
        { status: 400 }
      );
    }

    // Delete the brand
    await prisma.brand.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
