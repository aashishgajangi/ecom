'use client';

import Link from 'next/link';

interface ServiceArea {
  name: string;
  slug: string;
  priority: boolean;
}

interface ServiceAreasProps {
  title?: string;
  subtitle?: string;
  serviceAreas?: ServiceArea[];
  ctaText?: string;
  ctaLink?: string;
}

const defaultServiceAreas: ServiceArea[] = [
  { name: 'Borivali', slug: 'borivali', priority: true },
  { name: 'Dahisar', slug: 'dahisar', priority: true },
  { name: 'Malad', slug: 'malad', priority: false },
  { name: 'Goregaon', slug: 'goregaon', priority: false },
  { name: 'Mira Road', slug: 'mira-road', priority: false },
  { name: 'Andheri', slug: 'andheri', priority: false },
  { name: 'Bandra', slug: 'bandra', priority: false }
];

const ServiceAreas = ({
  title = "Our Service Areas",
  subtitle = "Premium quality products available across all major areas with free delivery.",
  serviceAreas = defaultServiceAreas,
  ctaText = "Get Products in Your Area",
  ctaLink = "/mumbai/borivali"
}: ServiceAreasProps) => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 lg:mb-6">
            {title}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {serviceAreas.map((area) => (
            <Link
              key={area.slug}
              href={`/mumbai/${area.slug}`}
              className={`block p-3 md:p-4 text-center rounded-xl transition-all duration-300 ${
                area.priority 
                  ? 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                  : 'bg-gray-50 text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-100'
              }`}
              style={area.priority ? {
                background: 'var(--gradient-primary, var(--color-primary-500, #70843d))'
              } : undefined}
            >
              <h3 className="font-semibold text-sm md:text-base">
                {area.name}
              </h3>
              {area.priority && (
                <span className="text-xs opacity-90 block mt-1">
                  Priority Area
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-10 lg:mt-12">
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            Free delivery available in all areas
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#70843d] to-[#7bd63c] text-white font-semibold text-sm md:text-base rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {ctaText}
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
