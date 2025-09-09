import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status !== 'all') {
      where.isActive = status === 'active';
    }

    // Get products with relations
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        brand: true,
        manufacturer: true,
        images: {
          orderBy: { order: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        },
        discounts: {
          where: {
            isActive: true,
            AND: [
              {
                OR: [
                  { startDate: null },
                  { startDate: { lte: new Date() } }
                ]
              },
              {
                OR: [
                  { endDate: null },
                  { endDate: { gte: new Date() } }
                ]
              }
            ]
          }
        },
        variants: {
          where: { isActive: true }
        },
        _count: {
          select: {
            reviews: true,
            cartItems: true,
            orderItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Calculate additional metrics
    const productsWithMetrics = products.map(product => ({
      ...product,
      averageRating: 0, // Will be calculated from reviews
      totalSales: product._count.orderItems,
      inCart: product._count.cartItems,
      reviewCount: product._count.reviews,
      primaryImage: product.images.find(img => img.isPrimary) || product.images[0],
      activeDiscounts: product.discounts.length,
      variantCount: product.variants.length
    }));

    return NextResponse.json({
      success: true,
      products: productsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!name || !slug || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product slug already exists' },
        { status: 400 }
      );
    }

    // Create product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          name,
          slug,
          description,
          shortDescription,
          price: parseFloat(price),
          comparePrice: comparePrice ? parseFloat(comparePrice) : null,
          costPrice: costPrice ? parseFloat(costPrice) : null,
          quantity: parseInt(quantity) || 0,
          minQuantity: parseInt(minQuantity) || 1,
          weight: weight ? parseFloat(weight) : null,
          weightUnit: weightUnit || 'GRAMS',
          dimensions: dimensions || null,
          categoryId,
          brandId: brandId || null,
          manufacturerId: manufacturerId || null,
          sku: sku || null,
          barcode: barcode || null,
          nutritionChart: nutritionChart || null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          shelfLife: shelfLife ? parseInt(shelfLife) : null,
          storageInstructions: storageInstructions || null,
          ingredients: ingredients || null,
          allergens: allergens || null,
          certifications: certifications || [],
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          seoKeywords: seoKeywords || null,
          isActive: isActive !== false,
          isFeatured: isFeatured === true,
          isDigital: isDigital === true,
          requiresShipping: requiresShipping !== false,
          trackInventory: trackInventory !== false,
          allowBackorder: allowBackorder === true
        }
      });

      // Add images if provided
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, index: number) => ({
            productId: newProduct.id,
            url: img.url,
            alt: img.alt || name,
            isPrimary: index === 0,
            order: index
          }))
        });
      }

      // Add tags if provided
      if (tags && tags.length > 0) {
        const tagConnections = tags.map((tagId: string) => ({
          productId: newProduct.id,
          tagId
        }));
        await tx.productTag.createMany({
          data: tagConnections
        });
      }

      // Add variants if provided
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((variant: any) => ({
            productId: newProduct.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price ? parseFloat(variant.price) : null,
            weight: variant.weight ? parseFloat(variant.weight) : null,
            quantity: parseInt(variant.quantity) || 0,
            options: variant.options || {},
            isActive: variant.isActive !== false
          }))
        });
      }

      // Add discounts if provided
      if (discounts && discounts.length > 0) {
        await tx.productDiscount.createMany({
          data: discounts.map((discount: any) => ({
            productId: newProduct.id,
            name: discount.name,
            type: discount.type,
            value: parseFloat(discount.value),
            minQuantity: parseInt(discount.minQuantity) || 1,
            maxQuantity: discount.maxQuantity ? parseInt(discount.maxQuantity) : null,
            startDate: discount.startDate ? new Date(discount.startDate) : null,
            endDate: discount.endDate ? new Date(discount.endDate) : null,
            isActive: discount.isActive !== false
          }))
        });
      }

      return newProduct;
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
