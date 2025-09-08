'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomepageTest() {
  const [content, setContent] = useState({
    hero: {
      title: "Nature's Best, Delivered Fresh",
      subtitle: "Experience the goodness of nature with top-quality products designed to nourish your body and soul.",
      ctaText: "Explore Products",
      ctaLink: "/products"
    },
    featuredProduct: {
      title: "Our Featured Product",
      description: "Experience the aroma and taste of our premium products, beneficial for the health of the entire family.",
      imageUrl: "/uploads/2b450e54-44d9-4180-ab83-ddcab7320e32.jpeg",
      productLink: "/products",
      ctaText: "View Product"
    },
    whyChooseUs: {
      title: "Why Choose Us?",
      subtitle: "We are committed to providing the highest quality products, made with traditional methods and care.",
      features: [
        {
          icon: "check-circle",
          title: "100% Natural",
          description: "Our products are made from pure natural ingredients, ensuring the highest quality and authenticity."
        },
        {
          icon: "clock",
          title: "Traditional Process",
          description: "We follow traditional methods to prepare our products, preserving their natural goodness."
        },
        {
          icon: "shield-check",
          title: "Quality Certified",
          description: "Our products are certified by quality standards, ensuring safety and quality standards."
        }
      ]
    },
    serviceAreas: {
      title: "Our Service Areas",
      subtitle: "Premium quality products available across all major areas with free delivery.",
      ctaText: "Get Products in Your Area",
      ctaLink: "/mumbai/borivali",
      areas: [
        { name: 'Borivali', slug: 'borivali', priority: true },
        { name: 'Dahisar', slug: 'dahisar', priority: true },
        { name: 'Malad', slug: 'malad', priority: false },
        { name: 'Goregaon', slug: 'goregaon', priority: false },
        { name: 'Mira Road', slug: 'mira-road', priority: false },
        { name: 'Andheri', slug: 'andheri', priority: false },
        { name: 'Bandra', slug: 'bandra', priority: false }
      ]
    }
  });

  const [activeSection, setActiveSection] = useState<'hero' | 'featuredProduct' | 'whyChooseUs' | 'serviceAreas'>('hero');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/pages/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: content.hero.title,
          content: content.hero.subtitle,
          metadata: {
            homepageContent: content,
            template: 'homepage',
            isHomepage: true
          },
          isPublished: true,
          isHomepage: true,
          slug: 'homepage'
        }),
      });

      if (response.ok) {
        setMessage('Homepage saved successfully! ✅');
      } else {
        const errorData = await response.json();
        setMessage(`Failed to save homepage: ${errorData.error || 'Unknown error'} ❌`);
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Error saving homepage ❌');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏠 Edit Homepage</h1>
            <p className="text-gray-600">Customize your homepage content - Hero, Featured Product, Why Choose Us, Service Areas</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/content"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ← Back to Content
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                saving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? '💾 Saving...' : '💾 Save Homepage'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Section Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 pt-6">
              {[
                { key: 'hero', label: '🎭 Hero Section' },
                { key: 'featuredProduct', label: '⭐ Featured Product' },
                { key: 'whyChooseUs', label: '✨ Why Choose Us' },
                { key: 'serviceAreas', label: '📍 Service Areas' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSection(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeSection === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {/* Hero Section Editor */}
            {activeSection === 'hero' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Hero Title
                  </label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hero title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Hero Subtitle
                  </label>
                  <textarea
                    value={content.hero.subtitle}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hero subtitle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔘 CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={content.hero.ctaText}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        hero: { ...prev.hero, ctaText: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔗 CTA Link
                    </label>
                    <input
                      type="text"
                      value={content.hero.ctaLink}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        hero: { ...prev.hero, ctaLink: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/products"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Featured Product Section Editor */}
            {activeSection === 'featuredProduct' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Section Title
                  </label>
                  <input
                    type="text"
                    value={content.featuredProduct.title}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      featuredProduct: { ...prev.featuredProduct, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Description
                  </label>
                  <textarea
                    value={content.featuredProduct.description}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      featuredProduct: { ...prev.featuredProduct, description: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔘 CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={content.featuredProduct.ctaText}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        featuredProduct: { ...prev.featuredProduct, ctaText: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔗 Product Link
                    </label>
                    <input
                      type="text"
                      value={content.featuredProduct.productLink}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        featuredProduct: { ...prev.featuredProduct, productLink: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/products"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Why Choose Us Section Editor */}
            {activeSection === 'whyChooseUs' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Section Title
                  </label>
                  <input
                    type="text"
                    value={content.whyChooseUs.title}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      whyChooseUs: { ...prev.whyChooseUs, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Section Subtitle
                  </label>
                  <textarea
                    value={content.whyChooseUs.subtitle}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      whyChooseUs: { ...prev.whyChooseUs, subtitle: e.target.value }
                    }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section subtitle"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3">✨ Features (3 cards)</h4>
                  {content.whyChooseUs.features.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 mb-3">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...content.whyChooseUs.features];
                            newFeatures[index] = { ...feature, title: e.target.value };
                            setContent(prev => ({
                              ...prev,
                              whyChooseUs: { ...prev.whyChooseUs, features: newFeatures }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Feature title"
                        />
                        <select
                          value={feature.icon}
                          onChange={(e) => {
                            const newFeatures = [...content.whyChooseUs.features];
                            newFeatures[index] = { ...feature, icon: e.target.value };
                            setContent(prev => ({
                              ...prev,
                              whyChooseUs: { ...prev.whyChooseUs, features: newFeatures }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="check-circle">✓ Check Circle</option>
                          <option value="clock">🕐 Clock</option>
                          <option value="shield-check">🛡️ Shield</option>
                          <option value="star">⭐ Star</option>
                          <option value="heart">❤️ Heart</option>
                        </select>
                      </div>
                      <textarea
                        value={feature.description}
                        onChange={(e) => {
                          const newFeatures = [...content.whyChooseUs.features];
                          newFeatures[index] = { ...feature, description: e.target.value };
                          setContent(prev => ({
                            ...prev,
                            whyChooseUs: { ...prev.whyChooseUs, features: newFeatures }
                          }));
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Feature description"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Service Areas Section Editor */}
            {activeSection === 'serviceAreas' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Section Title
                  </label>
                  <input
                    type="text"
                    value={content.serviceAreas.title}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      serviceAreas: { ...prev.serviceAreas, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Section Subtitle
                  </label>
                  <textarea
                    value={content.serviceAreas.subtitle}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      serviceAreas: { ...prev.serviceAreas, subtitle: e.target.value }
                    }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Section subtitle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔘 CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={content.serviceAreas.ctaText}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        serviceAreas: { ...prev.serviceAreas, ctaText: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔗 CTA Link
                    </label>
                    <input
                      type="text"
                      value={content.serviceAreas.ctaLink}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        serviceAreas: { ...prev.serviceAreas, ctaLink: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/mumbai/borivali"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">📍 Service Areas (7 locations)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {content.serviceAreas.areas.map((area, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3">
                        <input
                          type="text"
                          value={area.name}
                          onChange={(e) => {
                            const newAreas = [...content.serviceAreas.areas];
                            newAreas[index] = { ...area, name: e.target.value };
                            setContent(prev => ({
                              ...prev,
                              serviceAreas: { ...prev.serviceAreas, areas: newAreas }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                          placeholder="Area name"
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={area.priority}
                            onChange={(e) => {
                              const newAreas = [...content.serviceAreas.areas];
                              newAreas[index] = { ...area, priority: e.target.checked };
                              setContent(prev => ({
                                ...prev,
                                serviceAreas: { ...prev.serviceAreas, areas: newAreas }
                              }));
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">⭐ Priority Area</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">🚀 Quick Actions</h2>
          <div className="flex space-x-4">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              👁️ View Live Homepage
            </Link>
            <Link
              href="/admin/content/pages"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              📄 Manage Other Pages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
