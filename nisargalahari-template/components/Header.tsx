'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname() || '/';
  const lang = pathname.split('/')[1];
  const locale = lang === 'mr' ? 'mr' : 'en';

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'mr' : 'en';
    const path = pathname.replace(/^\/[^\/]+/, '');
    window.location.href = `/${newLocale}${path}`;
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Define the account icon for reuse across mobile and desktop
  const AccountIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  // Use the same account icon for login for consistency
  const LoginIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  // Elegant language toggle button
  const LanguageToggle = ({ className = "" }) => (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-white hover:border-primary-start hover:text-primary-start transition-all duration-200 text-sm font-medium shadow-sm ${className}`}
      aria-label={locale === 'en' ? 'Switch to Marathi' : 'Switch to English'}
      title={locale === 'en' ? 'Switch to Marathi' : 'Switch to English'}
    >
      <span className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">🌐</span>
        <span className="font-semibold">
          {locale === 'en' ? 'म' : 'en'}
        </span>
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="text-2xl font-bold">
            <span className={locale === 'mr' ? 'gradient-text-marathi' : 'gradient-text'}>
              {locale === 'en' ? 'Nisargalahari' : 'निसर्गलहरी'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={`/${locale}`} className="hover:text-primary-start transition-colors">
              {locale === 'en' ? 'Home' : 'मुख्यपृष्ठ'}
            </Link>
            <Link href={`/${locale}/about`} className="hover:text-primary-start transition-colors">
              {locale === 'en' ? 'About' : 'आमच्याबद्दल'}
            </Link>
            <Link href={`/${locale}/products`} className="hover:text-primary-start transition-colors">
              {locale === 'en' ? 'Products' : 'उत्पादे'}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-primary-start transition-colors">
              {locale === 'en' ? 'Contact' : 'संपर्क'}
            </Link>

            {/* Language Toggle - Elegant */}
            <LanguageToggle />

            {/* Cart Button */}
            <div className="relative">
              <button 
                onClick={toggleCart}
                className="flex items-center gap-1 hover:text-primary-start"
                aria-label={locale === 'en' ? 'Open cart' : 'कार्ट उघडा'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm">{locale === 'en' ? 'Cart' : 'कार्ट'}</span>
              </button>
            </div>

            {/* Auth Links */}
            <Link 
              href={`/${locale}/account/login`} 
              className="hover:text-primary-start transition-colors flex items-center gap-1"
            >
              <LoginIcon />
              <span>{locale === 'en' ? 'Login' : 'लॉगिन'}</span>
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Language Toggle - Elegant */}
            <LanguageToggle />

            {/* Mobile Cart Button */}
            <button 
              onClick={toggleCart}
              className="hover:text-primary-start transition-colors"
              aria-label={locale === 'en' ? 'Open cart' : 'कार्ट उघडा'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            
            {/* Mobile Account Icon */}
            <Link 
              href={`/${locale}/account/login`} 
              className="hover:text-primary-start transition-colors"
              aria-label={locale === 'en' ? 'Login' : 'लॉगिन'}
            >
              <LoginIcon className="h-6 w-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 space-y-3">
            <Link
              href={`/${locale}`}
              className="block hover:text-primary-start transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {locale === 'en' ? 'Home' : 'मुख्यपृष्ठ'}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="block hover:text-primary-start transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {locale === 'en' ? 'About' : 'आमच्याबद्दल'}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="block hover:text-primary-start transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {locale === 'en' ? 'Products' : 'उत्पादे'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="block hover:text-primary-start transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {locale === 'en' ? 'Contact' : 'संपर्क'}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
