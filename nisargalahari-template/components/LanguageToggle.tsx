'use client';

import { usePathname } from 'next/navigation';

const LanguageToggle = ({ className = "" }) => {
  const pathname = usePathname() || '/';
  const lang = pathname.split('/')[1];
  const locale = lang === 'mr' ? 'mr' : 'en';

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'mr' : 'en';
    const path = pathname.replace(/^\/[^\/]+/, '');
    window.location.href = `/${newLocale}${path}`;
  };

  return (
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
};

export default LanguageToggle;
