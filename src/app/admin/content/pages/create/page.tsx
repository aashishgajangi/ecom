'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SEOPreview from '@/components/SEOPreview';
import RichTextEditor from '@/components/RichTextEditor';

interface PageFormData {
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  isHomepage: boolean;
  template: string;
  
  // SEO Fields
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<PageFormData>({
    slug: '',
    title: '',
    content: '',
    isPublished: false,
    isHomepage: searchParams.get('homepage') === 'true',
    template: 'default',
    
    // SEO Fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  });

  useEffect(() => {
    const pageId = searchParams.get('id');
    if (pageId) {
      setIsEditing(true);
      fetchPageData(pageId);
    }
  }, [searchParams]);

  const fetchPageData = async (pageId: string) => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`);
      if (response.ok) {
        const pageData = await response.json();
        setFormData({
          slug: pageData.page?.slug || '',
          title: pageData.page?.title || '',
          content: pageData.page?.content || '',
          isPublished: pageData.page?.isPublished || false,
          isHomepage: pageData.page?.isHomepage || false,
          template: pageData.page?.template || 'default',
          metaTitle: pageData.page?.metaTitle || '',
          metaDescription: pageData.page?.metaDescription || '',
          metaKeywords: pageData.page?.metaKeywords || '',
          focusKeyword: pageData.page?.focusKeyword || '',
          canonicalUrl: pageData.page?.canonicalUrl || '',
          ogTitle: pageData.page?.ogTitle || '',
          ogDescription: pageData.page?.ogDescription || '',
          ogImage: pageData.page?.ogImage || '',
          twitterTitle: pageData.page?.twitterTitle || '',
          twitterDescription: pageData.page?.twitterDescription || '',
          twitterImage: pageData.page?.twitterImage || ''
        });
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      setError('Failed to load page data');
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }
  }, [status, router]);

  const handleInputChange = (field: keyof PageFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const pageId = searchParams.get('id');
    const url = pageId ? `/api/admin/pages/${pageId}` : '/api/admin/pages';
    const method = pageId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(pageId ? 'Page updated successfully!' : 'Page created successfully!');
        
        // Redirect to pages list after successful operation
        setTimeout(() => {
          router.push('/admin/content/pages');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || (pageId ? 'Failed to update page' : 'Failed to create page'));
      }
    } catch (error) {
      console.error('Error:', error);
      setError(pageId ? 'Failed to update page' : 'Failed to create page');
    } finally {
      setLoading(false);
    }
  };

  const generateSlugFromTitle = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    handleInputChange('slug', slug);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">
                {isEditing ? 'Edit Page' : (formData.isHomepage ? 'Create Homepage' : 'Create New Page')}
              </h1>
            </div>
            <Link
              href="/admin/content/pages"
              className="text-primary-start hover:text-primary-end transition-colors"
            >
              Back to Pages
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                  <button
                    type="button"
                    onClick={generateSlugFromTitle}
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Generate from title
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="page-slug"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL: /{formData.slug || 'page-slug'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={formData.template}
                  onChange={(e) => handleInputChange('template', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Default Template</option>
                  <option value="home">Homepage Template</option>
                  <option value="contact">Contact Template</option>
                  <option value="about">About Template</option>
                  <option value="landing">Landing Page Template</option>
                </select>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Published</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isHomepage}
                    onChange={(e) => handleInputChange('isHomepage', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Set as Homepage</span>
                </label>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Page Content</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (Markdown supported with rich text editor)
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Enter your page content here..."
            />
          </div>

          {/* SEO Metadata */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">SEO Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meta title for search engines"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={formData.focusKeyword}
                  onChange={(e) => handleInputChange('focusKeyword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Primary keyword for this page"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description for search engines (120-160 characters)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="comma, separated, keywords"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={formData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/canonical-url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph Image
                </label>
                <input
                  type="url"
                  value={formData.ogImage}
                  onChange={(e) => handleInputChange('ogImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </div>

          {/* SEO Preview */}
          <div className="mb-8">
            <SEOPreview
              title={formData.title}
              description={formData.metaDescription || formData.content.substring(0, 160)}
              url={formData.slug}
              metaTitle={formData.metaTitle}
              metaDescription={formData.metaDescription}
              focusKeyword={formData.focusKeyword}
            />
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Page' : 'Create Page')}
            </button>
            <Link
              href="/admin/content/pages"
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleInputChange('isPublished', true)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save & Publish
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Creating Effective Pages</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Use descriptive titles that clearly indicate the page content</li>
            <li>• Keep slugs short, descriptive, and URL-friendly</li>
            <li>• Only one page can be set as the homepage at a time</li>
            <li>• Choose appropriate templates for different page types</li>
            <li>• Add SEO metadata to improve search engine visibility</li>
          </ul>
        </div>

        {/* Image Format Guidelines */}
        <div className="mt-6 bg-green-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Image Format Guidelines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">WEBP</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Excellent</li>
                <li>• Size: Very Small</li>
                <li>• Best for: All image types</li>
                <li>• Browser support: Modern browsers</li>
                <li>• Recommended: ✅ Primary choice</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">PNG</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Excellent</li>
                <li>• Size: Large</li>
                <li>• Best for: Transparency, logos</li>
                <li>• Browser support: Universal</li>
                <li>• Recommended: ✅ When transparency needed</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">JPG/JPEG</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Good</li>
                <li>• Size: Medium</li>
                <li>• Best for: Photographs</li>
                <li>• Browser support: Universal</li>
                <li>• Recommended: ✅ For photos only</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">SVG</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Vector (infinite)</li>
                <li>• Size: Very Small</li>
                <li>• Best for: Icons, logos, illustrations</li>
                <li>• Browser support: Universal</li>
                <li>• Recommended: ✅ For vector graphics</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">GIF</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Poor</li>
                <li>• Size: Variable</li>
                <li>• Best for: Simple animations</li>
                <li>• Browser support: Universal</li>
                <li>• Recommended: ❌ Avoid for static images</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">General Tips</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Max file size: 5MB</li>
                <li>• Optimal width: 1200px max</li>
                <li>• Compress images before upload</li>
                <li>• Use descriptive filenames</li>
                <li>• Add alt text for accessibility</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
            <h4 className="font-semibold text-yellow-800 mb-2">Best Practices</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use WEBP format for best performance and quality</li>
              <li>• Convert existing images to WEBP for better compression</li>
              <li>• Use PNG only when transparency is required</li>
              <li>• Use JPG for photographic content with compression</li>
              <li>• Use SVG for scalable vector graphics</li>
              <li>• Avoid GIF for static images - use PNG or WEBP instead</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
