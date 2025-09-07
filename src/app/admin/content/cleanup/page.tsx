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

export default function ContentCleanup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

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

  const togglePageSelection = (pageId: string) => {
    setSelectedPages(prev =>
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const selectAll = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(pages.map(page => page.id));
    }
  };

  const deleteSelectedPages = async () => {
    if (selectedPages.length === 0) {
      alert('Please select pages to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedPages.length} page(s)? This action cannot be undone.`)) {
      return;
    }

    setCleaning(true);

    try {
      const deletePromises = selectedPages.map(pageId =>
        fetch(`/api/admin/pages/${pageId}`, { method: 'DELETE' })
      );

      const results = await Promise.allSettled(deletePromises);
      
      let successCount = 0;
      let errorCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.ok) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to delete page ${selectedPages[index]}`);
        }
      });

      if (successCount > 0) {
        alert(`Successfully deleted ${successCount} page(s).${errorCount > 0 ? ` Failed to delete ${errorCount} page(s).` : ''}`);
        setSelectedPages([]);
        fetchPages(); // Refresh the list
      } else {
        alert('Failed to delete pages. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting pages:', error);
      alert('Failed to delete pages');
    } finally {
      setCleaning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getEmptyPages = () => {
    return pages.filter(page => !page.content || page.content.trim().length < 10);
  };

  const getOldDrafts = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return pages.filter(page => 
      !page.isPublished && new Date(page.updatedAt) < thirtyDaysAgo
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const emptyPages = getEmptyPages();
  const oldDrafts = getOldDrafts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Cleanup</h1>
          <Link
            href="/admin/content/pages"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Pages
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Total Pages</h3>
            <p className="text-3xl font-bold text-blue-600">{pages.length}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Empty Pages</h3>
            <p className="text-3xl font-bold text-yellow-600">{emptyPages.length}</p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-orange-800 mb-2">Old Drafts</h3>
            <p className="text-3xl font-bold text-orange-600">{oldDrafts.length}</p>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedPages.length === pages.length && pages.length > 0}
                onChange={selectAll}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                {selectedPages.length} of {pages.length} pages selected
              </span>
            </div>
            
            {selectedPages.length > 0 && (
              <button
                onClick={deleteSelectedPages}
                disabled={cleaning}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {cleaning ? 'Deleting...' : `Delete Selected (${selectedPages.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">All Pages</h2>
          
          {pages.length === 0 ? (
            <p className="text-gray-500">No pages found.</p>
          ) : (
            <div className="space-y-3">
              {pages.map((page) => {
                const isEmpty = !page.content || page.content.trim().length < 10;
                const isOldDraft = !page.isPublished && new Date(page.updatedAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                
                return (
                  <div
                    key={page.id}
                    className={`p-4 border rounded-lg ${
                      selectedPages.includes(page.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    } ${isEmpty ? 'bg-yellow-50 border-yellow-200' : ''} ${
                      isOldDraft ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={() => togglePageSelection(page.id)}
                        className="h-4 w-4 text-blue-600 mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{page.title}</h3>
                            <p className="text-sm text-gray-600">/{page.slug}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Updated: {formatDate(page.updatedAt)} • 
                              Status: <span className={page.isPublished ? 'text-green-600' : 'text-yellow-600'}>
                                {page.isPublished ? 'Published' : 'Draft'}
                              </span>
                              {isEmpty && <span className="ml-2 text-yellow-600">• Empty Content</span>}
                              {isOldDraft && <span className="ml-2 text-orange-600">• Old Draft</span>}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/content/pages`}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => togglePageSelection(page.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              {selectedPages.includes(page.id) ? 'Deselect' : 'Select'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Cleanup Tips</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• <strong>Empty Pages</strong> (yellow background) have little or no content</li>
            <li>• <strong>Old Drafts</strong> (orange background) are unpublished pages older than 30 days</li>
            <li>• Select pages using checkboxes or the "Select" button</li>
            <li>• Use "Select All" to choose all pages for bulk operations</li>
            <li>• Always review pages before deleting - this action cannot be undone</li>
            <li>• Consider exporting important content before cleanup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
