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
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {serviceAreas.map((area) => (
            <Link
              key={area.slug}
              href={`/mumbai/${area.slug}`}
              className={`block p-4 text-center rounded-lg transition-all duration-300 ${
                area.priority 
                  ? 'bg-gradient-to-br from-[#70843d] to-[#7bd63c] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50'
              }`}
            >
              <h3 className="font-semibold">
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

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Free delivery available in all areas
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#70843d] to-[#7bd63c] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            {ctaText}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
