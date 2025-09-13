'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'features' | 'contact' | 'cta';
  content: Record<string, unknown>;
  order: number;
}

interface StructuredContentRendererProps {
  sections: PageSection[];
}

const StructuredContentRenderer = ({ sections }: StructuredContentRendererProps) => {
  const sortedSections = sections.sort((a, b) => a.order - b.order);

  const getIconSvg = (iconName: string) => {
    switch (iconName) {
      case 'check-circle':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      case 'star':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        );
      case 'shield-check':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        );
      case 'heart':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        );
      case 'clock':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      default:
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
    }
  };

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <section 
            key={section.id} 
            className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
            style={section.content.backgroundImage ? {
              backgroundImage: `url(${section.content.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            {Boolean(section.content.backgroundImage) && (
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            )}
            <div className="container-custom relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                  section.content.backgroundImage ? 'text-white' : ''
                }`}>
                  <span className={section.content.backgroundImage ? 'text-white' : 'gradient-text'}>
                    {String(section.content.title || '')}
                  </span>
                </h1>
                {Boolean(section.content.subtitle) && (
                  <p className={`text-xl max-w-3xl mx-auto mb-8 ${
                    section.content.backgroundImage ? 'text-gray-100' : 'text-gray-600'
                  }`}>
                    {String(section.content.subtitle || '')}
                  </p>
                )}
                {Boolean(section.content.ctaText) && Boolean(section.content.ctaLink) && (
                  <Link 
                    href={String(section.content.ctaLink || '')}
                    className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 text-white font-semibold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ 
                      background: 'var(--gradient-button, linear-gradient(to right, #70843d, #7bd63c))'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--gradient-accent, linear-gradient(to right, #7bd63c, #70843d))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--gradient-button, linear-gradient(to right, #70843d, #7bd63c))';
                    }}
                  >
                    {String(section.content.ctaText || '')}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </section>
        );

      case 'text':
        return (
          <section key={section.id} className="py-16">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                {Boolean(section.content.title) && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text text-center">
                    {String(section.content.title || '')}
                  </h2>
                )}
                {Boolean(section.content.text) && (
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {String(section.content.text || '').split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'image':
        return (
          <section key={section.id} className="py-16">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto text-center">
                {Boolean(section.content.imageUrl) && (
                  <div className="relative w-full h-96 mb-6">
                    <Image
                      src={String(section.content.imageUrl || '')}
                      alt={String(section.content.alt || '')}
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
                {Boolean(section.content.caption) && (
                  <p className="text-gray-600 italic">
                    {String(section.content.caption || '')}
                  </p>
                )}
              </div>
            </div>
          </section>
        );

      case 'features':
        return (
          <section key={section.id} className="py-16 bg-gray-50">
            <div className="container-custom">
              <div className="text-center mb-12">
                {Boolean(section.content.title) && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {String(section.content.title || '')}
                  </h2>
                )}
                {Boolean(section.content.subtitle) && (
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {String(section.content.subtitle || '')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.content.features as Array<Record<string, unknown>> || []).map((feature: Record<string, unknown>, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {getIconSvg(String(feature.icon || 'check-circle'))}
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {String(feature.title || '')}
                    </h3>
                    <p className="text-gray-600">
                      {String(feature.description || '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={section.id} className="py-16 bg-gray-50">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto text-center">
                {Boolean(section.content.title) && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {String(section.content.title || '')}
                  </h2>
                )}
                {Boolean(section.content.subtitle) && (
                  <p className="text-gray-600 mb-8">
                    {String(section.content.subtitle || '')}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {Boolean(section.content.email) && (
                    <div className="space-y-2">
                      <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">{String(section.content.email || '')}</p>
                    </div>
                  )}
                  
                  {Boolean(section.content.phone) && (
                    <div className="space-y-2">
                      <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">{String(section.content.phone || '')}</p>
                    </div>
                  )}
                  
                  {Boolean(section.content.address) && (
                    <div className="space-y-2">
                      <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-600">{String(section.content.address || '')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section 
            key={section.id} 
            className="py-16"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-50, rgba(112, 132, 61, 0.1)), var(--color-secondary-50, rgba(123, 214, 60, 0.1)))'
            }}
          >
            <div className="container-custom">
              <div className="max-w-4xl mx-auto text-center">
                {Boolean(section.content.title) && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {String(section.content.title || '')}
                  </h2>
                )}
                {Boolean(section.content.subtitle) && (
                  <p className="text-gray-600 mb-8 text-xl">
                    {String(section.content.subtitle || '')}
                  </p>
                )}
                {Boolean(section.content.buttonText) && Boolean(section.content.buttonLink) && (
                  <Link 
                    href={String(section.content.buttonLink || '')}
                    className="inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ 
                      background: 'var(--gradient-button, linear-gradient(to right, #70843d, #7bd63c))'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--gradient-accent, linear-gradient(to right, #7bd63c, #70843d))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--gradient-button, linear-gradient(to right, #70843d, #7bd63c))';
                    }}
                  >
                    {String(section.content.buttonText || '')}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {sortedSections.map(renderSection)}
    </div>
  );
};

export default StructuredContentRenderer;
