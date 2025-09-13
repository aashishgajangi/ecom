'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface CartIconProps {
  className?: string;
}

const CartIcon = ({ className = '' }: CartIconProps) => {
  const { data: session } = useSession();
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchCartCount();
    } else {
      setItemCount(0);
    }
  }, [session]);

  const fetchCartCount = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setItemCount(data.cart.summary.itemCount || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart count when items are added/removed
  useEffect(() => {
    const handleCartUpdate = () => {
      if (session?.user) {
        fetchCartCount();
      }
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [session]);

  if (!session?.user) {
    return (
      <Link href="/auth/login" className={`relative ${className}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      </Link>
    );
  }

  return (
    <Link href="/cart" className={`relative ${className}`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      
      {itemCount > 0 && (
        <span 
          className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          style={{ backgroundColor: 'var(--ui-badge-sale, #ef4444)' }}
        >
          {loading ? '...' : itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
