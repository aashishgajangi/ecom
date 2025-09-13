'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Theme } from '@/types/theme';

export default function AdminThemesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
      return;
    }

    if (status === "authenticated") {
      fetchThemes();
    }
  }, [status, router]);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/admin/themes');
      if (response.ok) {
        const data = await response.json();
        setThemes(data.themes);
        setActiveTheme(data.activeTheme);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchTheme = async (themeId: string) => {
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId }),
      });

      if (response.ok) {
        const data = await response.json();
        setActiveTheme(data.activeTheme);
        window.location.reload(); // Reload to apply theme
      }
    } catch (error) {
      console.error('Error switching theme:', error);
    }
  };

  const deleteTheme = async (themeId: string, themeName: string) => {
    if (!confirm(`Are you sure you want to delete the theme "${themeName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchThemes();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete theme');
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
      alert('Failed to delete theme');
    }
  };

  const exportThemes = async () => {
    try {
      const response = await fetch('/api/admin/themes/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecom-themes-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting themes:', error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading themes...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Theme Management</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportThemes}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                📥 Export Themes
              </button>
              <Link
                href="/admin/themes/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                ✨ Create Theme
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Active Theme */}
        {activeTheme && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">🎨 Currently Active Theme</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-green-600">{activeTheme.name}</span>
                  {activeTheme.isSystem && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      System Theme
                    </span>
                  )}
                  {activeTheme.isDefault && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{activeTheme.description}</p>
              </div>
              
              {/* Color Preview */}
              <div className="flex space-x-2">
                {activeTheme.colorScheme?.primary && (
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: activeTheme.colorScheme.primary['500'] }}
                    title="Primary Color"
                  ></div>
                )}
                {activeTheme.colorScheme?.secondary && (
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: activeTheme.colorScheme.secondary['500'] }}
                    title="Secondary Color"
                  ></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Themes Grid */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Themes ({themes.length})</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`relative bg-white border-2 rounded-lg p-4 hover:shadow-md transition-all ${
                  activeTheme?.id === theme.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Theme Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{theme.description}</p>
                  </div>
                  
                  {/* Color Preview */}
                  <div className="flex space-x-1 ml-2">
                    {theme.colorScheme?.primary && (
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.colorScheme.primary['500'] }}
                      ></div>
                    )}
                    {theme.colorScheme?.secondary && (
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.colorScheme.secondary['500'] }}
                      ></div>
                    )}
                  </div>
                </div>

                {/* Theme Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {theme.isSystem && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      System
                    </span>
                  )}
                  {theme.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Default
                    </span>
                  )}
                  {activeTheme?.id === theme.id && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  )}
                  {theme.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Theme Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {activeTheme?.id !== theme.id && (
                      <button
                        onClick={() => switchTheme(theme.id)}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Activate
                      </button>
                    )}
                    <Link
                      href={`/admin/themes/${theme.id}/edit`}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Edit
                    </Link>
                  </div>
                  
                  {!theme.isSystem && (
                    <button
                      onClick={() => deleteTheme(theme.id, theme.name)}
                      className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Version and Date */}
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>v{theme.version}</span>
                  <span>{new Date(theme.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {themes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No themes found</h3>
              <p className="text-gray-600 mb-4">Create your first custom theme to get started.</p>
              <Link
                href="/admin/themes/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Create Theme
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
