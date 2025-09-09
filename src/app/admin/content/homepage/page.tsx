'use client';

import { useState, useEffect } from 'react';

interface HomepageSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredProducts: Record<string, unknown>[];
  showFeaturedSection: boolean;
  showServicesSection: boolean;
  showTestimonials: boolean;
}

export default function HomepageSettingsPage() {
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHomepageSettings();
  }, []);

  const fetchHomepageSettings = async () => {
    try {
      const response = await fetch('/api/settings/homepage');
      if (response.ok) {
        const data = await response.json();
        setHomepageSettings(data.homepageSettings);
      }
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homepageSettings),
      });

      if (response.ok) {
        setMessage('Homepage settings saved successfully!');
      } else {
        setMessage('Failed to save homepage settings');
      }
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      setMessage('Error saving homepage settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading homepage settings...</div>
      </div>
    );
  }

  if (!homepageSettings) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Homepage settings not available</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Homepage Settings</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <input
                type="text"
                value={homepageSettings.heroTitle}
                onChange={(e) => setHomepageSettings({ ...homepageSettings, heroTitle: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <textarea
                value={homepageSettings.heroSubtitle}
                onChange={(e) => setHomepageSettings({ ...homepageSettings, heroSubtitle: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-start focus:border-transparent"
                rows={3}
                placeholder="Enter hero subtitle"
              />
            </div>
          </div>
        </div>

        {/* Section Toggles */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Section Visibility</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={homepageSettings.showFeaturedSection}
                onChange={(e) => setHomepageSettings({ ...homepageSettings, showFeaturedSection: e.target.checked })}
                className="mr-2"
              />
              Show Featured Products Section
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={homepageSettings.showServicesSection}
                onChange={(e) => setHomepageSettings({ ...homepageSettings, showServicesSection: e.target.checked })}
                className="mr-2"
              />
              Show Services Section
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={homepageSettings.showTestimonials}
                onChange={(e) => setHomepageSettings({ ...homepageSettings, showTestimonials: e.target.checked })}
                className="mr-2"
              />
              Show Testimonials Section
            </label>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Coming Soon</h3>
            <p className="text-blue-700 text-sm">
              Featured products management will be integrated with the products system.
              You&apos;ll be able to select products to feature on the homepage from the products admin panel.
            </p>
          </div>
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
