'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  quantity: number;
  itemTotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    discountedPrice?: number;
    itemPrice: number;
    quantity: number;
    shortDescription?: string;
    primaryImage?: {
      url: string;
      alt?: string;
    };
    category: {
      name: string;
      slug: string;
    };
    brand?: {
      name: string;
    };
  };
}

interface CartSummary {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CartData {
  items: CartItem[];
  summary: CartSummary;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/cart');
      return;
    }

    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(productId);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        })
      });

      if (response.ok) {
        await fetchCart();
        // Dispatch custom event for cart icon update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCart();
        // Dispatch custom event for cart icon update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCart();
        // Dispatch custom event for cart icon update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        alert('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
        <div className="container-custom py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 gradient-bg text-white rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
                  updatingItems.has(item.product.id) ? 'opacity-50' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Link href={`/products/${item.product.slug}`}>
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product.primaryImage ? (
                          <Image
                            src={item.product.primaryImage.url}
                            alt={item.product.primaryImage.alt || item.product.name}
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

                  {/* Product Details */}
                  <div className="flex-grow space-y-2">
                    {/* Brand */}
                    {item.product.brand && (
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--color-primary-50, rgba(112, 132, 61, 0.1))',
                          color: 'var(--ui-interactive-hover, #70843d)'
                        }}
                      >
                        {item.product.brand.name}
                      </span>
                    )}

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900">
                      <Link href={`/products/${item.product.slug}`} className="interactive-hover transition-colors">
                        {item.product.name}
                      </Link>
                    </h3>

                    {/* Category */}
                    <p className="text-sm text-gray-600">{item.product.category.name}</p>

                    {/* Price */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{item.product.itemPrice.toFixed(2)}
                      </span>
                      {item.product.discountedPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.product.price}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-2">
                      {item.product.quantity > 0 ? (
                        <>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--ui-status-inStock, #22c55e)' }}></div>
                          <span className="text-sm status-in-stock">In Stock</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--ui-status-outOfStock, #ef4444)' }}></div>
                          <span className="text-sm status-out-of-stock">Out of Stock</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col justify-between items-end space-y-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.product.id)}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.product.id) || item.quantity >= item.product.quantity}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{item.itemTotal.toFixed(2)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      disabled={updatingItems.has(item.product.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cart.summary.itemCount})</span>
                  <span className="font-medium">₹{cart.summary.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.summary.shipping === 0 ? 'Free' : `₹${cart.summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">₹{cart.summary.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{cart.summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {cart.summary.shipping === 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">
                    🎉 You qualify for free shipping!
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full gradient-bg text-white py-3 px-6 rounded-lg font-semibold text-center hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/products"
                  className="block w-full btn-secondary text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Shipping Info */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(112, 132, 61, 0.05) 0%, rgba(123, 214, 60, 0.1) 100%)'
              }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping & Returns</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ui-interactive-hover, #70843d)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Free shipping on orders over ₹500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ui-interactive-hover, #70843d)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ui-interactive-hover, #70843d)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Same-day delivery available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
