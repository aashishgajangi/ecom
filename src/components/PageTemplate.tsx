'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import StructuredContentRenderer from './StructuredContentRenderer';

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'features' | 'contact' | 'cta';
  content: Record<string, unknown>;
  order: number;
}

interface PageTemplateProps {
  title: string;
  content: string;
  template?: 'default' | 'hero' | 'centered' | 'wide';
  showHero?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  className?: string;
  structuredContent?: PageSection[];
}

const PageTemplate = ({
  title,
  content,
  template = 'default',
  showHero = false,
  heroTitle,
  heroSubtitle,
  className = '',
  structuredContent
}: PageTemplateProps) => {
  
  const renderHero = () => {
    if (!showHero) return null;
    
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">
                {heroTitle || title}
              </span>
            </h1>
            {heroSubtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderContent = () => {
    // If structured content exists, use it instead of markdown
    if (structuredContent && structuredContent.length > 0) {
      return <StructuredContentRenderer sections={structuredContent} />;
    }

    // Fallback to traditional markdown rendering
    switch (template) {
      case 'hero':
        return (
          <>
            {renderHero()}
            <section className="py-16">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
        
      case 'centered':
        return (
          <section className="py-16 md:py-24">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto text-center">
                {!showHero && (
                  <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
                    {title}
                  </h1>
                )}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </section>
        );
        
      case 'wide':
        return (
          <section className="py-16 md:py-24">
            <div className="container-custom">
              <div className="max-w-7xl mx-auto">
                {!showHero && (
                  <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text text-center">
                    {title}
                  </h1>
                )}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </section>
        );
        
      default:
        return (
          <section className="py-16 md:py-24">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                {!showHero && (
                  <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
                    {title}
                  </h1>
                )}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className={className}>
      {showHero && renderHero()}
      {renderContent()}
    </div>
  );
};

export default PageTemplate;
