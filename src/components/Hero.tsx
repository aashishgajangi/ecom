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
    <section className="pt-16 pb-8 md:pt-20 md:pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 lg:space-y-8">
            {/* Main Heading */}
            <div className="space-y-2 md:space-y-3 lg:space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                <span className="gradient-text">
                  {title}
                </span>
              </h1>
              
              {/* Hero Description */}
              <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                {subtitle}
              </p>
            </div>

            {/* Simple & Professional CTA Button */}
            <div className="pt-2 md:pt-4 lg:pt-6">
              <Link 
                href={ctaLink}
                className="group inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 text-white font-semibold text-sm md:text-base lg:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ 
                  background: 'var(--gradient-button, var(--color-primary-500, #70843d))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--gradient-accent, var(--color-primary-600, #5a6b34))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--gradient-button, var(--color-primary-500, #70843d))';
                }}
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
