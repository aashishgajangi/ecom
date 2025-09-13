'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ThemeEditor from '@/components/ThemeEditor';

export default function CreateThemePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Create Theme - Session status:', status);
    console.log('Create Theme - Session data:', session);
  }, [session, status]);

  const handleSave = async (themeData: any) => {
    setLoading(true);

    console.log('Submitting theme data:', themeData);
    console.log('Current session:', session);
    console.log('Session status:', status);

    if (status !== 'authenticated' || !session?.user) {
      alert('You must be logged in to create themes');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/themes', {
        method: 'POST',
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
        console.error('Theme creation error:', error);
        alert(error.error || 'Failed to create theme');
      }
    } catch (error) {
      console.error('Error creating theme:', error);
      alert('Failed to create theme');
    } finally {
      setLoading(false);
    }
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
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ThemeEditor 
            onSave={handleSave}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}