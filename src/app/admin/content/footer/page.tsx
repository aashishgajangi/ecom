'use client';

import { useState, useEffect } from 'react';

interface FooterSettings {
  id: string;
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

export default function FooterSettingsPage() {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await fetch('/api/settings/footer');
      if (response.ok) {
        const data = await response.json();
        setFooterSettings(data.footerSettings);
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerSettings),
      });

      if (response.ok) {
        setMessage('Footer settings saved successfully!');
      } else {
        setMessage('Failed to save footer settings');
      }
    } catch (error) {
      console.error('Error saving footer settings:', error);
      setMessage('Error saving footer settings');
    } finally {
      setSaving(false);
    }
  };

  const updateCompanyInfo = (field: keyof FooterSettings['companyInfo'], value: string) => {
    if (!footerSettings) return;
    
    setFooterSettings({
      ...footerSettings,
      companyInfo: {
        ...footerSettings.companyInfo,
        [field]: value
      }
    });
  };

  const updateSocialLink = (platform: keyof FooterSettings['socialLinks'], value: string) => {
    if (!footerSettings) return;
    
    setFooterSettings({
      ...footerSettings,
      socialLinks: {
        ...footerSettings.socialLinks,
        [platform]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading footer settings...</div>
      </div>
    );
  }

  if (!footerSettings) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Footer settings not available</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Footer Settings</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🏢 Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">🏷️ Company Name</label>
              <input
                type="text"
                value={footerSettings.companyInfo.companyName || ''}
                onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="Your company name (appears in footer and copyright)"
              />
              <p className="text-xs text-gray-500 mt-1">This name appears in the footer title and copyright text</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">📝 Description</label>
              <textarea
                value={footerSettings.companyInfo.description}
                onChange={(e) => updateCompanyInfo('description', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                rows={3}
                placeholder="Company description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📞 Phone</label>
              <input
                type="text"
                value={footerSettings.companyInfo.phone}
                onChange={(e) => updateCompanyInfo('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">📧 Email</label>
              <input
                type="email"
                value={footerSettings.companyInfo.email}
                onChange={(e) => updateCompanyInfo('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">📍 Address</label>
              <textarea
                value={footerSettings.companyInfo.address}
                onChange={(e) => updateCompanyInfo('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                rows={2}
                placeholder="Company address"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook URL</label>
              <input
                type="url"
                value={footerSettings.socialLinks.facebook}
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram URL</label>
              <input
                type="url"
                value={footerSettings.socialLinks.instagram}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter URL</label>
              <input
                type="url"
                value={footerSettings.socialLinks.twitter}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="https://twitter.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">YouTube URL</label>
              <input
                type="url"
                value={footerSettings.socialLinks.youtube}
                onChange={(e) => updateSocialLink('youtube', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
          </div>
        </div>

        {/* Note: Quick Links and Legal Links are managed through the pages system */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Quick Links & Legal Pages</h3>
          <p className="text-blue-700 text-sm">
            Quick links and legal pages are automatically managed through the Pages system in the admin panel.
            Create pages with specific slugs (like /privacy-policy, /terms) and they will appear in the footer automatically.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary-start text-white rounded-lg hover:bg-primary-mid disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
