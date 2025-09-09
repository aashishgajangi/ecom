import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const brandId = searchParams.get('brandId') || '';
    const sortBy = searchParams.get('sortBy') || 'featured';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const featured = searchParams.get('featured') === 'true';
    
    console.log('Products API called with params:', {
      page, limit, search, categoryId, brandId, sortBy, minPrice, maxPrice, featured
    });

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true
    };
    
    // Only add price filters if they're reasonable values
    if (minPrice > 0 || maxPrice < 999999) {
      where.price = {};
      if (minPrice > 0) where.price.gte = minPrice;
      if (maxPrice < 999999) where.price.lte = maxPrice;
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Add brand filter
    if (brandId) {
      where.brandId = brandId;
    }

    // Add featured filter
    if (featured) {
      where.isFeatured = true;
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'popular':
        orderBy = { createdAt: 'desc' }; // We'll sort by popularity in the application layer
        break;
      case 'rating':
        // We'll sort by average rating in the application layer
        orderBy = { createdAt: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ];
        break;
    }

    // Get products with relations
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          where: { isPrimary: true },
          select: {
            id: true,
            url: true,
            alt: true,
            isPrimary: true
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
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true,
            cartItems: true
          }
        }
      },
      orderBy
    });

    // Get total count for pagination
    const total = await prisma.product.count({ where });
    
    console.log(`Found ${products.length} products out of ${total} total`);

    // Calculate additional metrics for each product
    const productsWithMetrics = products.map(product => {
      // Calculate average rating
      const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

      // Calculate discount price
      const activeDiscount = product.discounts[0];
      const productPrice = Number(product.price);
      const discountedPrice = activeDiscount 
        ? activeDiscount.type === 'PERCENTAGE'
          ? productPrice * (1 - Number(activeDiscount.value) / 100)
          : productPrice - Number(activeDiscount.value)
        : null;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        shortDescription: product.shortDescription,
        isFeatured: product.isFeatured,
        quantity: product.quantity,
        category: product.category,
        brand: product.brand,
        primaryImage: product.images[0] || null,
        averageRating: Math.round(averageRating * 10) / 10,
        totalSales: product._count.orderItems,
        reviewCount: product._count.reviews,
        cartCount: product._count.cartItems,
        hasDiscount: product.discounts.length > 0,
        discountedPrice: discountedPrice ? Math.round(discountedPrice * 100) / 100 : null,
        stockStatus: product.quantity > 0 ? 'in_stock' : 'out_of_stock',
        lowStock: product.quantity <= 5 && product.quantity > 0
      };
    });

    // Sort by rating or popularity if requested (since we can't do this in the database efficiently)
    if (sortBy === 'rating') {
      productsWithMetrics.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'popular') {
      productsWithMetrics.sort((a, b) => b.totalSales - a.totalSales);
    }

    return NextResponse.json({
      success: true,
      products: productsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        search,
        categoryId,
        brandId,
        sortBy,
        minPrice,
        maxPrice,
        featured
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to get featured products
async function getFeaturedProducts(limit: number = 4) {
  try {
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

    return featuredProducts.map(product => ({
      ...product,
      primaryImage: product.images[0] || null,
      totalSales: product._count.orderItems,
      reviewCount: product._count.reviews,
      hasDiscount: product.discounts.length > 0
    }));

  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
