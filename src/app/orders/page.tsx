'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  total: string;
  product: {
    id: string;
    name: string;
    slug: string;
    primaryImage?: {
      url: string;
      alt?: string;
    };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/orders');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router, page, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (selectedStatus) {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-[#70843d] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Orders</span>
          </nav>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Filter by status:
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70843d] focus:border-transparent"
              >
                <option value="">All Orders</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 gradient-bg text-white rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus ? 'No orders with the selected status.' : "You haven't placed any orders yet."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 gradient-bg text-white rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{Number(order.total).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>
                        
                        <Link
                          href={`/orders/${order.orderNumber}`}
                          className="inline-flex items-center px-4 py-2 border-2 border-[#70843d] text-[#70843d] rounded-lg font-medium hover:bg-[#70843d]/10 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <Link href={`/products/${item.product.slug}`}>
                              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                {item.product.primaryImage ? (
                                  <Image
                                    src={item.product.primaryImage.url}
                                    alt={item.product.primaryImage.alt || item.product.name}
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </Link>
                          </div>

                          <div className="flex-grow">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                              <Link href={`/products/${item.product.slug}`} className="hover:text-[#70843d] transition-colors">
                                {item.product.name}
                              </Link>
                            </h4>
                            <div className="text-xs text-gray-600 mt-1">
                              <span>Qty: {item.quantity}</span>
                              <span className="ml-2">₹{Number(item.price).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.items.length > 3 && (
                      <div className="mt-4 text-center">
                        <Link
                          href={`/orders/${order.orderNumber}`}
                          className="text-[#70843d] hover:text-[#70843d]/80 text-sm font-medium transition-colors"
                        >
                          View all {order.items.length} items
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        pageNum === page
                          ? 'gradient-bg text-white border-[#70843d]'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
