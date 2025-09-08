'use client';

import Image from 'next/image';
import Link from 'next/link';

interface FeaturedProductProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  productLink?: string;
  ctaText?: string;
}

const FeaturedProduct = ({
  title = "Our Featured Product",
  description = "Experience the aroma and taste of our premium products, beneficial for the health of the entire family.",
  imageUrl = "/uploads/2b450e54-44d9-4180-ab83-ddcab7320e32.jpeg",
  productLink = "/products",
  ctaText = "View Product"
}: FeaturedProductProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-[#70843d]/10 to-[#7bd63c]/10">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
                className="w-full h-auto object-contain max-w-[320px] md:max-w-[400px] lg:max-w-[450px] transition-all duration-700 group-hover:scale-105 drop-shadow-2xl filter brightness-110 contrast-110"
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
        <div className="text-center mt-8">
          <Link 
            href={productLink}
            className="btn-primary inline-flex items-center px-6 py-3"
          >
            {ctaText}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
