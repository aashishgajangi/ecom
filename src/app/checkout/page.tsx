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
    primaryImage?: {
      url: string;
      alt?: string;
    };
    category: {
      name: string;
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

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/checkout');
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
        if (data.cart.items.length === 0) {
          router.push('/cart');
          return;
        }
        setCart(data.cart);
      } else {
        console.error('Failed to fetch cart');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setPlacing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
          notes: notes.trim() || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Dispatch custom event for cart icon update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // Redirect to order confirmation
        router.push(`/orders/${data.order.orderNumber}?success=true`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || !cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <nav className="flex text-sm text-gray-600">
            <Link href="/cart" className="interactive-hover transition-colors">
              Cart
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <textarea
                    id="street"
                    name="street"
                    rows={2}
                    required
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70843d] focus:border-transparent"
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70843d] focus:border-transparent"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70843d] focus:border-transparent"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    required
                    value={shippingAddress.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70843d] focus:border-transparent"
                    placeholder="ZIP Code"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70843d] focus:border-transparent"
                  >
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="cod"
                    name="payment"
                    type="radio"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 border-gray-300 form-input"
                  />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery (COD)
                  </label>
                </div>

                <div className="flex items-center opacity-50">
                  <input
                    id="online"
                    name="payment"
                    type="radio"
                    value="ONLINE"
                    disabled
                    className="h-4 w-4 border-gray-300 form-input"
                  />
                  <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-500">
                    Online Payment (Coming Soon)
                  </label>
                </div>
              </div>

              {paymentMethod === 'COD' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    💰 You will pay cash when your order is delivered to your address.
                  </p>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Notes (Optional)</h2>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70843d] focus:border-transparent"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product.primaryImage ? (
                          <Image
                            src={item.product.primaryImage.url}
                            alt={item.product.primaryImage.alt || item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 text-sm">{item.product.name}</h3>
                      <p className="text-xs text-gray-600">{item.product.category.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-medium text-gray-900">₹{item.itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.summary.itemCount} items)</span>
                  <span className="font-medium">₹{cart.summary.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.summary.shipping === 0 ? 'Free' : `₹${cart.summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
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
            </div>

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full gradient-bg text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>

            {/* Security Info */}
            <div 
              className="rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(112, 132, 61, 0.05) 0%, rgba(123, 214, 60, 0.1) 100%)'
              }}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ui-interactive-hover, #70843d)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
