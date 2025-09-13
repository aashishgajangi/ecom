'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Theme } from '@/types/theme';
import ThemeEditor from '@/components/ThemeEditor';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default function EditThemePage({ params }: RouteParams) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);

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

  const handleSave = async (themeData: any) => {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/themes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(themeData),
      });

      if (response.ok) {
        router.push('/admin/themes');
      } else {
        const error = await response.json();
        console.error('Theme update error:', error);
        alert(error.error || 'Failed to update theme');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      alert('Failed to update theme');
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Theme not found</h1>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ThemeEditor 
            initialData={theme}
            onSave={handleSave}
            loading={saving}
          />
        </div>
      </main>
    </div>
  );
}