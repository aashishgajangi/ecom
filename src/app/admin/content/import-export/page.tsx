'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ImportExport() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleImport = async () => {
    setImporting(true);
    // Simulate import process
    setTimeout(() => {
      alert('Import functionality will be implemented in a future update');
      setImporting(false);
    }, 1500);
  };

  const handleExport = async () => {
    setExporting(true);
    // Simulate export process
    setTimeout(() => {
      alert('Export functionality will be implemented in a future update');
      setExporting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import & Export Content</h1>
          <Link
            href="/admin/content/pages"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Pages
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Import Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Import Content</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your JSON file here, or click to browse
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="import-file"
                  accept=".json"
                />
                <label
                  htmlFor="import-file"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Select File
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Supported Formats</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• JSON files with page data</li>
                  <li>• CSV files for bulk operations</li>
                  <li>• WordPress XML export (future)</li>
                </ul>
              </div>

              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {importing ? 'Importing...' : 'Start Import'}
              </button>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Export Content</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Include all pages
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Include page content
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Include media references
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Include metadata
                </label>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Export Options</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• JSON format for full fidelity</li>
                  <li>• CSV format for spreadsheet use</li>
                  <li>• HTML format for documentation</li>
                  <li>• Backup format for migration</li>
                </ul>
              </div>

              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {exporting ? 'Exporting...' : 'Generate Export'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notes</h3>
          <ul className="text-yellow-700 text-sm space-y-2">
            <li>• <strong>Backup your database</strong> before importing content</li>
            <li>• Importing will overwrite existing pages with matching slugs</li>
            <li>• Large imports may take several minutes to complete</li>
            <li>• Exports include all page data but not media files</li>
            <li>• Use this feature for migration between environments</li>
            <li>• Always verify exports before deleting original content</li>
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Coming Soon</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Scheduled exports and automatic backups</li>
            <li>• Integration with cloud storage (Google Drive, Dropbox)</li>
            <li>• WordPress import/export compatibility</li>
            <li>• Bulk editing via CSV import/export</li>
            <li>• Version history and rollback capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
