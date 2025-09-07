'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname() || '/';
  const lang = pathname.split('/')[1];
  const locale = lang === 'mr' ? 'mr' : 'en';

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className={`text-2xl font-bold ${locale === 'mr' ? 'marathi-heading' : ''}`}>
              <span className={locale === 'mr' ? 'gradient-text-marathi' : 'gradient-text'}>
                {locale === 'en' ? 'Nisargalahari' : 'निसर्गलहरी'}
              </span>
            </h3>
            <p className="text-gray-600">
              {locale === 'en'
                ? 'Pure, nature-friendly products that harness the power of nature.'
                : 'शुद्ध, निसर्ग-मैत्री उत्पादने जी निसर्गाची शक्ती वापरतात.'}
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${locale === 'mr' ? 'marathi-text' : ''}`}>
              {locale === 'en' ? 'Quick Links' : 'त्वरित दुवे'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Home' : 'मुख्यपृष्ठ'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'About' : 'आमच्याबद्दल'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Products' : 'उत्पादे'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Contact' : 'संपर्क'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${locale === 'mr' ? 'marathi-text' : ''}`}>
              {locale === 'en' ? 'Contact Us' : 'आमच्याशी संपर्क साधा'}
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary-start"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +91 9324070794
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary-start"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@nisargalahari.com
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary-start"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Room No. 7, Shiv Shankar Chawl, Hanuman Tekdi, Borivali East Mumbai 400 066.
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${locale === 'mr' ? 'marathi-text' : ''}`}>
              {locale === 'en' ? 'Service Areas' : 'सेवा क्षेत्रे'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/mumbai/borivali`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Borivali' : 'बोरीवली'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/mumbai/dahisar`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Dahisar' : 'दहिसर'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/mumbai/malad`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Malad' : 'मालाड'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/mumbai/goregaon`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Goregaon' : 'गोरेगाव'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${locale === 'mr' ? 'marathi-text' : ''}`}>
              {locale === 'en' ? 'Legal' : 'कायदेशीर'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy-policy`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Privacy Policy' : 'गोपनीयता धोरण'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className={`text-gray-600 hover:text-primary-start ${locale === 'mr' ? 'marathi-text' : ''}`}>
                  {locale === 'en' ? 'Terms & Conditions' : 'नियम आणि अटी'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} <span className={`font-bold ${locale === 'mr' ? 'marathi-heading' : ''}`}>
              <span className={locale === 'mr' ? 'gradient-text-marathi' : 'gradient-text'}>
                {locale === 'en' ? 'Nisargalahari' : 'निसर्गलहरी'}
              </span>
            </span>.{' '}
            {locale === 'en' ? 'All rights reserved.' : 'सर्व हक्क राखीव.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
