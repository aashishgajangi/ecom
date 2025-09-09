import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    
    console.log('Simple products API called with params:', { page, limit, search });
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Simple query with minimal relations
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
        images: {
          where: { isPrimary: true },
          select: {
            id: true,
            url: true,
            alt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Get total count for pagination
    const total = await prisma.product.count({ where });
    
    console.log(`Found ${products.length} products out of ${total} total`);

    const simpleProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      quantity: product.quantity,
      category: product.category,
      primaryImage: product.images[0] || null,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      averageRating: 0,
      totalSales: 0,
      reviewCount: 0,
      hasDiscount: false,
      discountedPrice: null
    }));

    return NextResponse.json({
      success: true,
      products: simpleProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Simple products API error:', error);
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
