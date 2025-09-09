'use client';

import { useState, useEffect } from 'react';

interface NavigationItem {
  name: string;
  url: string;
  order: number;
  isActive: boolean;
}

interface HeaderSettings {
  id: string;
  logoText: string;
  logoImage?: string;
  logoType: 'TEXT' | 'IMAGE' | 'BOTH';
  navigation: NavigationItem[];
  showCart: boolean;
  showLogin: boolean;
}

export default function HeaderSettingsPage() {
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHeaderSettings();
  }, []);

  const fetchHeaderSettings = async () => {
    try {
      const response = await fetch('/api/settings/header');
      if (response.ok) {
        const data = await response.json();
        setHeaderSettings(data.headerSettings);
      }
    } catch (error) {
      console.error('Error fetching header settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(headerSettings),
      });

      if (response.ok) {
        setMessage('Header settings saved successfully!');
      } else {
        setMessage('Failed to save header settings');
      }
    } catch (error) {
      console.error('Error saving header settings:', error);
      setMessage('Error saving header settings');
    } finally {
      setSaving(false);
    }
  };

  const updateNavigationItem = (index: number, field: keyof NavigationItem, value: string | number | boolean) => {
    if (!headerSettings) return;
    
    const updatedNavigation = [...headerSettings.navigation];
    updatedNavigation[index] = {
      ...updatedNavigation[index],
      [field]: value
    };
    
    setHeaderSettings({
      ...headerSettings,
      navigation: updatedNavigation
    });
  };

  const addNavigationItem = () => {
    if (!headerSettings) return;
    
    setHeaderSettings({
      ...headerSettings,
      navigation: [
        ...headerSettings.navigation,
        { name: '', url: '', order: headerSettings.navigation.length + 1, isActive: true }
      ]
    });
  };

  const removeNavigationItem = (index: number) => {
    if (!headerSettings) return;
    
    const updatedNavigation = headerSettings.navigation.filter((_, i) => i !== index);
    setHeaderSettings({
      ...headerSettings,
      navigation: updatedNavigation
    });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        setHeaderSettings({
          ...headerSettings!,
          logoImage: data.url,
          logoType: headerSettings!.logoText ? 'BOTH' : 'IMAGE'
        });
        setMessage('Logo uploaded successfully!');
      } else {
        setMessage('Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage('Error uploading logo');
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    if (!headerSettings) return;
    setHeaderSettings({
      ...headerSettings,
      logoImage: undefined,
      logoType: 'TEXT'
    });
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading header settings...</div>
      </div>
    );
  }

  if (!headerSettings) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Header settings not available</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Header Settings</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Configuration */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Logo Configuration</h2>
          
          {/* Logo Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Logo Display Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="logoType"
                  value="TEXT"
                  checked={headerSettings.logoType === 'TEXT'}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, logoType: e.target.value as 'TEXT' | 'IMAGE' | 'BOTH' })}
                  className="mr-2"
                />
                Text Only
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="logoType"
                  value="IMAGE"
                  checked={headerSettings.logoType === 'IMAGE'}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, logoType: e.target.value as 'TEXT' | 'IMAGE' | 'BOTH' })}
                  className="mr-2"
                />
                Image Only
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="logoType"
                  value="BOTH"
                  checked={headerSettings.logoType === 'BOTH'}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, logoType: e.target.value as 'TEXT' | 'IMAGE' | 'BOTH' })}
                  className="mr-2"
                />
                Text + Image
              </label>
            </div>
          </div>

          {/* Logo Text */}
          {(headerSettings.logoType === 'TEXT' || headerSettings.logoType === 'BOTH') && (
            <div>
              <label className="block text-sm font-medium mb-2">Logo Text</label>
              <input
                type="text"
                value={headerSettings.logoText}
                onChange={(e) => setHeaderSettings({ ...headerSettings, logoText: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="Enter logo text"
              />
            </div>
          )}

          {/* Logo Image Upload */}
          {(headerSettings.logoType === 'IMAGE' || headerSettings.logoType === 'BOTH') && (
            <div>
              <label className="block text-sm font-medium mb-2">Logo Image</label>
              
              {/* Current Logo Preview */}
              {headerSettings.logoImage && (
                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Current Logo:</p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={headerSettings.logoImage} 
                      alt="Current Logo" 
                      className="h-12 w-auto object-contain border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Remove Logo
                    </button>
                  </div>
                </div>
              )}

              {/* Upload New Logo */}
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                />
                {uploading && (
                  <div className="text-sm text-gray-600">Uploading...</div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: PNG or SVG format, max height 80px for best results
              </p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div>
          <label className="block text-sm font-medium mb-2">Navigation Items</label>
          <div className="space-y-4">
            {headerSettings.navigation.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateNavigationItem(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateNavigationItem(index, 'url', e.target.value)}
                  placeholder="URL"
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => updateNavigationItem(index, 'order', parseInt(e.target.value))}
                  placeholder="Order"
                  className="w-20 p-2 border border-gray-300 rounded"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) => updateNavigationItem(index, 'isActive', e.target.checked)}
                    className="mr-2"
                  />
                  Active
                </label>
                <button
                  type="button"
                  onClick={() => removeNavigationItem(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNavigationItem}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Navigation Item
            </button>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={headerSettings.showCart}
              onChange={(e) => setHeaderSettings({ ...headerSettings, showCart: e.target.checked })}
              className="mr-2"
            />
            Show Cart Button
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={headerSettings.showLogin}
              onChange={(e) => setHeaderSettings({ ...headerSettings, showLogin: e.target.checked })}
              className="mr-2"
            />
            Show Login Button
          </label>
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
