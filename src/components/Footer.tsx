'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FooterSettings {
  companyInfo: {
    companyName: string;
    description: string;
    phone: string;
    email: string;
    address: string;
  };
  quickLinks: Array<{
    title: string;
    links: Array<{
      name: string;
      url: string;
    }>;
  }>;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  legalLinks: Array<{
    name: string;
    url: string;
  }>;
}

const Footer = () => {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await fetch('/api/settings/footer');
      if (response.ok) {
        const data = await response.json();
        setFooterSettings(data.footerSettings);
      } else {
        console.error('Failed to fetch footer settings');
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <footer className="footer-bg text-white py-8">
        <div className="container-custom">
          <div className="text-center">Loading footer...</div>
        </div>
      </footer>
    );
  }

  if (!footerSettings) {
    return (
      <footer className="footer-bg text-white py-8">
        <div className="container-custom">
          <div className="text-center">Footer settings not available</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-bg text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 gradient-text">
              {footerSettings.companyInfo.companyName || "Ecom"}
            </h3>
            <p className="text-gray-300 mb-4">
              {footerSettings.companyInfo.description}
            </p>
            <div className="space-y-2 text-gray-300">
              <p>📞 {footerSettings.companyInfo.phone}</p>
              <p>📧 {footerSettings.companyInfo.email}</p>
              <p>📍 {footerSettings.companyInfo.address}</p>
            </div>
          </div>

          {/* Quick Links */}
          {footerSettings.quickLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.url}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {footerSettings.socialLinks.facebook && (
                <a
                  href={footerSettings.socialLinks.facebook}
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              )}
              {footerSettings.socialLinks.instagram && (
                <a
                  href={footerSettings.socialLinks.instagram}
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
              {footerSettings.socialLinks.twitter && (
                <a
                  href={footerSettings.socialLinks.twitter}
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              )}
              {footerSettings.socialLinks.youtube && (
                <a
                  href={footerSettings.socialLinks.youtube}
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {footerSettings.legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="text-center text-gray-400 text-sm mt-4">
            © {new Date().getFullYear()} {footerSettings.companyInfo.companyName || "Ecom"}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
