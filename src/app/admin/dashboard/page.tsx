"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface PageStats {
  total: number;
  published: number;
  draft: number;
  backups: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<PageStats>({
    total: 0,
    published: 0,
    draft: 0,
    backups: 0
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (status === "unauthenticated") {
      router.push("/admin");
      return;
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router, mounted]);

  const fetchStats = async () => {
    try {
      // Fetch pages
      const pagesResponse = await fetch('/api/admin/pages');
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json();
        const pages = pagesData.pages || [];
        
        // Fetch backups  
        const backupResponse = await fetch('/api/admin/backup');
        const backups = backupResponse.ok ? (await backupResponse.json()).backups || [] : [];
        
        setStats({
          total: pages.length,
          published: pages.filter((p: { isPublished: boolean }) => p.isPublished).length,
          draft: pages.filter((p: { isPublished: boolean }) => !p.isPublished).length,
          backups: backups.length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  // Show loading state until mounted and authenticated
  if (!mounted || status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <Link
                href="/admin/profile"
                className="text-gray-500 hover:text-gray-700"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white text-sm font-medium">
                    {stats.total}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Pages</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center text-white text-sm font-medium">
                    {stats.published}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.published}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center text-white text-sm font-medium">
                    {stats.draft}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.draft}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center text-white text-sm font-medium">
                    {stats.backups}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Backups</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.backups}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Homepage Status */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">🏠 Homepage Status</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize your homepage with visual editor - Hero, Featured Product, Why Choose Us, Service Areas
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  👁️ View Live
                </Link>
                <Link
                  href="/admin/content/homepage/edit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  ✨ Edit Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">🛍️ E-commerce</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/products"
                  className="block w-full text-left px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md text-sm font-medium hover:from-green-600 hover:to-green-700"
                >
                  🛍️ Manage Products
                </Link>
                <Link
                  href="/admin/products/create"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ➕ Add New Product
                </Link>
                <Link
                  href="/admin/products/categories"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  📂 Categories & Tags
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">🏠 Homepage & Content</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/content/homepage/edit"
                  className="block w-full text-left px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-sm font-medium hover:from-blue-600 hover:to-blue-700"
                >
                  ✨ Edit Homepage
                </Link>
                <Link
                  href="/admin/content/pages/create"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ➕ Create New Page
                </Link>
                <Link
                  href="/admin/content/pages"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  📄 Manage All Pages
                </Link>
                <Link
                  href="/admin/content"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  🎨 Content Hub
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">📸 Media & Assets</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/content/media"
                  className="block w-full text-left px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-purple-600 hover:to-purple-700"
                >
                  📸 Media Library
                </Link>
                <div className="text-xs text-gray-500 px-4">
                  Upload, manage, and organize your images with drag & drop support
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">🏢 Site Settings</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/themes"
                  className="block w-full text-left px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-purple-600 hover:to-purple-700"
                >
                  🎨 Theme Management
                </Link>
                <Link
                  href="/admin/content/branding"
                  className="block w-full text-left px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-md text-sm font-medium hover:from-indigo-600 hover:to-indigo-700"
                >
                  🎨 Site Branding & Favicon
                </Link>
                <Link
                  href="/admin/content/footer"
                  className="block w-full text-left px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md text-sm font-medium hover:from-green-600 hover:to-green-700"
                >
                  🏢 Company & Footer Settings
                </Link>
                <Link
                  href="/admin/content/header"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  📋 Header & Logo Settings
                </Link>
                <Link
                  href="/admin/content/navigation"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  🧭 Navigation Menu
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Tools</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/backup"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Backup System
                </Link>
                <Link
                  href="/admin/content/cleanup"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Content Cleanup
                </Link>
                <Link
                  href="/admin/content/import-export"
                  className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Import/Export
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* New Features Announcement */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">📸</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-900">New Media Library & Visual Editors!</h3>
              <p className="mt-1 text-sm text-gray-600">
                Powerful new tools for managing your content and media:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li><strong>📸 Media Library:</strong> Drag & drop image uploads, rename, organize, and manage all your media files</li>
                <li><strong>🎭 Visual Homepage Editor:</strong> Edit hero section, featured products, and service areas</li>
                <li><strong>🏢 Company Settings:</strong> Update company name, footer, and contact information</li>
                <li><strong>🔍 SEO Preview:</strong> See how your pages will appear in Google search results</li>
              </ul>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/admin/content/media"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                >
                  📸 Try Media Library
                </Link>
                <Link
                  href="/admin/content/homepage/edit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  ✨ Edit Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
              <Link
                href="/admin/content/recent"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Recent Changes
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Pages:</span>
                  <span className="text-gray-900 font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Backups:</span>
                  <span className="text-gray-900 font-medium">{stats.backups}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
