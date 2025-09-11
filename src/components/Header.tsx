'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CartIcon from './CartIcon';

interface NavigationItem {
  name: string;
  url: string;
  order: number;
  isActive: boolean;
}

interface HeaderSettings {
  logoText: string;
  logoImage?: string;
  logoType?: 'TEXT' | 'IMAGE' | 'BOTH';
  navigation: NavigationItem[];
  showCart: boolean;
  showLogin: boolean;
}

const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeaderSettings();
  }, []);

  const fetchHeaderSettings = async () => {
    try {
      const response = await fetch('/api/settings/header');
      if (response.ok) {
        const data = await response.json();
        setHeaderSettings(data.headerSettings);
      } else {
        console.error('Failed to fetch header settings');
      }
    } catch (error) {
      console.error('Error fetching header settings:', error);
    } finally {
      setLoading(false);
    }
  };


  // Define the account icon for reuse across mobile and desktop
  const AccountIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  if (loading) {
    return (
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse md:hidden"></div>
          </div>
        </div>
      </header>
    );
  }

  if (!headerSettings) {
    return (
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              <span className="gradient-text">Loading...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const sortedNavigation = [...headerSettings.navigation]
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo Image */}
            {(headerSettings.logoType === 'IMAGE' || headerSettings.logoType === 'BOTH') && headerSettings.logoImage && (
              <img 
                src={headerSettings.logoImage} 
                alt="Logo" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            )}
            
            {/* Logo Text */}
            {(!headerSettings.logoType || headerSettings.logoType === 'TEXT' || headerSettings.logoType === 'BOTH') && (
              <span className="text-xl md:text-2xl font-bold gradient-text">
                {headerSettings.logoText}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {sortedNavigation.map((item, index) => (
              <Link
                key={item.url || `nav-item-${index}`}
                href={item.url || '#'}
                className="hover:text-primary-start transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Cart Button */}
            {headerSettings.showCart && (
              <div className="flex items-center gap-1 hover:text-primary-start">
                <CartIcon />
                <span className="text-sm">Cart</span>
              </div>
            )}

            {/* Auth Links */}
            {headerSettings.showLogin && (
              <Link 
                href="/account/login" 
                className="hover:text-primary-start transition-colors flex items-center gap-1"
              >
                <AccountIcon />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Cart Button */}
            {headerSettings.showCart && (
              <CartIcon className="hover:text-primary-start transition-colors" />
            )}
            
            {/* Mobile Account Icon */}
            {headerSettings.showLogin && (
              <Link 
                href="/account/login" 
                className="hover:text-primary-start transition-colors"
                aria-label="Login"
              >
                <AccountIcon className="h-6 w-6" />
              </Link>
            )}

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
            {sortedNavigation.map((item, index) => (
              <Link
                key={item.url || `mobile-nav-item-${index}`}
                href={item.url || '#'}
                className="block hover:text-primary-start transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
