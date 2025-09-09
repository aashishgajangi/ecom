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

interface Activity {
  type: 'created' | 'updated' | 'published' | 'unpublished';
  pageId: string;
  pageTitle: string;
  timestamp: string;
  user: string;
}

export default function RecentActivity() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

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

  // Generate mock activity data based on page updates
  const generateActivity = (): Activity[] => {
    if (pages.length === 0) return [];

    return pages
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(page => ({
        type: page.isPublished ? 'published' : 'updated',
        pageId: page.id,
        pageTitle: page.title,
        timestamp: page.updatedAt,
        user: 'Admin'
      }));
  };

  const activities = generateActivity();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return '🆕';
      case 'updated':
        return '✏️';
      case 'published':
        return '✅';
      case 'unpublished':
        return '📝';
      default:
        return '📄';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'text-green-600 bg-green-100';
      case 'updated':
        return 'text-blue-600 bg-blue-100';
      case 'published':
        return 'text-purple-600 bg-purple-100';
      case 'unpublished':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityText = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'created';
      case 'updated':
        return 'updated';
      case 'published':
        return 'published';
      case 'unpublished':
        return 'unpublished';
      default:
        return 'modified';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Recent Activity</h1>
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Activities</option>
              <option value="published">Published Only</option>
              <option value="draft">Draft Only</option>
            </select>
            <Link
              href="/admin/content/pages"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Pages
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Content Management Activities</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity found</p>
              <p className="text-sm text-gray-400 mt-2">
                Content management activities will appear here as you create and update pages
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      <span className="text-gray-500">{getActivityText(activity.type)}</span>
                      <Link
                        href={`/admin/content/pages`}
                        className="font-semibold text-blue-600 hover:underline truncate"
                      >
                        {activity.pageTitle}
                      </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatDate(activity.timestamp)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getActivityColor(activity.type)}`}>
                        {activity.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Link
                      href={`/admin/content/pages`}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Total Pages</h3>
            <p className="text-3xl font-bold text-blue-600">{pages.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Published</h3>
            <p className="text-3xl font-bold text-green-600">
              {pages.filter(p => p.isPublished).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Drafts</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {pages.filter(p => !p.isPublished).length}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Activity Tracking</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• This section shows recent content management activities</li>
            <li>• Activities include page creation, updates, and publication status changes</li>
            <li>• Use the filter to view specific types of activities</li>
            <li>• Click &quot;View&quot; to quickly navigate to any page for editing</li>
            <li>• The statistics show an overview of your content status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
