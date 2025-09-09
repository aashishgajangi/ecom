'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'features' | 'contact' | 'cta';
  content: Record<string, unknown>;
  order: number;
}

interface StructuredPageEditorProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const defaultSections: PageSection[] = [
  {
    id: 'section-1',
    type: 'text',
    content: {
      title: 'Page Title',
      text: 'Add your content here...'
    },
    order: 1
  }
];

const StructuredPageEditor = ({ 
  sections = defaultSections, 
  onChange, 
  onImageUpload 
}: StructuredPageEditorProps) => {
  const [imageUploading, setImageUploading] = useState<string | null>(null);

  const updateSection = (sectionId: string, newContent: Record<string, unknown>) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, content: { ...section.content, ...newContent } }
        : section
    );
    onChange(updatedSections);
  };

  const addSection = (type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      content: getSectionDefaultContent(type),
      order: sections.length + 1
    };
    onChange([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onChange(updatedSections);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newSections[currentIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[currentIndex]];
    
    onChange(newSections);
  };

  const handleImageUpload = async (sectionId: string, file: File) => {
    if (!onImageUpload) return;
    
    setImageUploading(sectionId);
    try {
      const imageUrl = await onImageUpload(file);
      updateSection(sectionId, { imageUrl });
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setImageUploading(null);
    }
  };

  const getSectionDefaultContent = (type: PageSection['type']) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Hero Title',
          subtitle: 'Hero subtitle text',
          backgroundImage: '',
          ctaText: 'Learn More',
          ctaLink: '#'
        };
      case 'text':
        return {
          title: 'Section Title',
          text: 'Add your content here...'
        };
      case 'image':
        return {
          imageUrl: '',
          caption: '',
          alt: 'Image description'
        };
      case 'gallery':
        return {
          title: 'Gallery Title',
          images: []
        };
      case 'features':
        return {
          title: 'Features',
          subtitle: 'Feature subtitle',
          features: [
            { title: 'Feature 1', description: 'Feature description', icon: 'check-circle' },
            { title: 'Feature 2', description: 'Feature description', icon: 'star' },
            { title: 'Feature 3', description: 'Feature description', icon: 'shield-check' }
          ]
        };
      case 'contact':
        return {
          title: 'Contact Us',
          subtitle: 'Get in touch',
          email: 'info@example.com',
          phone: '+91 1234567890',
          address: 'Your address here'
        };
      case 'cta':
        return {
          title: 'Call to Action',
          subtitle: 'Ready to get started?',
          buttonText: 'Get Started',
          buttonLink: '#'
        };
      default:
        return {};
    }
  };

  const renderSectionEditor = (section: PageSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={String(section.content.title || '')}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero title"
            />
            <textarea
              value={String(section.content.subtitle || '')}
              onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hero subtitle"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={String(section.content.ctaText || '')}
                onChange={(e) => updateSection(section.id, { ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text"
              />
              <input
                type="text"
                value={String(section.content.ctaLink || '')}
                onChange={(e) => updateSection(section.id, { ctaLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button link"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(section.id, file);
                }}
                disabled={imageUploading === section.id}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageUploading === section.id && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={String(section.content.title || '')}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section title"
            />
            <textarea
              value={String(section.content.text || '')}
              onChange={(e) => updateSection(section.id, { text: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Section content..."
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            {Boolean(section.content.imageUrl) && (
              <div className="relative w-full h-48">
                <Image
                  src={String(section.content.imageUrl)}
                  alt={String(section.content.alt || '')}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(section.id, file);
              }}
              disabled={imageUploading === section.id}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <input
              type="text"
              value={String(section.content.caption || '')}
              onChange={(e) => updateSection(section.id, { caption: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Image caption (optional)"
            />
            <input
              type="text"
              value={String(section.content.alt || '')}
              onChange={(e) => updateSection(section.id, { alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alt text for accessibility"
            />
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={String(section.content.title || '')}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Features section title"
            />
            <textarea
              value={String(section.content.subtitle || '')}
              onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Features subtitle"
            />
            <div className="space-y-3">
              <h4 className="font-medium">Features</h4>
              {(section.content.features as Array<Record<string, unknown>> || []).map((feature: Record<string, unknown>, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={String(feature.title || '')}
                      onChange={(e) => {
                        const newFeatures = [...(Array.isArray(section.content.features) ? section.content.features as Array<Record<string, unknown>> : [])];
                        newFeatures[index] = { ...feature, title: e.target.value };
                        updateSection(section.id, { features: newFeatures });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Feature title"
                    />
                    <select
                      value={String(feature.icon || '')}
                      onChange={(e) => {
                        const newFeatures = [...(Array.isArray(section.content.features) ? section.content.features as Array<Record<string, unknown>> : [])];
                        newFeatures[index] = { ...feature, icon: e.target.value };
                        updateSection(section.id, { features: newFeatures });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="check-circle">✓ Check Circle</option>
                      <option value="star">⭐ Star</option>
                      <option value="shield-check">🛡️ Shield</option>
                      <option value="heart">❤️ Heart</option>
                      <option value="clock">🕐 Clock</option>
                    </select>
                  </div>
                  <textarea
                    value={String(feature.description || '')}
                    onChange={(e) => {
                      const newFeatures = [...(Array.isArray(section.content.features) ? section.content.features as Array<Record<string, unknown>> : [])];
                      newFeatures[index] = { ...feature, description: e.target.value };
                      updateSection(section.id, { features: newFeatures });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    placeholder="Feature description"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={String(section.content.title || '')}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contact section title"
            />
            <input
              type="text"
              value={String(section.content.subtitle || '')}
              onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contact subtitle"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                value={String(section.content.email || '')}
                onChange={(e) => updateSection(section.id, { email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
              />
              <input
                type="tel"
                value={String(section.content.phone || '')}
                onChange={(e) => updateSection(section.id, { phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>
            <textarea
              value={String(section.content.address || '')}
              onChange={(e) => updateSection(section.id, { address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Address"
            />
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={String(section.content.title || '')}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CTA title"
            />
            <textarea
              value={String(section.content.subtitle || '')}
              onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CTA subtitle"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={String(section.content.buttonText || '')}
                onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button text"
              />
              <input
                type="text"
                value={String(section.content.buttonLink || '')}
                onChange={(e) => updateSection(section.id, { buttonLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Button link"
              />
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">Unknown section type</div>;
    }
  };

  const getSectionIcon = (type: PageSection['type']) => {
    switch (type) {
      case 'hero': return '🎭';
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'gallery': return '🖼️📷';
      case 'features': return '⭐';
      case 'contact': return '📞';
      case 'cta': return '🎯';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Section Buttons */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add Section</h3>
        <div className="flex flex-wrap gap-2">
          {(['hero', 'text', 'image', 'features', 'contact', 'cta'] as const).map((type) => (
            <button
              key={type}
              onClick={() => addSection(type)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {getSectionIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                {getSectionIcon(section.type)} {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => moveSection(section.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSection(section.id, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeSection(section.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
            {renderSectionEditor(section)}
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No sections added yet. Click &quot;Add Section&quot; above to get started.</p>
        </div>
      )}
    </div>
  );
};

export default StructuredPageEditor;
