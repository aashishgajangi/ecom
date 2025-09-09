'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface MediaResponse {
  success: boolean;
  files: MediaFile[];
  guidelines: Record<string, any>;
  recommendations: string[];
}

export default function MediaLibrary() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }

    if (status === 'authenticated') {
      fetchMediaFiles();
    }
  }, [status, router]);

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data: MediaResponse = await response.json();
        console.log('Media API Response:', data);
        setMediaFiles(data.files || []);
        if (data.files?.length === 0) {
          setMessage('No media files found. Upload some images to get started! 📸');
        }
      } else {
        const errorData = await response.json();
        console.error('Media API Error:', errorData);
        setMessage(`Failed to fetch media files: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      setMessage('Error fetching media files. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    setMessage('');

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        return await response.json();
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      console.log('Upload results:', results);
      setMessage(`${files.length} file(s) uploaded successfully! ✅`);
      fetchMediaFiles(); // Refresh the list
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'} ❌`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/media?id=${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('File deleted successfully! ✅');
        setMediaFiles(files => files.filter(f => f.id !== fileId));
        setSelectedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      } else {
        const error = await response.json();
        setMessage(`Delete failed: ${error.error} ❌`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Delete failed ❌');
    }
  };


  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage('URL copied to clipboard! 📋');
  };


  const filteredFiles = mediaFiles.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} selected file(s)? This action cannot be undone.`)) {
      return;
    }

    const deletePromises = Array.from(selectedFiles).map(fileId =>
      fetch(`/api/admin/media?id=${fileId}`, { method: 'DELETE' })
    );

    try {
      await Promise.all(deletePromises);
      setMessage(`${selectedFiles.size} file(s) deleted successfully! ✅`);
      fetchMediaFiles();
      setSelectedFiles(new Set());
    } catch {
      setMessage('Bulk delete failed ❌');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading media library...</p>
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
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">📸 Media Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{mediaFiles.length} files</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span className="text-blue-600">Uploading files...</span>
              </div>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <p className="text-lg font-medium text-gray-900">Drag and drop images here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  📁 Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Supported: JPEG, PNG, WebP, GIF, SVG • Max 5MB per file
                </p>
              </>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">🐛 Debug Info</h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <div><strong>Session Status:</strong> {status}</div>
              <div><strong>Session User:</strong> {session?.user?.email || 'Not logged in'}</div>
              <div><strong>User Role:</strong> {(session?.user as any)?.role || 'Unknown'}</div>
              <div><strong>Media Files Count:</strong> {mediaFiles.length}</div>
              <div><strong>Loading State:</strong> {loading ? 'Yes' : 'No'}</div>
              {mediaFiles.length > 0 && (
                <>
                  <div><strong>First File URL:</strong> {mediaFiles[0]?.url}</div>
                  <div><strong>Direct Link Test:</strong> 
                    <a href={mediaFiles[0]?.url} target="_blank" className="underline ml-1">
                      Open in new tab
                    </a>
                  </div>
                  <div className="mt-2">
                    <strong>Test Image Preview:</strong>
                    <div className="mt-1 border border-gray-300 rounded" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                      <Image 
                        src={mediaFiles[0]?.url} 
                        alt="Test"
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }}
                        onLoad={() => console.log('🎯 Debug test image loaded')}
                        onError={() => console.log('💥 Debug test image failed')}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="🔍 Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {filteredFiles.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
                    } else {
                      setSelectedFiles(new Set());
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
                Select All ({filteredFiles.length})
              </label>
            )}
          </div>
          <div className="flex items-center gap-3">
            {selectedFiles.size > 0 && (
              <>
                <span className="text-sm text-gray-500">
                  {selectedFiles.size} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  🗑️ Delete Selected
                </button>
              </>
            )}
            <button
              onClick={() => setSelectedFiles(new Set())}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Upload your first image to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-2"
              >
                {/* Selection Checkbox */}
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>

                {/* Image - Exact same approach as working test image */}
                <div 
                  className="border border-gray-300 rounded mb-2 relative" 
                  style={{ width: '100%', height: '150px', overflow: 'hidden' }}
                >
                  <Image 
                    src={file.url} 
                    alt={file.originalName}
                    fill
                    style={{ objectFit: 'cover' }}
                    onLoad={() => console.log('🎯 SIMPLE image loaded:', file.originalName)}
                    onError={() => console.log('💥 SIMPLE image failed:', file.originalName)}
                  />
                </div>

                {/* File Info */}
                <div className="text-xs">
                  <div className="font-medium truncate">{file.originalName}</div>
                  <div className="text-gray-500">{file.type.split('/')[1].toUpperCase()}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    title="Copy URL"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="flex-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guidelines */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">📖 Image Format Guidelines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">WEBP ⭐</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Excellent</li>
                <li>• Size: Very Small</li>
                <li>• Best for: All image types</li>
                <li>• Recommended: ✅ Primary choice</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">PNG</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Excellent</li>
                <li>• Size: Large</li>
                <li>• Best for: Transparency, logos</li>
                <li>• Recommended: ✅ When transparency needed</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">JPG/JPEG</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Quality: Good</li>
                <li>• Size: Medium</li>
                <li>• Best for: Photographs</li>
                <li>• Recommended: ✅ For photos only</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
