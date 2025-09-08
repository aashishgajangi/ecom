'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ContentStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  homepageExists: boolean;
  navigationItems: number;
}

export default function ContentDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<ContentStats>({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
    homepageExists: false,
    navigationItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }

    if (status === 'authenticated') {
      fetchContentStats();
    }
  }, [status, router]);

  const fetchContentStats = async () => {
    try {
      // Fetch pages
      const pagesResponse = await fetch('/api/admin/pages');
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json();
        const pages = pagesData.pages || [];
        
        // Fetch header settings for navigation count
        const headerResponse = await fetch('/api/settings/header');
        const headerSettings = headerResponse.ok ? (await headerResponse.json()).headerSettings : null;
        
        setStats({
          totalPages: pages.length,
          publishedPages: pages.filter((p: { isPublished: boolean }) => p.isPublished).length,
          draftPages: pages.filter((p: { isPublished: boolean }) => !p.isPublished).length,
          homepageExists: pages.some((p: { isHomepage: boolean }) => p.isHomepage),
          navigationItems: headerSettings?.navigation?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching content stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Content</h1>
            </div>
            <Link
              href="/admin/dashboard"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPages}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Published</h3>
            <p className="text-2xl font-bold text-green-600">{stats.publishedPages}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Drafts</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.draftPages}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Homepage</h3>
            <p className="text-2xl font-bold text-purple-600">
              {stats.homepageExists ? '✓' : '✗'}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Nav Items</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats.navigationItems}</p>
          </div>
        </div>

        {/* Content Management - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Page Management */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pages</h3>
            <div className="space-y-2">
              <Link
                href="/admin/content/homepage/edit"
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded font-medium hover:from-blue-600 hover:to-blue-700"
              >
                Edit Homepage
              </Link>
              <Link
                href="/admin/content/pages"
                className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                All Pages
              </Link>
              <Link
                href="/admin/content/pages?status=published"
                className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                Published
              </Link>
              <Link
                href="/admin/content/pages?status=draft"
                className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                Drafts
              </Link>
              <Link
                href="/admin/content/pages/create"
                className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                Create New
              </Link>
            </div>
          </div>

          {/* Media Management */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📸 Media</h3>
            <div className="space-y-2">
              <Link
                href="/admin/content/media"
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded font-medium hover:from-purple-600 hover:to-purple-700"
              >
                📸 Media Library
              </Link>
              <div className="text-xs text-gray-500 px-3">
                Upload, organize, and manage your images with drag & drop support
              </div>
            </div>
          </div>

          {/* Site Configuration */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration</h3>
            <div className="space-y-2">
              <Link
                href="/admin/content/header"
                className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                Header Settings
              </Link>
              <Link
                href="/admin/content/footer"
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded font-medium hover:from-green-600 hover:to-green-700"
              >
                🏢 Company & Footer Settings
              </Link>
              <Link
                href="/admin/content/navigation"
                className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
              >
                Site Navigation
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/admin/content/duplicate"
              className="px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50 text-center"
            >
              Duplicate
            </Link>
            <Link
              href="/admin/content/import-export"
              className="px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50 text-center"
            >
              Import/Export
            </Link>
            <Link
              href="/admin/content/cleanup"
              className="px-3 py-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50 text-center"
            >
              Cleanup
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{stats.totalPages}</div>
              <div className="text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.publishedPages}</div>
              <div className="text-gray-600">Published</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{stats.draftPages}</div>
              <div className="text-gray-600">Drafts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">{stats.navigationItems}</div>
              <div className="text-gray-600">Nav Items</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Homepage:</span>
              <span className={`font-medium ${stats.homepageExists ? 'text-green-600' : 'text-red-600'}`}>
                {stats.homepageExists ? 'Configured' : 'Not Set'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

