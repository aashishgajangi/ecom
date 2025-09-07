'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Hero = () => {
  const pathname = usePathname() || '/';
  const locale = pathname.startsWith('/mr') ? 'mr' : 'en';

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${locale === 'mr' ? 'marathi-heading' : ''}`}>
                <span className={locale === 'mr' ? 'gradient-text-marathi' : 'gradient-text'}>
                  {locale === 'en' ? 'Nature\'s Best, Delivered Fresh' : 'निसर्गाचे उत्तम, ताजेतवाने पोहोचवले'}
                </span>
              </h1>
              
              {/* Hero Description */}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {locale === 'en' 
                  ? 'Experience the goodness of nature with top-quality products designed to nourish your body and soul.'
                  : 'निसर्गाच्या चांगुलपणाचा अनुभव घ्या, जे तुमच्या शरीर आणि आत्म्याला पोषण देण्यासाठी डिझाइन केले आहे.'}
              </p>
            </div>

            {/* Simple & Professional CTA Button */}
            <div className="pt-8">
              <Link 
                href={`/${locale}/products`}
                className="group inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white font-semibold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                aria-label={locale === 'en' ? 'Explore Products' : 'उत्पादे पहा'}
              >
                {locale === 'en' ? 'Explore Products' : 'उत्पादे पहा'}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
