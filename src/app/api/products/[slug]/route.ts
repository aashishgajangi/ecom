import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch product by slug with all related data
    const product = await prisma.product.findUnique({
      where: { 
        slug,
        isActive: true 
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          }
        },
        manufacturer: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            url: true,
            alt: true,
            isPrimary: true,
            order: true
          }
        },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            name: true,
            options: true,
            price: true,
            sku: true,
            quantity: true,
            isActive: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        },
        discounts: {
          where: {
            isActive: true,
            OR: [
              { startDate: null },
              { startDate: { lte: new Date() } }
            ],
            AND: [
              {
                OR: [
                  { endDate: null },
                  { endDate: { gte: new Date() } }
                ]
              }
            ]
          },
          select: {
            id: true,
            name: true,
            type: true,
            value: true,
            startDate: true,
            endDate: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
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
        { 
          success: false,
          error: 'Product not found' 
        },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    // Calculate discount price if applicable
    const activeDiscount = product.discounts[0];
    const discountedPrice = activeDiscount 
      ? activeDiscount.type === 'PERCENTAGE'
        ? Number(product.price) * (1 - Number(activeDiscount.value) / 100)
        : Number(product.price) - Number(activeDiscount.value)
      : null;

    // Get primary and other images
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
    const otherImages = product.images.filter(img => !img.isPrimary);

    // Calculate total sales
    const totalSales = product._count.orderItems;

    // Calculate stock status
    const stockStatus = product.quantity > 0 ? 'in_stock' : 'out_of_stock';
    const lowStock = product.quantity <= 5 && product.quantity > 0;

    const productData = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      totalSales,
      discountedPrice,
      primaryImage,
      otherImages,
      stockStatus,
      lowStock,
      hasActiveDiscount: !!activeDiscount,
      reviewCount: product._count.reviews,
      cartCount: product._count.cartItems
    };

    return NextResponse.json({
      success: true,
      product: productData
    });

  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Export function to get similar/related products
async function getRelatedProducts(categoryId: string, excludeId: string, limit: number = 4) {
  try {
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        id: { not: excludeId }
      },
      include: {
        images: {
          where: { isPrimary: true },
          select: {
            url: true,
            alt: true
          }
        },
        brand: {
          select: {
            name: true
          }
        },
        discounts: {
          where: {
            isActive: true,
            OR: [
              { startDate: null },
              { startDate: { lte: new Date() } }
            ],
            AND: [
              {
                OR: [
                  { endDate: null },
                  { endDate: { gte: new Date() } }
                ]
              }
            ]
          },
          select: {
            id: true,
            name: true,
            type: true,
            value: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return relatedProducts.map(product => ({
      ...product,
      primaryImage: product.images[0] || null,
      totalSales: product._count.orderItems,
      reviewCount: product._count.reviews,
      hasDiscount: product.discounts.length > 0
    }));

  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
