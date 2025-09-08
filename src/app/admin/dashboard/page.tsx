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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
      return;
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

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
          published: pages.filter((p: any) => p.isPublished).length,
          draft: pages.filter((p: any) => !p.isPublished).length,
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Magento Style */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <nav className="hidden md:flex space-x-4">
                <Link href="/admin/dashboard" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                  Dashboard
                </Link>
                <Link href="/admin/content" className="text-gray-600 hover:text-blue-600">
                  Content
                </Link>
                <Link href="/admin/backup" className="text-gray-600 hover:text-blue-600">
                  Backup
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">Welcome, Admin</span>
              <Link
                href="/admin/profile"
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-6">
        {/* Stats Overview - Magento Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Pages</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Published</h3>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Drafts</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Backups</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.backups}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h2m-8 0h2m-2 0h2m-8 0h2m-2 0h2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Content Management */}
          <div className="bg-white border border-gray-200 rounded shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Content Management
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/admin/content/pages"
                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <span>Manage Pages</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/admin/content/pages/create"
                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <span>Create New Page</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white border border-gray-200 rounded shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuration
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/admin/content/header"
                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <span>Header Settings</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/admin/content/footer"
                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <span>Footer Settings</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/admin/content/navigation"
                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <span>Navigation Menu</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="bg-white border border-gray-200 rounded shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/admin/backup"
              className="flex flex-col items-center p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-center"
            >
              <svg className="w-6 h-6 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h2m-8 0h2m-2 0h2m-8 0h2m-2 0h2" />
              </svg>
              <span className="text-sm font-medium">Backup</span>
            </Link>
            <Link
              href="/admin/content/import-export"
              className="flex flex-col items-center p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-center"
            >
              <svg className="w-6 h-6 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm font-medium">Import/Export</span>
            </Link>
            <Link
              href="http://localhost:5555"
              target="_blank"
              className="flex flex-col items-center p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-center"
            >
              <svg className="w-6 h-6 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <span className="text-sm font-medium">Database</span>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white border border-gray-200 rounded shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Total Pages:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Backups:</span>
              <span className="font-medium">{stats.backups}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Online</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Storage:</span>
              <span className="font-medium">~{Math.round(stats.total * 0.5)} KB</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
