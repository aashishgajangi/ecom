'use client';

import Link from 'next/link';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const Hero = ({ 
  title = "Nature's Best, Delivered Fresh", 
  subtitle = "Experience the goodness of nature with top-quality products designed to nourish your body and soul.",
  ctaText = "Explore Products",
  ctaLink = "/products"
}: HeroProps) => {
  return (
    <section className="pt-20 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 md:space-y-8 lg:space-y-10">
            {/* Main Heading */}
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                <span className="gradient-text">
                  {title}
                </span>
              </h1>
              
              {/* Hero Description */}
              <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Simple & Professional CTA Button */}
            <div className="pt-4 md:pt-6 lg:pt-8">
              <Link 
                href={ctaLink}
                className="group inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 bg-gradient-to-r from-[#70843d] to-[#7bd63c] hover:from-[#7bd63c] hover:to-[#70843d] text-white font-semibold text-sm md:text-base lg:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                aria-label={ctaText}
              >
                {ctaText}
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
