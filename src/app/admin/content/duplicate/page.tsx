'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PageDuplicator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin');
      return;
    }

    fetchPages();
  }, [session, status, router]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      } else {
        console.error('Failed to fetch pages');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setSelectedPage(pageId);
      setNewSlug(`${page.slug}-copy`);
      setNewTitle(`${page.title} (Copy)`);
    }
  };

  const duplicatePage = async () => {
    if (!selectedPage) {
      alert('Please select a page to duplicate');
      return;
    }

    if (!newSlug || !newTitle) {
      alert('Please provide a slug and title for the new page');
      return;
    }

    setDuplicating(true);

    try {
      const pageToDuplicate = pages.find(p => p.id === selectedPage);
      if (!pageToDuplicate) {
        throw new Error('Selected page not found');
      }

      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: newSlug,
          title: newTitle,
          content: pageToDuplicate.content,
          isPublished: false // Keep duplicated pages as draft by default
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Page duplicated successfully! The new page has been created as a draft.`);
        router.push('/admin/content/pages');
      } else {
        const error = await response.json();
        alert(`Failed to duplicate page: ${error.error}`);
      }
    } catch (error) {
      console.error('Error duplicating page:', error);
      alert('Failed to duplicate page');
    } finally {
      setDuplicating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Page Duplicator</h1>
          <Link
            href="/admin/content/pages"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Pages
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Page to Duplicate</h2>
          
          {pages.length === 0 ? (
            <p className="text-gray-500">No pages found. <Link href="/admin/content/pages/create" className="text-blue-600 hover:underline">Create a page first</Link>.</p>
          ) : (
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPage === page.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePageSelect(page.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-600">/{page.slug}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {formatDate(page.createdAt)} • 
                        Status: <span className={page.isPublished ? 'text-green-600' : 'text-yellow-600'}>
                          {page.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedPage === page.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPage === page.id ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPage && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Duplicate Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="newSlug" className="block text-sm font-medium text-gray-700 mb-2">
                  New Slug *
                </label>
                <input
                  type="text"
                  id="newSlug"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">URL-friendly identifier for the new page</p>
              </div>

              <div>
                <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  New Title *
                </label>
                <input
                  type="text"
                  id="newTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Note</h3>
                <p className="text-yellow-700 text-sm">
                  The duplicated page will be created as a draft. You can publish it after reviewing and making any necessary changes.
                </p>
              </div>

              <button
                onClick={duplicatePage}
                disabled={duplicating || !newSlug || !newTitle}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {duplicating ? 'Duplicating...' : 'Duplicate Page'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Duplication Tips</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Use this tool to quickly create similar pages based on existing content</li>
            <li>• All content, including HTML formatting, will be copied to the new page</li>
            <li>• The new page will be created as a draft for you to review and modify</li>
            <li>• Make sure the new slug is unique and doesn't conflict with existing pages</li>
            <li>• You can modify the content after duplication in the page editor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
