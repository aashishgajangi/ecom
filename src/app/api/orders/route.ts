import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      shippingAddress,
      paymentMethod = 'COD',
      notes 
    } = await request.json();

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      return NextResponse.json(
        { error: 'Complete shipping address is required' },
        { status: 400 }
      );
    }

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          include: {
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

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Check stock availability and calculate totals
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      price: number;
      quantity: number;
      total: number;
    }> = [];

    for (const cartItem of cartItems) {
      const product = cartItem.product;
      
      // Check stock
      if (product.quantity < cartItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      // Calculate price with discount
      const activeDiscount = product.discounts[0];
      const discountedPrice = activeDiscount 
        ? activeDiscount.type === 'PERCENTAGE'
          ? Number(product.price) * (1 - Number(activeDiscount.value) / 100)
          : Number(product.price) - Number(activeDiscount.value)
        : Number(product.price);

      const itemTotal = discountedPrice * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        price: discountedPrice,
        quantity: cartItem.quantity,
        total: itemTotal
      });
    }

    // Calculate totals
    const shipping = subtotal >= 500 ? 0 : 50; // Free shipping over ₹500
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          orderNumber,
          status: 'PENDING',
          total,
          subtotal,
          tax,
          shipping,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          notes
        }
      });

      // Create order items
      for (const item of orderItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            total: item.total
          }
        });

        // Update product quantity
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: {
          userId: session.user.id
        }
      });

      // Create/update shipping address
      await tx.address.create({
        data: {
          userId: session.user.id,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          isDefault: true
        }
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Fetch user orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.user.id
    };

    if (status) {
      where.status = status;
    }

    // Get orders with items
    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isPrimary: true },
                  take: 1
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get total count
    const total = await prisma.order.count({ where });

    // Process orders for frontend
    const processedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          primaryImage: item.product.images[0] || null
        }
      }))
    }));

    return NextResponse.json({
      success: true,
      orders: processedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
