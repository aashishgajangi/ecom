'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  maxQuantity: number;
  disabled?: boolean;
  className?: string;
  showQuantitySelector?: boolean;
}

const AddToCartButton = ({ 
  productId, 
  productName, 
  maxQuantity, 
  disabled = false,
  className = '',
  showQuantitySelector = true
}: AddToCartButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!session?.user) {
      router.push('/auth/login?redirect=' + window.location.pathname);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show success message
        alert(`${productName} added to cart successfully!`);
        
        // Dispatch custom event for cart icon update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // Reset quantity to 1
        setQuantity(1);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!session?.user) {
      router.push('/auth/login?redirect=' + window.location.pathname);
      return;
    }

    setLoading(true);
    
    try {
      // First add to cart
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity
        })
      });

      if (response.ok) {
        // Dispatch custom event for cart icon update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // Redirect to checkout
        router.push('/checkout');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error in buy now:', error);
      alert('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (disabled) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showQuantitySelector && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-lg opacity-50">
              <button className="px-3 py-2" disabled>-</button>
              <span className="px-4 py-2 border-x border-gray-300">1</span>
              <button className="px-3 py-2" disabled>+</button>
            </div>
          </div>
        )}
        
        <button 
          className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
          disabled
        >
          Out of Stock
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showQuantitySelector && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={loading || quantity <= 1}
              className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              -
            </button>
            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={loading || quantity >= maxQuantity}
              className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              +
            </button>
          </div>
          
          <span className="text-sm text-gray-600">
            {maxQuantity} available
          </span>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={handleAddToCart}
          disabled={loading || maxQuantity === 0}
          className="flex-1 btn-primary shadow-lg disabled:opacity-50 disabled:transform-none"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
        
        <button 
          onClick={handleBuyNow}
          disabled={loading || maxQuantity === 0}
          className="flex-1 btn-secondary disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

export default AddToCartButton;
