import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    const featuredProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            name: true
          }
        },
        images: {
          where: { isPrimary: true },
          select: {
            url: true,
            alt: true
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
            type: true,
            value: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit
    });

    // Transform the data for frontend consumption
    const transformedProducts = featuredProducts.map(product => {
      const primaryImage = product.images[0];
      const activeDiscount = product.discounts[0];
      
      let finalPrice = Number(product.price);
      let discountPercentage = null;
      
      if (activeDiscount) {
        if (activeDiscount.type === 'PERCENTAGE') {
          discountPercentage = Number(activeDiscount.value);
          finalPrice = Number(product.price) * (1 - Number(activeDiscount.value) / 100);
        } else if (activeDiscount.type === 'FIXED_AMOUNT') {
          finalPrice = Number(product.price) - Number(activeDiscount.value);
          discountPercentage = Math.round(((Number(activeDiscount.value) / Number(product.price)) * 100));
        }
      }

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.shortDescription || product.description.substring(0, 150) + '...',
        price: Number(product.price),
        finalPrice: finalPrice,
        discountPercentage,
        image: primaryImage ? primaryImage.url : '/placeholder-image.svg',
        imageAlt: primaryImage?.alt || product.name,
        category: product.category.name,
        brand: product.brand?.name,
        inStock: product.quantity > 0,
        stockQuantity: product.quantity
      };
    });

    return NextResponse.json({
      success: true,
      featuredProducts: transformedProducts,
      count: transformedProducts.length
    });

  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
