'use client';

import { useState, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');

  const handleFormat = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newValue = value;
    let newSelectionStart = start;
    let newSelectionEnd = end;

    switch (format) {
      case 'bold':
        newValue = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newSelectionStart = start + 2;
        newSelectionEnd = end + 2;
        break;
      case 'italic':
        newValue = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        newSelectionStart = start + 1;
        newSelectionEnd = end + 1;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newValue = value.substring(0, start) + `[${selectedText}](${url})` + value.substring(end);
          newSelectionStart = start + selectedText.length + 2 + url.length + 1;
          newSelectionEnd = newSelectionStart;
        }
        break;
      case 'image':
        setShowMediaModal(true);
        loadMediaLibrary();
        return;
      case 'h1':
        newValue = value.substring(0, start) + `# ${selectedText}` + value.substring(end);
        newSelectionStart = start + 2;
        newSelectionEnd = end + 2;
        break;
      case 'h2':
        newValue = value.substring(0, start) + `## ${selectedText}` + value.substring(end);
        newSelectionStart = start + 3;
        newSelectionEnd = end + 3;
        break;
      case 'h3':
        newValue = value.substring(0, start) + `### ${selectedText}` + value.substring(end);
        newSelectionStart = start + 4;
        newSelectionEnd = end + 4;
        break;
      case 'ul':
        const lines = selectedText.split('\n');
        const bulleted = lines.map(line => line ? `- ${line}` : '').join('\n');
        newValue = value.substring(0, start) + bulleted + value.substring(end);
        newSelectionStart = start;
        newSelectionEnd = end + (lines.length * 2);
        break;
      case 'ol':
        const numberedLines = selectedText.split('\n');
        const numbered = numberedLines.map((line, index) => line ? `${index + 1}. ${line}` : '').join('\n');
        newValue = value.substring(0, start) + numbered + value.substring(end);
        newSelectionStart = start;
        newSelectionEnd = end + (numberedLines.length * 3);
        break;
    }

    onChange(newValue);
    
    // Set selection after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newSelectionStart;
        textareaRef.current.selectionEnd = newSelectionEnd;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const loadMediaLibrary = async () => {
    setLoadingMedia(true);
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMediaLibrary(result.files || []);
        }
      }
    } catch (error) {
      console.error('Error loading media library:', error);
    } finally {
      setLoadingMedia(false);
    }
  };

  const insertImageFromLibrary = (imageUrl: string, altText: string = '') => {
    const imageMarkdown = `![${altText}](${imageUrl})`;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + imageMarkdown + value.substring(end);
      onChange(newValue);
      
      // Set cursor after image
      setTimeout(() => {
        textarea.selectionStart = start + imageMarkdown.length;
        textarea.selectionEnd = start + imageMarkdown.length;
        textarea.focus();
      }, 0);
    }
    setShowMediaModal(false);
  };

  const handleMediaUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const imageMarkdown = `![${file.name}](${result.file.url})`;
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + imageMarkdown + value.substring(end);
            onChange(newValue);
            
            // Set cursor after image
            setTimeout(() => {
              textarea.selectionStart = start + imageMarkdown.length;
              textarea.selectionEnd = start + imageMarkdown.length;
              textarea.focus();
            }, 0);
          }
        }
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
      setShowMediaModal(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleMediaUpload(file);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('link')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => handleFormat('image')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Insert Image"
        >
          🖼️
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => handleFormat('h1')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => handleFormat('h2')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleFormat('h3')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => handleFormat('ul')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => handleFormat('ol')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="w-full px-3 py-2 border-0 focus:outline-none focus:ring-0 resize-none"
      />

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Insert Image</h3>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload New
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'library'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Media Library
              </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="flex-1 overflow-auto">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={uploading}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Image Guidelines</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Use WEBP for best performance</li>
                    <li>• Use PNG for transparency</li>
                    <li>• Max file size: 5MB</li>
                    <li>• Recommended: 1200px width max</li>
                  </ul>
                </div>

                {uploading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                  </div>
                )}
              </div>
            )}

            {/* Media Library Tab */}
            {activeTab === 'library' && (
              <div className="flex-1 overflow-auto">
                {loadingMedia ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading media library...</p>
                  </div>
                ) : mediaLibrary.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No media files found.</p>
                    <p className="text-sm mt-1">Upload some images to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaLibrary.map((media) => (
                      <div
                        key={media.id}
                        className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => insertImageFromLibrary(media.url, media.originalName)}
                      >
                        <img
                          src={media.url}
                          alt={media.originalName}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{media.originalName}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(media.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
