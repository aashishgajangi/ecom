'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Theme } from '@/types/theme';
import { generateColorPalette } from '@/utils/themeUtils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default function EditThemePage({ params }: RouteParams) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    primaryColor: '#70843d',
    secondaryColor: '#7bd63c',
    tags: '',
    isDefault: false
  });

  useEffect(() => {
    params.then(resolvedParams => {
      setId(resolvedParams.id);
      fetchTheme(resolvedParams.id);
    });
  }, [params]);

  const fetchTheme = async (themeId: string) => {
    try {
      const response = await fetch(`/api/admin/themes/${themeId}`);
      if (response.ok) {
        const data = await response.json();
        const themeData = data.theme;
        setTheme(themeData);
        
        // Extract primary and secondary colors from the color scheme
        const primaryColor = themeData.colorScheme?.primary?.['500'] || '#70843d';
        const secondaryColor = themeData.colorScheme?.secondary?.['500'] || '#7bd63c';
        
        setFormData({
          name: themeData.name,
          slug: themeData.slug,
          description: themeData.description || '',
          primaryColor,
          secondaryColor,
          tags: themeData.tags?.join(', ') || '',
          isDefault: themeData.isDefault
        });
      } else {
        alert('Theme not found');
        router.push('/admin/themes');
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
      alert('Failed to load theme');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Generate color palettes from base colors
      const primaryPalette = generateColorPalette(formData.primaryColor);
      const secondaryPalette = generateColorPalette(formData.secondaryColor);

      // Create color scheme with generated palettes
      const colorScheme = {
        ...theme?.colorScheme,
        primary: {
          ...theme?.colorScheme?.primary,
          ...primaryPalette
        },
        secondary: {
          ...theme?.colorScheme?.secondary,
          ...secondaryPalette
        },
        text: {
          ...theme?.colorScheme?.text,
          link: formData.primaryColor,
          linkHover: primaryPalette['600'] || formData.primaryColor
        },
        border: {
          ...theme?.colorScheme?.border,
          focus: formData.primaryColor
        },
        gradients: {
          ...theme?.colorScheme?.gradients,
          primary: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${primaryPalette['600'] || formData.primaryColor} 50%, ${formData.secondaryColor} 100%)`,
          secondary: `linear-gradient(135deg, ${formData.secondaryColor} 0%, ${secondaryPalette['600'] || formData.secondaryColor} 100%)`,
          button: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`,
          accent: `linear-gradient(135deg, ${formData.secondaryColor} 0%, ${formData.primaryColor} 100%)`
        }
      };

      const updateData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        colorScheme,
        isDefault: formData.isDefault,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch(`/api/admin/themes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push('/admin/themes');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update theme');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      alert('Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading theme...</p>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Theme Not Found</h1>
          <Link href="/admin/themes" className="text-blue-600 hover:text-blue-700">
            ← Back to Themes
          </Link>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-semibold text-gray-900">Edit Theme: {theme.name}</h1>
            </div>
            
            {theme.isSystem && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                System Theme
              </div>
            )}
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
                  disabled={theme.isSystem}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      name: e.target.value,
                      slug: theme.isSystem ? prev.slug : generateSlug(e.target.value)
                    }));
                  }}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme.isSystem ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="e.g., Ocean Blue"
                />
                {theme.isSystem && (
                  <p className="text-xs text-gray-500 mt-1">System themes cannot be renamed</p>
                )}
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  required
                  disabled={theme.isSystem}
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme.isSystem ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
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

                {!theme.isSystem && (
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
                )}
              </div>
            </div>

            {/* Current Theme Info */}
            <div className="border-t pt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Theme Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-2 font-medium">{theme.version}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 font-medium">{new Date(theme.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Tags:</span>
                  <span className="ml-2 font-medium">{theme.tags.length || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 font-medium ${theme.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                    {theme.isActive ? 'Active' : 'Inactive'}
                  </span>
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
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Update Theme'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
