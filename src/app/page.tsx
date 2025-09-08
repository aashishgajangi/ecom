'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface HomepagePage {
  id: string;
  title: string;
  content: string;
  template: string;
  metadata: Record<string, unknown>;
}

export default function Home() {
  const [homepage, setHomepage] = useState<HomepagePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepage();
  }, []);

  const fetchHomepage = async () => {
    try {
      // First try to get the homepage from pages
      const response = await fetch('/api/pages/homepage');
      if (response.ok) {
        const data = await response.json();
        if (data.page) {
          setHomepage(data.page);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to old homepage settings for backward compatibility
      const fallbackResponse = await fetch('/api/settings/homepage');
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        if (data.homepageSettings) {
          // Convert old format to new page format
          setHomepage({
            id: 'legacy-homepage',
            title: data.homepageSettings.heroTitle || 'Welcome to Nisargalahari',
            content: data.homepageSettings.heroSubtitle || 'Pure, nature-friendly products that harness the power of nature',
            template: 'home',
            metadata: {}
          });
        }
      }
    } catch (error) {
      console.error('Error fetching homepage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 bg-white rounded-lg shadow-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!homepage) {
    return (
      <div className="container-custom py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Welcome to Nisargalahari
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Pure, nature-friendly products that harness the power of nature
          </p>
          
          {/* Default services section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-start/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Ingredients</h3>
              <p className="text-gray-600">Made with pure, organic ingredients sourced from nature</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-mid/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Highest quality standards for all our natural products</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-end/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Sustainable practices that respect our environment</p>
            </div>
          </div>
          
          <div className="mt-12">
            <button className="btn-primary mr-4">
              Explore Products
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          {homepage.title}
        </h1>
        <div className="text-xl text-gray-600 mb-8 prose prose-lg max-w-none">
          <ReactMarkdown>{homepage.content}</ReactMarkdown>
        </div>
        
        {/* Render content based on template */}
        {homepage.template === 'home' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-start/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Natural Ingredients</h3>
                <p className="text-gray-600">Made with pure, organic ingredients sourced from nature</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-mid/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Highest quality standards for all our natural products</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-end/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌎</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">Sustainable practices that respect our environment</p>
              </div>
            </div>
            
            <div className="mt-12">
              <button className="btn-primary mr-4">
                Explore Products
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
