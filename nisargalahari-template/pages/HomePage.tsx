import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Product Section */}
        <section className="py-16 bg-gradient-to-br from-primary-start/10 to-primary-end/10">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Featured Product
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the aroma and taste of our premium products, beneficial for the health of the entire family.
              </p>
            </div>
            
            {/* Centered Product Image with Website's Style */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Main Product Image Container */}
                <div className="relative overflow-hidden transform transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/products/product-front.png"
                    alt="Featured Product"
                    width={400}
                    height={480}
                    className="w-full h-auto object-contain max-w-[320px] md:max-w-[400px] lg:max-w-[450px] transition-all duration-700 group-hover:scale-105 drop-shadow-2xl filter brightness-110 contrast-110"
                    priority
                  />
                </div>
                
                {/* Enhanced Glow Effect - Hidden on Mobile */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-start/20 to-primary-end/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-150 hidden md:block"></div>
                
                {/* Floating Design Elements - Hidden on Mobile */}
                <div className="absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-r from-primary-start/60 to-primary-end/60 rounded-full animate-pulse hidden md:block"></div>
                <div className="absolute -bottom-4 -right-4 w-5 h-5 bg-gradient-to-r from-primary-end/60 to-primary-start/60 rounded-full animate-pulse delay-1000 hidden md:block"></div>
                <div className="absolute top-1/2 -left-6 w-3 h-3 bg-gradient-to-r from-primary-start/40 to-primary-end/40 rounded-full animate-pulse delay-500 hidden md:block"></div>
                <div className="absolute top-1/2 -right-6 w-4 h-4 bg-gradient-to-r from-primary-end/40 to-primary-start/40 rounded-full animate-pulse delay-1500 hidden md:block"></div>
                
                {/* Corner Accents - Hidden on Mobile */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary-start/30 rounded-tl-lg hidden md:block"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary-end/30 rounded-tr-lg hidden md:block"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary-start/30 rounded-bl-lg hidden md:block"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary-end/30 rounded-br-lg hidden md:block"></div>
              </div>
            </div>
            
            {/* Call to Action Button */}
            <div className="text-center mt-8">
              <Link 
                href="/products"
                className="btn-primary inline-flex items-center px-6 py-3"
              >
                View Product
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Us?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We are committed to providing the highest quality products, made with traditional methods and care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  100% Natural
                </h3>
                <p className="text-gray-600">
                  Our products are made from pure natural ingredients, ensuring the highest quality and authenticity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Traditional Process
                </h3>
                <p className="text-gray-600">
                  We follow traditional methods to prepare our products, preserving their natural goodness.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Quality Certified
                </h3>
                <p className="text-gray-600">
                  Our products are certified by quality standards, ensuring safety and quality standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Service Areas
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Premium quality products available across all major areas with free delivery.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { name: 'Borivali', slug: 'borivali', priority: true },
                { name: 'Dahisar', slug: 'dahisar', priority: true },
                { name: 'Malad', slug: 'malad', priority: false },
                { name: 'Goregaon', slug: 'goregaon', priority: false },
                { name: 'Mira Road', slug: 'mira-road', priority: false },
                { name: 'Andheri', slug: 'andheri', priority: false },
                { name: 'Bandra', slug: 'bandra', priority: false }
              ].map((station) => (
                <Link
                  key={station.slug}
                  href={`/mumbai/${station.slug}`}
                  className={`block p-4 text-center rounded-lg transition-all duration-300 ${
                    station.priority 
                      ? 'bg-gradient-to-br from-primary-start to-primary-end text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-semibold">
                    {station.name}
                  </h3>
                  {station.priority && (
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
                href="/mumbai/borivali"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Get Products in Your Area
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
