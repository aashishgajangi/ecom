'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FeaturedProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  finalPrice: number;
  discountPercentage: number | null;
  image: string;
  imageAlt: string;
  category: string;
  brand?: string;
  inStock: boolean;
  stockQuantity: number;
}

interface FeaturedProductProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  productLink?: string;
  ctaText?: string;
  useDynamicProducts?: boolean;
}

const FeaturedProduct = ({
  title = "Our Featured Product",
  description = "Experience the aroma and taste of our premium products, beneficial for the health of the entire family.",
  imageUrl = "/uploads/2b450e54-44d9-4180-ab83-ddcab7320e32.jpeg",
  productLink = "/products",
  ctaText = "View Product",
  useDynamicProducts = true
}: FeaturedProductProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useDynamicProducts) {
      fetchFeaturedProducts();
    }
  }, [useDynamicProducts]);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/featured?limit=1');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.featuredProducts.length > 0) {
          setFeaturedProducts(data.featuredProducts);
        }
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  // If using dynamic products and we have featured products, show the first one
  if (useDynamicProducts && featuredProducts.length > 0) {
    const product = featuredProducts[0];
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#70843d]/10 to-[#7bd63c]/10">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Featured Product
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Discover our handpicked premium product with exceptional quality and value.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative p-6 md:p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                  <div className="relative group">
                    <div className="relative overflow-hidden transform transition-all duration-300 group-hover:scale-105">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        width={350}
                        height={420}
                        className="w-full h-auto object-contain max-w-[280px] md:max-w-[350px] transition-all duration-700 group-hover:scale-105 drop-shadow-2xl filter brightness-110 contrast-110"
                        priority
                      />
                    </div>
                    
                    {/* Discount Badge */}
                    {product.discountPercentage && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{product.discountPercentage}%
                      </div>
                    )}
                    
                    {/* Enhanced Glow Effect - Hidden on Mobile */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#70843d]/20 to-[#7bd63c]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-150 hidden md:block"></div>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="space-y-4 md:space-y-6">
                    {/* Category & Brand */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-[#70843d]/10 text-[#70843d] rounded-full font-medium">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                          {product.brand}
                        </span>
                      )}
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl md:text-3xl font-bold text-[#70843d]">
                        ₹{product.finalPrice.toFixed(2)}
                      </span>
                      {product.discountPercentage && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                        {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
                      </span>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="pt-2">
                      <Link 
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#70843d] to-[#7bd63c] hover:from-[#7bd63c] hover:to-[#70843d] text-white font-semibold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        View Product Details
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state when fetching dynamic products
  if (useDynamicProducts && loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#70843d]/10 to-[#7bd63c]/10">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Featured Product
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Loading our featured product...
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-6 md:p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                  <div className="w-[280px] h-[336px] bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to static content if no dynamic products or useDynamicProducts is false
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#70843d]/10 to-[#7bd63c]/10">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            {description}
          </p>
        </div>
        
        {/* Centered Product Image with Website's Style */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Main Product Image Container */}
            <div className="relative overflow-hidden transform transition-all duration-300 group-hover:scale-105">
              <Image
                src={imageUrl}
                alt="Featured Product"
                width={400}
                height={480}
                className="w-full h-auto object-contain max-w-[280px] md:max-w-[350px] lg:max-w-[400px] transition-all duration-700 group-hover:scale-105 drop-shadow-2xl filter brightness-110 contrast-110"
                priority
              />
            </div>
            
            {/* Enhanced Glow Effect - Hidden on Mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#70843d]/20 to-[#7bd63c]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-150 hidden md:block"></div>
            
            {/* Floating Design Elements - Hidden on Mobile */}
            <div className="absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-r from-[#70843d]/60 to-[#7bd63c]/60 rounded-full animate-pulse hidden md:block"></div>
            <div className="absolute -bottom-4 -right-4 w-5 h-5 bg-gradient-to-r from-[#7bd63c]/60 to-[#70843d]/60 rounded-full animate-pulse delay-1000 hidden md:block"></div>
            <div className="absolute top-1/2 -left-6 w-3 h-3 bg-gradient-to-r from-[#70843d]/40 to-[#7bd63c]/40 rounded-full animate-pulse delay-500 hidden md:block"></div>
            <div className="absolute top-1/2 -right-6 w-4 h-4 bg-gradient-to-r from-[#7bd63c]/40 to-[#70843d]/40 rounded-full animate-pulse delay-1500 hidden md:block"></div>
            
            {/* Corner Accents - Hidden on Mobile */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#70843d]/30 rounded-tl-lg hidden md:block"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#7bd63c]/30 rounded-tr-lg hidden md:block"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#70843d]/30 rounded-bl-lg hidden md:block"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#7bd63c]/30 rounded-br-lg hidden md:block"></div>
          </div>
        </div>
        
        {/* Call to Action Button */}
        <div className="text-center mt-6 md:mt-8">
          <Link 
            href={productLink}
            className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#70843d] to-[#7bd63c] hover:from-[#7bd63c] hover:to-[#70843d] text-white font-semibold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
