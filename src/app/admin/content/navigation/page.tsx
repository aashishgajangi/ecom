'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavigationItem {
  name: string;
  url: string;
  order: number;
  isActive: boolean;
  location: 'header' | 'footer' | 'both';
}

interface NavigationSettings {
  header: NavigationItem[];
  footer: NavigationItem[];
}

export default function NavigationManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [navigation, setNavigation] = useState<NavigationSettings>({
    header: [],
    footer: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin');
      return;
    }

    fetchNavigation();
  }, [session, status, router]);

  const fetchNavigation = async () => {
    try {
      // Fetch header navigation
      const headerResponse = await fetch('/api/settings/header');
      if (headerResponse.ok) {
        const headerData = await headerResponse.json();
        const headerItems = headerData.headerSettings?.navigation || [];
        
        // Fetch footer navigation
        const footerResponse = await fetch('/api/settings/footer');
        if (footerResponse.ok) {
          const footerData = await footerResponse.json();
          const footerItems = footerData.footerSettings?.quickLinks?.[0]?.links || [];
          
          setNavigation({
            header: headerItems.map((item: any) => ({ ...item, location: 'header' })),
            footer: footerItems.map((item: any, index: number) => ({ 
              ...item, 
              order: index + 1, 
              isActive: true, 
              location: 'footer' 
            }))
          });
        }
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Save header navigation
      const headerResponse = await fetch('/api/settings/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          navigation: navigation.header.map(({ location, ...item }) => item)
        }),
      });

      // Save footer navigation
      const footerResponse = await fetch('/api/settings/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quickLinks: [{
            title: 'Quick Links',
            links: navigation.footer.map(({ location, order, isActive, ...item }) => item)
          }]
        }),
      });

      if (headerResponse.ok && footerResponse.ok) {
        setMessage('Navigation settings saved successfully!');
      } else {
        setMessage('Failed to save navigation settings');
      }
    } catch (error) {
      console.error('Error saving navigation:', error);
      setMessage('Error saving navigation settings');
    } finally {
      setSaving(false);
    }
  };

  const updateNavigationItem = (location: 'header' | 'footer', index: number, field: keyof NavigationItem, value: any) => {
    setNavigation(prev => ({
      ...prev,
      [location]: prev[location].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addNavigationItem = (location: 'header' | 'footer') => {
    setNavigation(prev => ({
      ...prev,
      [location]: [
        ...prev[location],
        { 
          name: '', 
          url: '', 
          order: prev[location].length + 1, 
          isActive: true,
          location 
        }
      ]
    }));
  };

  const removeNavigationItem = (location: 'header' | 'footer', index: number) => {
    setNavigation(prev => ({
      ...prev,
      [location]: prev[location].filter((_, i) => i !== index)
    }));
  };

  const moveItem = (location: 'header' | 'footer', index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === navigation[location].length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const items = [...navigation[location]];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    
    // Update orders
    items.forEach((item, i) => {
      item.order = i + 1;
    });

    setNavigation(prev => ({
      ...prev,
      [location]: items
    }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Navigation Manager</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Navigation'}
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Header Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Header Navigation</h2>
              <button
                onClick={() => addNavigationItem('header')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {navigation.header.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateNavigationItem('header', index, 'name', e.target.value)}
                      placeholder="Name"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateNavigationItem('header', index, 'url', e.target.value)}
                      placeholder="URL"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveItem('header', index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveItem('header', index, 'down')}
                      disabled={index === navigation.header.length - 1}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => updateNavigationItem('header', index, 'isActive', e.target.checked)}
                        className="mr-1"
                      />
                      Active
                    </label>
                    <button
                      onClick={() => removeNavigationItem('header', index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              
              {navigation.header.length === 0 && (
                <p className="text-gray-500 text-center py-4">No header navigation items</p>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Footer Navigation</h2>
              <button
                onClick={() => addNavigationItem('footer')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {navigation.footer.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateNavigationItem('footer', index, 'name', e.target.value)}
                      placeholder="Name"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateNavigationItem('footer', index, 'url', e.target.value)}
                      placeholder="URL"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveItem('footer', index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveItem('footer', index, 'down')}
                      disabled={index === navigation.footer.length - 1}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => updateNavigationItem('footer', index, 'isActive', e.target.checked)}
                        className="mr-1"
                      />
                      Active
                    </label>
                    <button
                      onClick={() => removeNavigationItem('footer', index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              
              {navigation.footer.length === 0 && (
                <p className="text-gray-500 text-center py-4">No footer navigation items</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Navigation Tips</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Use relative URLs for internal links (e.g., "/about", "/contact")</li>
            <li>• Use full URLs for external links (e.g., "https://example.com")</li>
            <li>• Header navigation appears in the main menu at the top of the page</li>
            <li>• Footer navigation appears in the quick links section of the footer</li>
            <li>• Inactive items won't be displayed to visitors</li>
            <li>• Use the arrow buttons to reorder navigation items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
