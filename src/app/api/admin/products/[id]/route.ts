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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        manufacturer: true,
        images: {
          orderBy: { order: 'asc' }
        },
        variants: {
          orderBy: { createdAt: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        },
        discounts: {
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            reviews: true,
            cartItems: true,
            orderItems: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    // Calculate total sales
    const totalSales = product._count.orderItems;

    const productWithMetrics = {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      totalSales,
      inCart: product._count.cartItems,
      reviewCount: product._count.reviews,
      primaryImage: product.images.find(img => img.isPrimary) || product.images[0],
      activeDiscounts: product.discounts.filter(d => d.isActive).length
    };

    return NextResponse.json({
      success: true,
      product: productWithMetrics
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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

    const body = await request.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      comparePrice,
      costPrice,
      quantity,
      minQuantity,
      weight,
      weightUnit,
      dimensions,
      categoryId,
      brandId,
      manufacturerId,
      sku,
      barcode,
      nutritionChart,
      expiryDate,
      shelfLife,
      storageInstructions,
      ingredients,
      allergens,
      certifications,
      seoTitle,
      seoDescription,
      seoKeywords,
      isActive,
      isFeatured,
      isDigital,
      requiresShipping,
      trackInventory,
      allowBackorder,
      tags,
      images,
      variants,
      discounts
    } = body;

    const { id } = await params;
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique (excluding current product)
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Product slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update product with transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Update the product
      const product = await tx.product.update({
        where: { id },
        data: {
          name: name || existingProduct.name,
          slug: slug || existingProduct.slug,
          description: description || existingProduct.description,
          shortDescription,
          price: price ? parseFloat(price) : existingProduct.price,
          comparePrice: comparePrice !== undefined ? (comparePrice ? parseFloat(comparePrice) : null) : existingProduct.comparePrice,
          costPrice: costPrice !== undefined ? (costPrice ? parseFloat(costPrice) : null) : existingProduct.costPrice,
          quantity: quantity !== undefined ? parseInt(quantity) : existingProduct.quantity,
          minQuantity: minQuantity !== undefined ? parseInt(minQuantity) : existingProduct.minQuantity,
          weight: weight !== undefined ? (weight ? parseFloat(weight) : null) : existingProduct.weight,
          weightUnit: weightUnit || existingProduct.weightUnit,
          dimensions: dimensions !== undefined ? dimensions : existingProduct.dimensions,
          categoryId: categoryId || existingProduct.categoryId,
          brandId: brandId !== undefined ? brandId : existingProduct.brandId,
          manufacturerId: manufacturerId !== undefined ? manufacturerId : existingProduct.manufacturerId,
          sku: sku !== undefined ? sku : existingProduct.sku,
          barcode: barcode !== undefined ? barcode : existingProduct.barcode,
          nutritionChart: nutritionChart !== undefined ? nutritionChart : existingProduct.nutritionChart,
          expiryDate: expiryDate !== undefined ? (expiryDate ? new Date(expiryDate) : null) : existingProduct.expiryDate,
          shelfLife: shelfLife !== undefined ? (shelfLife ? parseInt(shelfLife) : null) : existingProduct.shelfLife,
          storageInstructions: storageInstructions !== undefined ? storageInstructions : existingProduct.storageInstructions,
          ingredients: ingredients !== undefined ? ingredients : existingProduct.ingredients,
          allergens: allergens !== undefined ? allergens : existingProduct.allergens,
          certifications: certifications !== undefined ? certifications : existingProduct.certifications,
          seoTitle: seoTitle !== undefined ? seoTitle : existingProduct.seoTitle,
          seoDescription: seoDescription !== undefined ? seoDescription : existingProduct.seoDescription,
          seoKeywords: seoKeywords !== undefined ? seoKeywords : existingProduct.seoKeywords,
          isActive: isActive !== undefined ? isActive : existingProduct.isActive,
          isFeatured: isFeatured !== undefined ? isFeatured : existingProduct.isFeatured,
          isDigital: isDigital !== undefined ? isDigital : existingProduct.isDigital,
          requiresShipping: requiresShipping !== undefined ? requiresShipping : existingProduct.requiresShipping,
          trackInventory: trackInventory !== undefined ? trackInventory : existingProduct.trackInventory,
          allowBackorder: allowBackorder !== undefined ? allowBackorder : existingProduct.allowBackorder,
          updatedAt: new Date()
        }
      });

      // Update images if provided
      if (images !== undefined) {
        // Delete existing images
        await tx.productImage.deleteMany({
          where: { productId: id }
        });

        // Add new images
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: any, index: number) => ({
              productId: id,
              url: img.url,
              alt: img.alt || product.name,
              isPrimary: index === 0,
              order: index
            }))
          });
        }
      }

      // Update tags if provided
      if (tags !== undefined) {
        // Delete existing tags
        await tx.productTag.deleteMany({
          where: { productId: id }
        });

        // Add new tags
        if (tags.length > 0) {
          const tagConnections = tags.map((tagId: string) => ({
            productId: id,
            tagId
          }));
          await tx.productTag.createMany({
            data: tagConnections
          });
        }
      }

      return product;
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        cartItems: true,
        orderItems: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product has orders (prevent deletion)
    if (product.orderItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider deactivating instead.' },
        { status: 400 }
      );
    }

    // Delete product and related data
    await prisma.$transaction(async (tx) => {
      // Delete related data first
      await tx.productTag.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.productDiscount.deleteMany({ where: { productId: id } });
      await tx.productReview.deleteMany({ where: { productId: id } });
      await tx.cartItem.deleteMany({ where: { productId: id } });

      // Delete the product
      await tx.product.delete({ where: { id: id } });
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
