import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ success?: string }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  
  return {
    title: `Order ${orderNumber} | Nisargalahari`,
    description: 'Order details and tracking information.'
  };
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const { orderNumber } = await params;
  const { success } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to view your order.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 gradient-bg text-white rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // Fetch order details
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.user.id
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1
              },
              category: true,
              brand: true
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      <div className="container-custom py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-green-900">Order Placed Successfully!</h3>
                <p className="text-green-700">Thank you for your order. We'll send you updates via email.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <nav className="flex text-sm text-gray-600">
                <Link href="/" className="hover:text-[#70843d] transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/orders" className="hover:text-[#70843d] transition-colors">
                  Orders
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{orderNumber}</span>
              </nav>
            </div>
            
            <Link
              href="/orders"
              className="text-[#70843d] hover:text-[#70843d]/80 font-medium transition-colors"
            >
              ← All Orders
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Order Number</h3>
                  <p className="text-lg font-semibold text-gray-900">{order.orderNumber}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Order Date</h3>
                  <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Order Status</h3>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Payment Status</h3>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Payment Method</h3>
                  <p className="text-gray-900">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Amount</h3>
                  <p className="text-lg font-bold text-gray-900">₹{Number(order.total).toFixed(2)}</p>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Order Notes</h3>
                  <p className="text-gray-900">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Items Ordered</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0">
                      <Link href={`/products/${item.product.slug}`}>
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.images[0].alt || item.product.name}
                              fill
                              className="object-cover hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>

                    <div className="flex-grow">
                      {/* Brand */}
                      {item.product.brand && (
                        <span className="inline-block bg-[#70843d]/10 text-[#70843d] px-2 py-1 rounded-full text-xs font-medium mb-2">
                          {item.product.brand.name}
                        </span>
                      )}

                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-900 mb-1">
                        <Link href={`/products/${item.product.slug}`} className="hover:text-[#70843d] transition-colors">
                          {item.product.name}
                        </Link>
                      </h3>

                      {/* Category */}
                      <p className="text-sm text-gray-600 mb-2">{item.product.category.name}</p>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-gray-600">Price: ₹{Number(item.price).toFixed(2)}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          ₹{Number(item.total).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping).toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">₹{Number(order.tax).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/products"
                className="block w-full gradient-bg text-white py-3 px-6 rounded-lg font-semibold text-center hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                Continue Shopping
              </Link>
              
              {order.status === 'PENDING' && (
                <button
                  className="w-full border-2 border-red-500 text-red-500 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel this order?')) {
                      // TODO: Implement order cancellation
                      alert('Order cancellation will be implemented soon');
                    }
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-[#70843d]/5 to-[#7bd63c]/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#70843d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@nisargalahari.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#70843d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
