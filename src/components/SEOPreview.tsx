'use client';

interface SEOPreviewProps {
  title: string;
  description: string;
  url: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}

export default function SEOPreview({
  title,
  description,
  url,
  metaTitle,
  metaDescription,
  focusKeyword
}: SEOPreviewProps) {
  const displayTitle = metaTitle || title;
  const displayDescription = metaDescription || description;
  const displayUrl = url.startsWith('http') ? url : `https://example.com/${url}`;
  
  // Calculate SEO score (simplified version)
  const calculateSEOScore = () => {
    let score = 0;
    
    // Title checks
    if (displayTitle) {
      if (displayTitle.length >= 30 && displayTitle.length <= 60) score += 25;
      if (focusKeyword && displayTitle.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    }
    
    // Description checks
    if (displayDescription) {
      if (displayDescription.length >= 120 && displayDescription.length <= 160) score += 25;
      if (focusKeyword && displayDescription.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15;
    }
    
    // URL checks
    if (url && url.length <= 60) score += 10;
    if (focusKeyword && url.toLowerCase().includes(focusKeyword.toLowerCase())) score += 10;
    
    return Math.min(score, 100);
  };

  const seoScore = calculateSEOScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent SEO!';
    if (score >= 60) return 'Good, but could be better';
    return 'Needs improvement';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
        <span>SEO Preview</span>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-bold ${getScoreColor(seoScore)}`}>
            Score: {seoScore}/100
          </span>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                seoScore >= 80 ? 'bg-green-500' : 
                seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${seoScore}%` }}
            />
          </div>
        </div>
      </h3>

      <div className="mb-4 text-sm text-gray-600">
        {getScoreMessage(seoScore)}
      </div>

      {/* Google Search Result Preview */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Google Search Preview</h4>
        
        <div className="space-y-2">
          <div className="text-blue-600 text-lg font-normal hover:underline cursor-pointer line-clamp-1">
            {displayTitle || 'Page Title'}
          </div>
          
          <div className="text-green-700 text-sm">
            {displayUrl}
          </div>
          
          <div className="text-gray-800 text-sm line-clamp-2">
            {displayDescription || 'No description provided. Add a meta description to improve search results.'}
          </div>
        </div>
      </div>

      {/* SEO Recommendations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Recommendations</h4>
        
        {!metaTitle && (
          <div className="flex items-start space-x-2 text-sm text-yellow-700">
            <span>⚠️</span>
            <span>Add a custom meta title for better SEO</span>
          </div>
        )}
        
        {metaTitle && metaTitle.length < 30 && (
          <div className="flex items-start space-x-2 text-sm text-yellow-700">
            <span>⚠️</span>
            <span>Meta title is too short (aim for 30-60 characters)</span>
          </div>
        )}
        
        {metaTitle && metaTitle.length > 60 && (
          <div className="flex items-start space-x-2 text-sm text-yellow-700">
            <span>⚠️</span>
            <span>Meta title is too long (max 60 characters recommended)</span>
          </div>
        )}
        
        {!metaDescription && (
          <div className="flex items-start space-x-2 text-sm text-yellow-700">
            <span>⚠️</span>
            <span>Add a meta description for better click-through rates</span>
          </div>
        )}
        
        {metaDescription && metaDescription.length < 120 && (
          <div className="flex items-start space-x-2 text-sm text-yellow-700">
            <span>⚠️</span>
            <span>Meta description is too short (aim for 120-160 characters)</span>
          </div>
        )}
        
        {metaDescription && metaDescription.length > 160 && (
          <div className="flex items-start space-x-2 text-sm text-yellow-700">
            <span>⚠️</span>
            <span>Meta description may be truncated in search results</span>
          </div>
        )}
        
        {focusKeyword && (
          <div className="flex items-start space-x-2 text-sm text-green-700">
            <span>✅</span>
            <span>Focus keyword: &quot;{focusKeyword}&quot;</span>
          </div>
        )}
        
        {!focusKeyword && (
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <span>💡</span>
            <span>Add a focus keyword to optimize content</span>
          </div>
        )}
      </div>

      {/* Character Counts */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Title:</span>{' '}
            <span className={displayTitle.length > 60 ? 'text-red-600' : displayTitle.length < 30 ? 'text-yellow-600' : 'text-green-600'}>
              {displayTitle.length} characters
            </span>
          </div>
          <div>
            <span className="font-medium">Description:</span>{' '}
            <span className={displayDescription.length > 160 ? 'text-red-600' : displayDescription.length < 120 ? 'text-yellow-600' : 'text-green-600'}>
              {displayDescription.length} characters
            </span>
          </div>
          <div>
            <span className="font-medium">URL:</span>{' '}
            <span className={url.length > 60 ? 'text-yellow-600' : 'text-green-600'}>
              {url.length} characters
            </span>
          </div>
          <div>
            <span className="font-medium">Keyword:</span>{' '}
            <span className={focusKeyword ? 'text-green-600' : 'text-gray-400'}>
              {focusKeyword ? 'Set' : 'Not set'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
