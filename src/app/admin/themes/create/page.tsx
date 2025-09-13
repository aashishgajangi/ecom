'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEFAULT_COLOR_SCHEME } from '@/types/theme';
import { generateColorPalette } from '@/utils/themeUtils';

export default function CreateThemePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    primaryColor: '#70843d',
    secondaryColor: '#7bd63c',
    tags: '',
    isDefault: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate color palettes from base colors
      const primaryPalette = generateColorPalette(formData.primaryColor);
      const secondaryPalette = generateColorPalette(formData.secondaryColor);

      // Create color scheme with generated palettes
      const colorScheme = {
        ...DEFAULT_COLOR_SCHEME,
        primary: {
          ...DEFAULT_COLOR_SCHEME.primary,
          ...primaryPalette
        },
        secondary: {
          ...DEFAULT_COLOR_SCHEME.secondary,
          ...secondaryPalette
        },
        text: {
          ...DEFAULT_COLOR_SCHEME.text,
          link: formData.primaryColor,
          linkHover: primaryPalette['600'] || formData.primaryColor
        },
        border: {
          ...DEFAULT_COLOR_SCHEME.border,
          focus: formData.primaryColor
        },
        gradients: {
          ...DEFAULT_COLOR_SCHEME.gradients,
          primary: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${primaryPalette['600'] || formData.primaryColor} 50%, ${formData.secondaryColor} 100%)`,
          secondary: `linear-gradient(135deg, ${formData.secondaryColor} 0%, ${secondaryPalette['600'] || formData.secondaryColor} 100%)`,
          button: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`,
          accent: `linear-gradient(135deg, ${formData.secondaryColor} 0%, ${formData.primaryColor} 100%)`
        }
      };

      const themeData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        colorScheme,
        isDefault: formData.isDefault,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData),
      });

      if (response.ok) {
        router.push('/admin/themes');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create theme');
      }
    } catch (error) {
      console.error('Error creating theme:', error);
      alert('Failed to create theme');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/themes" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Back to Themes
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Create New Theme</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Ocean Blue"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ocean-blue"
                />
                <p className="text-xs text-gray-500 mt-1">Used in URLs, must be unique</p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your theme..."
              />
            </div>

            {/* Color Configuration */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🎨 Color Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color *
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Main brand color for buttons, links, etc.</p>
                </div>

                <div>
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color *
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Accent color for highlights and gradients</p>
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Color Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Gradient Preview */}
                  <div className="space-y-2">
                    <div 
                      className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ 
                        background: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)` 
                      }}
                    >
                      Primary Gradient
                    </div>
                    <div 
                      className="h-8 rounded flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      Primary Solid
                    </div>
                  </div>

                  {/* Button Preview */}
                  <div className="space-y-2">
                    <button 
                      type="button"
                      className="w-full h-12 rounded-lg text-white font-medium"
                      style={{ 
                        background: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)` 
                      }}
                    >
                      Button Preview
                    </button>
                    <div 
                      className="h-8 rounded flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: formData.secondaryColor }}
                    >
                      Secondary Solid
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">⚙️ Additional Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., blue, corporate, modern (comma-separated)"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    Set as default theme
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t pt-6 flex justify-end space-x-4">
              <Link
                href="/admin/themes"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Theme'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
