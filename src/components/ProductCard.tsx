'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  shortDescription?: string;
  isFeatured: boolean;
  quantity: number;
  category: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
  };
  primaryImage?: {
    url: string;
    alt?: string;
  };
  averageRating: number;
  totalSales: number;
  reviewCount: number;
  hasDiscount: boolean;
  discountedPrice?: number;
  className?: string;
}

const ProductCard = ({ 
  name, 
  slug, 
  price, 
  comparePrice,
  shortDescription,
  isFeatured,
  quantity,
  category,
  brand,
  primaryImage,
  averageRating,
  totalSales,
  reviewCount,
  hasDiscount,
  discountedPrice,
  className = ""
}: ProductCardProps) => {
  return (
    <Link
      href={`/products/${slug}`}
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Product Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              SALE
            </span>
          )}
          {isFeatured && (
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Stock Status */}
        {quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        {brand && (
          <div className="flex items-center">
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'var(--color-primary-50, rgba(112, 132, 61, 0.1))',
                color: 'var(--color-primary-600, #70843d)'
              }}
            >
              {brand.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 
          className="font-semibold text-gray-900 transition-colors line-clamp-2"
          style={{'--hover-color': 'var(--color-primary-600, #70843d)'} as any}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-primary-600, #70843d)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#111827'; // text-gray-900
          }}
        >
          {name}
        </h3>

        {/* Short Description */}
        {shortDescription && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {shortDescription}
          </p>
        )}

        {/* Rating & Reviews */}
        {reviewCount > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{discountedPrice ? discountedPrice.toFixed(2) : price.toString()}
          </span>
          {discountedPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{price.toString()}
            </span>
          )}
          {comparePrice && comparePrice > price && (
            <span className="text-xs text-gray-400">
              Compare ₹{comparePrice.toString()}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="text-sm text-gray-600">
          {category.name}
        </div>

        {/* Sales Info */}
        {totalSales > 0 && (
          <div className="text-xs text-[#70843d] font-medium">
            {totalSales} sold
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
