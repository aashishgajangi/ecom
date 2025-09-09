'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  };
  featuredProduct: {
    title: string;
    description: string;
    imageUrl: string;
    productLink: string;
    ctaText: string;
  };
  whyChooseUs: {
    title: string;
    subtitle: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  serviceAreas: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    areas: Array<{
      name: string;
      slug: string;
      priority: boolean;
    }>;
  };
}

interface HomepageEditorProps {
  content: HomepageContent;
  onChange: (content: HomepageContent) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const defaultContent: HomepageContent = {
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
};

const HomepageEditor = ({ content = defaultContent, onChange, onImageUpload }: HomepageEditorProps) => {
  const [activeSection, setActiveSection] = useState<'hero' | 'featuredProduct' | 'whyChooseUs' | 'serviceAreas'>('hero');
  const [imageUploading, setImageUploading] = useState(false);

  const updateSection = (section: keyof HomepageContent, data: Partial<HomepageContent[keyof HomepageContent]>) => {
    onChange({
      ...content,
      [section]: { ...content[section], ...data }
    });
  };

  const updateFeature = (index: number, feature: Partial<HomepageContent['whyChooseUs']['features'][0]>) => {
    const newFeatures = [...content.whyChooseUs.features];
    newFeatures[index] = { ...newFeatures[index], ...feature };
    updateSection('whyChooseUs', { features: newFeatures });
  };

  const updateArea = (index: number, area: Partial<HomepageContent['serviceAreas']['areas'][0]>) => {
    const newAreas = [...content.serviceAreas.areas];
    newAreas[index] = { ...newAreas[index], ...area };
    updateSection('serviceAreas', { areas: newAreas });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      setImageUploading(true);
      try {
        const imageUrl = await onImageUpload(file);
        updateSection('featuredProduct', { imageUrl });
      } catch (error) {
        console.error('Image upload failed:', error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const iconOptions = [
    { value: 'check-circle', label: '✓ Check Circle' },
    { value: 'clock', label: '🕐 Clock' },
    { value: 'shield-check', label: '🛡️ Shield Check' },
    { value: 'star', label: '⭐ Star' },
    { value: 'heart', label: '❤️ Heart' },
    { value: 'leaf', label: '🍃 Leaf' }
  ];

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'hero', label: 'Hero Section' },
            { key: 'featuredProduct', label: 'Featured Product' },
            { key: 'whyChooseUs', label: 'Why Choose Us' },
            { key: 'serviceAreas', label: 'Service Areas' }
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

      {/* Hero Section Editor */}
      {activeSection === 'hero' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hero Section</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => updateSection('hero', { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter hero title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Subtitle
            </label>
            <textarea
              value={content.hero.subtitle}
              onChange={(e) => updateSection('hero', { subtitle: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter hero subtitle"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.hero.ctaText}
                onChange={(e) => updateSection('hero', { ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Link
              </label>
              <input
                type="text"
                value={content.hero.ctaLink}
                onChange={(e) => updateSection('hero', { ctaLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/products"
              />
            </div>
          </div>
        </div>
      )}

      {/* Featured Product Section Editor */}
      {activeSection === 'featuredProduct' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Featured Product Section</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.featuredProduct.title}
              onChange={(e) => updateSection('featuredProduct', { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.featuredProduct.description}
              onChange={(e) => updateSection('featuredProduct', { description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="space-y-2">
              {content.featuredProduct.imageUrl && (
                <div className="relative w-32 h-32">
                  <Image
                    src={content.featuredProduct.imageUrl}
                    alt="Featured Product"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageUploading && <p className="text-sm text-gray-500">Uploading...</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.featuredProduct.ctaText}
                onChange={(e) => updateSection('featuredProduct', { ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Link
              </label>
              <input
                type="text"
                value={content.featuredProduct.productLink}
                onChange={(e) => updateSection('featuredProduct', { productLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/products"
              />
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us Section Editor */}
      {activeSection === 'whyChooseUs' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Why Choose Us Section</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.whyChooseUs.title}
              onChange={(e) => updateSection('whyChooseUs', { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Subtitle
            </label>
            <textarea
              value={content.whyChooseUs.subtitle}
              onChange={(e) => updateSection('whyChooseUs', { subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section subtitle"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Features</h4>
            {content.whyChooseUs.features.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, { icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Feature title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Feature description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Areas Section Editor */}
      {activeSection === 'serviceAreas' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Service Areas Section</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.serviceAreas.title}
              onChange={(e) => updateSection('serviceAreas', { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Subtitle
            </label>
            <textarea
              value={content.serviceAreas.subtitle}
              onChange={(e) => updateSection('serviceAreas', { subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section subtitle"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.serviceAreas.ctaText}
                onChange={(e) => updateSection('serviceAreas', { ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Link
              </label>
              <input
                type="text"
                value={content.serviceAreas.ctaLink}
                onChange={(e) => updateSection('serviceAreas', { ctaLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/mumbai/borivali"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Service Areas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.serviceAreas.areas.map((area, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area Name
                      </label>
                      <input
                        type="text"
                        value={area.name}
                        onChange={(e) => updateArea(index, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Area name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={area.slug}
                        onChange={(e) => updateArea(index, { slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="area-name"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={area.priority}
                        onChange={(e) => updateArea(index, { priority: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">Priority Area</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
