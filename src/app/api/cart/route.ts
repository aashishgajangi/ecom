import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            },
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
              }
            }
          }
        }
      }
    });

    // Calculate totals and add discount info
    let subtotal = 0;
    const processedItems = cartItems.map(item => {
      const activeDiscount = item.product.discounts[0];
      const discountedPrice = activeDiscount 
        ? activeDiscount.type === 'PERCENTAGE'
          ? Number(item.product.price) * (1 - Number(activeDiscount.value) / 100)
          : Number(item.product.price) - Number(activeDiscount.value)
        : null;
      
      const itemPrice = discountedPrice || Number(item.product.price);
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      return {
        ...item,
        product: {
          ...item.product,
          discountedPrice,
          itemPrice,
          primaryImage: item.product.images[0] || null
        },
        itemTotal
      };
    });

    const shipping = subtotal >= 500 ? 0 : 50; // Free shipping over ₹500
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return NextResponse.json({
      success: true,
      cart: {
        items: processedItems,
        summary: {
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: Number(subtotal.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          total: Number(total.toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        isActive: true 
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.quantity < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock for requested quantity' },
          { status: 400 }
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        },
        data: {
          quantity: newQuantity
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Cart updated successfully',
        cartItem: updatedItem
      });
    } else {
      // Create new cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Item added to cart',
        cartItem
      });
    }

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid product ID and quantity are required' },
        { status: 400 }
      );
    }

    // Check product stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      },
      data: {
        quantity
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      cartItem: updatedItem
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart'
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
