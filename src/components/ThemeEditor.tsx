'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_COLOR_SCHEME } from '@/types/theme';
import { generateColorPalette } from '@/utils/themeUtils';

interface ThemeEditorProps {
  initialData?: any;
  onSave: (themeData: any) => void;
  loading?: boolean;
}

export default function ThemeEditor({ initialData, onSave, loading = false }: ThemeEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    primaryColor: '#70843d',
    secondaryColor: '#7bd63c',
    tags: '',
    isDefault: false,
    // UI Colors
    ui: {
      badge: {
        sale: '#ef4444',
        featured: '#f59e0b',
        new: '#22c55e',
        stock: '#22c55e',
        outOfStock: '#6b7280'
      },
      rating: {
        filled: '#fbbf24',
        empty: '#d1d5db'
      },
      status: {
        inStock: '#22c55e',
        outOfStock: '#ef4444',
        lowStock: '#f59e0b',
        processing: '#3b82f6',
        shipped: '#8b5cf6',
        delivered: '#22c55e',
        cancelled: '#6b7280'
      },
      interactive: {
        hover: '#70843d',
        active: '#5a6b34',
        disabled: '#9ca3af',
        focus: '#70843d',
        selected: '#70843d'
      },
      card: {
        background: '#ffffff',
        border: '#e5e7eb',
        shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
        hoverShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
      },
      form: {
        inputBackground: '#ffffff',
        inputBorder: '#d1d5db',
        inputFocus: '#70843d',
        label: '#374151',
        placeholder: '#9ca3af',
        error: '#ef4444',
        success: '#22c55e'
      },
      nav: {
        background: '#ffffff',
        text: '#374151',
        hover: '#70843d',
        active: '#70843d',
        border: '#e5e7eb'
      },
      footer: {
        background: '#f9fafb',
        text: '#6b7280',
        link: '#70843d',
        linkHover: '#5a6b34',
        border: '#e5e7eb'
      },
      hero: {
        background: 'linear-gradient(135deg, #70843d 0%, #7bd63c 100%)',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.1)'
      },
      pagination: {
        background: '#ffffff',
        text: '#374151',
        hover: '#f3f4f6',
        active: '#70843d',
        border: '#d1d5db'
      },
      loading: {
        spinner: '#70843d',
        background: '#f9fafb',
        text: '#6b7280'
      },
      alert: {
        info: '#3b82f6',
        warning: '#f59e0b',
        error: '#ef4444',
        success: '#22c55e'
      }
    }
  });

  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        primaryColor: initialData.colorScheme?.primary?.['500'] || '#70843d',
        secondaryColor: initialData.colorScheme?.secondary?.['500'] || '#7bd63c',
        tags: initialData.tags?.join(', ') || '',
        isDefault: initialData.isDefault || false,
        ui: {
          badge: {
            sale: initialData.colorScheme?.ui?.badge?.sale || '#ef4444',
            featured: initialData.colorScheme?.ui?.badge?.featured || '#f59e0b',
            new: initialData.colorScheme?.ui?.badge?.new || '#22c55e',
            stock: initialData.colorScheme?.ui?.badge?.stock || '#22c55e',
            outOfStock: initialData.colorScheme?.ui?.badge?.outOfStock || '#6b7280'
          },
          rating: {
            filled: initialData.colorScheme?.ui?.rating?.filled || '#fbbf24',
            empty: initialData.colorScheme?.ui?.rating?.empty || '#d1d5db'
          },
          status: {
            inStock: initialData.colorScheme?.ui?.status?.inStock || '#22c55e',
            outOfStock: initialData.colorScheme?.ui?.status?.outOfStock || '#ef4444',
            lowStock: initialData.colorScheme?.ui?.status?.lowStock || '#f59e0b',
            processing: initialData.colorScheme?.ui?.status?.processing || '#3b82f6',
            shipped: initialData.colorScheme?.ui?.status?.shipped || '#8b5cf6',
            delivered: initialData.colorScheme?.ui?.status?.delivered || '#22c55e',
            cancelled: initialData.colorScheme?.ui?.status?.cancelled || '#6b7280'
          },
          interactive: {
            hover: initialData.colorScheme?.ui?.interactive?.hover || '#70843d',
            active: initialData.colorScheme?.ui?.interactive?.active || '#5a6b34',
            disabled: initialData.colorScheme?.ui?.interactive?.disabled || '#9ca3af',
            focus: initialData.colorScheme?.ui?.interactive?.focus || '#70843d',
            selected: initialData.colorScheme?.ui?.interactive?.selected || '#70843d'
          },
          card: {
            background: initialData.colorScheme?.ui?.card?.background || '#ffffff',
            border: initialData.colorScheme?.ui?.card?.border || '#e5e7eb',
            shadow: initialData.colorScheme?.ui?.card?.shadow || '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
            hoverShadow: initialData.colorScheme?.ui?.card?.hoverShadow || '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
          },
          form: {
            inputBackground: initialData.colorScheme?.ui?.form?.inputBackground || '#ffffff',
            inputBorder: initialData.colorScheme?.ui?.form?.inputBorder || '#d1d5db',
            inputFocus: initialData.colorScheme?.ui?.form?.inputFocus || '#70843d',
            label: initialData.colorScheme?.ui?.form?.label || '#374151',
            placeholder: initialData.colorScheme?.ui?.form?.placeholder || '#9ca3af',
            error: initialData.colorScheme?.ui?.form?.error || '#ef4444',
            success: initialData.colorScheme?.ui?.form?.success || '#22c55e'
          },
          nav: {
            background: initialData.colorScheme?.ui?.nav?.background || '#ffffff',
            text: initialData.colorScheme?.ui?.nav?.text || '#374151',
            hover: initialData.colorScheme?.ui?.nav?.hover || '#70843d',
            active: initialData.colorScheme?.ui?.nav?.active || '#70843d',
            border: initialData.colorScheme?.ui?.nav?.border || '#e5e7eb'
          },
          footer: {
            background: initialData.colorScheme?.ui?.footer?.background || '#f9fafb',
            text: initialData.colorScheme?.ui?.footer?.text || '#6b7280',
            link: initialData.colorScheme?.ui?.footer?.link || '#70843d',
            linkHover: initialData.colorScheme?.ui?.footer?.linkHover || '#5a6b34',
            border: initialData.colorScheme?.ui?.footer?.border || '#e5e7eb'
          },
          hero: {
            background: initialData.colorScheme?.ui?.hero?.background || 'linear-gradient(135deg, #70843d 0%, #7bd63c 100%)',
            text: initialData.colorScheme?.ui?.hero?.text || '#ffffff',
            overlay: initialData.colorScheme?.ui?.hero?.overlay || 'rgba(0, 0, 0, 0.1)'
          },
          pagination: {
            background: initialData.colorScheme?.ui?.pagination?.background || '#ffffff',
            text: initialData.colorScheme?.ui?.pagination?.text || '#374151',
            hover: initialData.colorScheme?.ui?.pagination?.hover || '#f3f4f6',
            active: initialData.colorScheme?.ui?.pagination?.active || '#70843d',
            border: initialData.colorScheme?.ui?.pagination?.border || '#d1d5db'
          },
          loading: {
            spinner: initialData.colorScheme?.ui?.loading?.spinner || '#70843d',
            background: initialData.colorScheme?.ui?.loading?.background || '#f9fafb',
            text: initialData.colorScheme?.ui?.loading?.text || '#6b7280'
          },
          alert: {
            info: initialData.colorScheme?.ui?.alert?.info || '#3b82f6',
            warning: initialData.colorScheme?.ui?.alert?.warning || '#f59e0b',
            error: initialData.colorScheme?.ui?.alert?.error || '#ef4444',
            success: initialData.colorScheme?.ui?.alert?.success || '#22c55e'
          }
        }
      });
    }
  }, [initialData]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate color palettes from base colors
    const primaryPalette = generateColorPalette(formData.primaryColor);
    const secondaryPalette = generateColorPalette(formData.secondaryColor);

    // Create comprehensive color scheme
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
      },
      ui: formData.ui
    };

    const themeData = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description,
      colorScheme,
      isDefault: formData.isDefault,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onSave(themeData);
  };

  const updateUIColor = (category: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        [category]: {
          ...prev.ui[category as keyof typeof prev.ui],
          [key]: value
        }
      }
    }));
  };

  const ColorInput = ({ label, value, onChange, description }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
    description?: string; 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'colors', label: 'Brand Colors', icon: '🎨' },
    { id: 'badges', label: 'Badges & Status', icon: '🏷️' },
    { id: 'forms', label: 'Forms & Inputs', icon: '📝' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' },
    { id: 'cards', label: 'Cards & Layout', icon: '🃏' },
    { id: 'alerts', label: 'Alerts & Messages', icon: '⚠️' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
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
                placeholder="modern, dark, professional (comma separated)"
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
        )}

        {/* Brand Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput
                label="Primary Color *"
                value={formData.primaryColor}
                onChange={(value) => setFormData(prev => ({ ...prev, primaryColor: value }))}
                description="Main brand color for buttons, links, etc."
              />
              <ColorInput
                label="Secondary Color *"
                value={formData.secondaryColor}
                onChange={(value) => setFormData(prev => ({ ...prev, secondaryColor: value }))}
                description="Accent color for highlights and gradients"
              />
            </div>

            {/* Color Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Color Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)` 
                  }}
                >
                  Primary Gradient
                </div>
                <div 
                  className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  Primary Solid
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges & Status Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ColorInput
                label="Sale Badge"
                value={formData.ui.badge.sale}
                onChange={(value) => updateUIColor('badge', 'sale', value)}
                description="Color for sale/discount badges"
              />
              <ColorInput
                label="Featured Badge"
                value={formData.ui.badge.featured}
                onChange={(value) => updateUIColor('badge', 'featured', value)}
                description="Color for featured product badges"
              />
              <ColorInput
                label="New Badge"
                value={formData.ui.badge.new}
                onChange={(value) => updateUIColor('badge', 'new', value)}
                description="Color for new product badges"
              />
              <ColorInput
                label="In Stock"
                value={formData.ui.status.inStock}
                onChange={(value) => updateUIColor('status', 'inStock', value)}
                description="Color for in-stock status"
              />
              <ColorInput
                label="Out of Stock"
                value={formData.ui.status.outOfStock}
                onChange={(value) => updateUIColor('status', 'outOfStock', value)}
                description="Color for out-of-stock status"
              />
              <ColorInput
                label="Low Stock"
                value={formData.ui.status.lowStock}
                onChange={(value) => updateUIColor('status', 'lowStock', value)}
                description="Color for low stock warnings"
              />
            </div>
          </div>
        )}

        {/* Forms & Inputs Tab */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ColorInput
                label="Input Background"
                value={formData.ui.form.inputBackground}
                onChange={(value) => updateUIColor('form', 'inputBackground', value)}
                description="Background color for form inputs"
              />
              <ColorInput
                label="Input Border"
                value={formData.ui.form.inputBorder}
                onChange={(value) => updateUIColor('form', 'inputBorder', value)}
                description="Border color for form inputs"
              />
              <ColorInput
                label="Input Focus"
                value={formData.ui.form.inputFocus}
                onChange={(value) => updateUIColor('form', 'inputFocus', value)}
                description="Focus color for form inputs"
              />
              <ColorInput
                label="Label Text"
                value={formData.ui.form.label}
                onChange={(value) => updateUIColor('form', 'label', value)}
                description="Color for form labels"
              />
              <ColorInput
                label="Placeholder Text"
                value={formData.ui.form.placeholder}
                onChange={(value) => updateUIColor('form', 'placeholder', value)}
                description="Color for placeholder text"
              />
              <ColorInput
                label="Error Text"
                value={formData.ui.form.error}
                onChange={(value) => updateUIColor('form', 'error', value)}
                description="Color for error messages"
              />
            </div>
          </div>
        )}

        {/* Navigation Tab */}
        {activeTab === 'navigation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ColorInput
                label="Nav Background"
                value={formData.ui.nav.background}
                onChange={(value) => updateUIColor('nav', 'background', value)}
                description="Background color for navigation"
              />
              <ColorInput
                label="Nav Text"
                value={formData.ui.nav.text}
                onChange={(value) => updateUIColor('nav', 'text', value)}
                description="Text color for navigation items"
              />
              <ColorInput
                label="Nav Hover"
                value={formData.ui.nav.hover}
                onChange={(value) => updateUIColor('nav', 'hover', value)}
                description="Hover color for navigation items"
              />
              <ColorInput
                label="Nav Active"
                value={formData.ui.nav.active}
                onChange={(value) => updateUIColor('nav', 'active', value)}
                description="Active color for navigation items"
              />
              <ColorInput
                label="Nav Border"
                value={formData.ui.nav.border}
                onChange={(value) => updateUIColor('nav', 'border', value)}
                description="Border color for navigation"
              />
            </div>
          </div>
        )}

        {/* Cards & Layout Tab */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ColorInput
                label="Card Background"
                value={formData.ui.card.background}
                onChange={(value) => updateUIColor('card', 'background', value)}
                description="Background color for cards"
              />
              <ColorInput
                label="Card Border"
                value={formData.ui.card.border}
                onChange={(value) => updateUIColor('card', 'border', value)}
                description="Border color for cards"
              />
              <ColorInput
                label="Hero Background"
                value={formData.ui.hero.background}
                onChange={(value) => updateUIColor('hero', 'background', value)}
                description="Background for hero sections"
              />
              <ColorInput
                label="Hero Text"
                value={formData.ui.hero.text}
                onChange={(value) => updateUIColor('hero', 'text', value)}
                description="Text color for hero sections"
              />
              <ColorInput
                label="Footer Background"
                value={formData.ui.footer.background}
                onChange={(value) => updateUIColor('footer', 'background', value)}
                description="Background color for footer"
              />
              <ColorInput
                label="Footer Text"
                value={formData.ui.footer.text}
                onChange={(value) => updateUIColor('footer', 'text', value)}
                description="Text color for footer"
              />
            </div>
          </div>
        )}

        {/* Alerts & Messages Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ColorInput
                label="Info Alert"
                value={formData.ui.alert.info}
                onChange={(value) => updateUIColor('alert', 'info', value)}
                description="Color for info alerts"
              />
              <ColorInput
                label="Warning Alert"
                value={formData.ui.alert.warning}
                onChange={(value) => updateUIColor('alert', 'warning', value)}
                description="Color for warning alerts"
              />
              <ColorInput
                label="Error Alert"
                value={formData.ui.alert.error}
                onChange={(value) => updateUIColor('alert', 'error', value)}
                description="Color for error alerts"
              />
              <ColorInput
                label="Success Alert"
                value={formData.ui.alert.success}
                onChange={(value) => updateUIColor('alert', 'success', value)}
                description="Color for success alerts"
              />
              <ColorInput
                label="Rating Filled"
                value={formData.ui.rating.filled}
                onChange={(value) => updateUIColor('rating', 'filled', value)}
                description="Color for filled rating stars"
              />
              <ColorInput
                label="Rating Empty"
                value={formData.ui.rating.empty}
                onChange={(value) => updateUIColor('rating', 'empty', value)}
                description="Color for empty rating stars"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </form>
    </div>
  );
}
