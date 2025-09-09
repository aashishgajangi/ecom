'use client';

import { useState, useEffect } from 'react';

interface BrandingSettings {
  siteName: string;
  siteDescription: string;
  favicon: string | null;
  appleTouchIcon: string | null;
  maskIcon: string | null;
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<BrandingSettings>({
    siteName: '',
    siteDescription: '',
    favicon: null,
    appleTouchIcon: null,
    maskIcon: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // For now, we'll use header settings as base and expand
      const response = await fetch('/api/settings/header');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          siteName: data.headerSettings.logoText || '',
          siteDescription: 'Pure, nature-friendly products that harness the power of nature',
          favicon: null,
          appleTouchIcon: null,
          maskIcon: null
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(type);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          ...settings,
          [type]: data.url
        });
        setMessage(`${type} uploaded successfully!`);
      } else {
        setMessage(`Failed to upload ${type}`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setMessage(`Error uploading ${type}`);
    } finally {
      setUploading('');
    }
  };

  const removeIcon = (type: string) => {
    setSettings({
      ...settings,
      [type]: null
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // For now, save basic info to header settings
      const response = await fetch('/api/settings/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoText: settings.siteName,
          logoImage: null,
          logoType: 'TEXT',
          navigation: [
            { name: 'Home', url: '/', order: 1, isActive: true },
            { name: 'Products', url: '/products', order: 2, isActive: true },
            { name: 'About', url: '/about', order: 3, isActive: true },
            { name: 'Contact', url: '/contact', order: 4, isActive: true }
          ],
          showCart: true,
          showLogin: true
        }),
      });

      if (response.ok) {
        setMessage('Branding settings saved successfully!');
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const generateFavicon = () => {
    setMessage('Favicon generation feature coming soon! For now, please upload a 32x32 PNG icon.');
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading branding settings...</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Site Branding & Favicon Management</h1>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          
          {/* Site Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Site Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                  placeholder="Enter your site name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                  placeholder="Enter your site description for SEO"
                />
              </div>
            </div>
          </div>

          {/* Favicon Management */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Favicon & Icons</h2>
            
            {/* Favicon */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">Standard Favicon (32x32)</h3>
                {settings.favicon ? (
                  <div className="flex items-center space-x-4 mb-3">
                    <img 
                      src={settings.favicon} 
                      alt="Favicon" 
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Current favicon</span>
                    <button
                      onClick={() => removeIcon('favicon')}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-center">No favicon uploaded</p>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/png,image/x-icon,image/svg+xml"
                    onChange={(e) => handleIconUpload(e, 'favicon')}
                    disabled={uploading === 'favicon'}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  {uploading === 'favicon' && <span className="text-sm text-gray-600">Uploading...</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: 32x32 PNG or ICO format</p>
              </div>

              {/* Apple Touch Icon */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">Apple Touch Icon (180x180)</h3>
                {settings.appleTouchIcon ? (
                  <div className="flex items-center space-x-4 mb-3">
                    <img 
                      src={settings.appleTouchIcon} 
                      alt="Apple Touch Icon" 
                      className="w-12 h-12 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Current Apple touch icon</span>
                    <button
                      onClick={() => removeIcon('appleTouchIcon')}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-center">No Apple touch icon uploaded</p>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleIconUpload(e, 'appleTouchIcon')}
                    disabled={uploading === 'appleTouchIcon'}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  {uploading === 'appleTouchIcon' && <span className="text-sm text-gray-600">Uploading...</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: 180x180 PNG format for iOS devices</p>
              </div>

              {/* Mask Icon */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">Safari Mask Icon (SVG)</h3>
                {settings.maskIcon ? (
                  <div className="flex items-center space-x-4 mb-3">
                    <img 
                      src={settings.maskIcon} 
                      alt="Mask Icon" 
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Current mask icon</span>
                    <button
                      onClick={() => removeIcon('maskIcon')}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-center">No mask icon uploaded</p>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/svg+xml"
                    onChange={(e) => handleIconUpload(e, 'maskIcon')}
                    disabled={uploading === 'maskIcon'}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  {uploading === 'maskIcon' && <span className="text-sm text-gray-600">Uploading...</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">Recommended: Monochrome SVG for Safari pinned tabs</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={generateFavicon}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🎨 Generate Favicon from Logo
              </button>
              <a
                href="https://favicon.io/favicon-generator/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                🔗 External Favicon Generator
              </a>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-[#70843d] to-[#7bd63c] text-white rounded-lg hover:from-[#7bd63c] hover:to-[#70843d] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Branding Settings'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
