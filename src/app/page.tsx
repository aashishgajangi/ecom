'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Hero from '@/components/Hero';
import FeaturedProduct from '@/components/FeaturedProduct';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServiceAreas from '@/components/ServiceAreas';

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
      // Get the homepage from pages
      const response = await fetch('/api/pages/homepage');
      if (response.ok) {
        const data = await response.json();
        if (data.page) {
          setHomepage(data.page);
          setLoading(false);
          return;
        }
      }
      
      // If no homepage found, create default structure
      setHomepage({
        id: 'default-homepage',
        title: "Nature's Best, Delivered Fresh",
        content: 'Experience the goodness of nature with top-quality products designed to nourish your body and soul.',
        template: 'home',
        metadata: {
          homepageContent: {
            hero: {
              title: "Nature's Best, Delivered Fresh",
              subtitle: "Experience the goodness of nature with top-quality products designed to nourish your body and soul.",
              ctaText: "Explore Products",
              ctaLink: "/products"
            },
            featuredProduct: {
              title: "Our Featured Product",
              description: "Experience the aroma and taste of our premium products, beneficial for the health of the entire family.",
              imageUrl: "/uploads/2b450e54-44d9-4180-ab83-ddcab7320e32.jpeg",
              productLink: "/products",
              ctaText: "View Product"
            },
            whyChooseUs: {
              title: "Why Choose Us?",
              subtitle: "We are committed to providing the highest quality products, made with traditional methods and care.",
              features: [
                {
                  icon: "check-circle",
                  title: "100% Natural",
                  description: "Our products are made from pure natural ingredients, ensuring the highest quality and authenticity."
                },
                {
                  icon: "clock",
                  title: "Traditional Process",
                  description: "We follow traditional methods to prepare our products, preserving their natural goodness."
                },
                {
                  icon: "shield-check",
                  title: "Quality Certified",
                  description: "Our products are certified by quality standards, ensuring safety and quality standards."
                }
              ]
            },
            serviceAreas: {
              title: "Our Service Areas",
              subtitle: "Premium quality products available across all major areas with free delivery.",
              ctaText: "Get Products in Your Area",
              ctaLink: "/mumbai/borivali",
              areas: [
                { name: 'Borivali', slug: 'borivali', priority: true },
                { name: 'Dahisar', slug: 'dahisar', priority: true },
                { name: 'Malad', slug: 'malad', priority: false },
                { name: 'Goregaon', slug: 'goregaon', priority: false },
                { name: 'Mira Road', slug: 'mira-road', priority: false },
                { name: 'Andheri', slug: 'andheri', priority: false },
                { name: 'Bandra', slug: 'bandra', priority: false }
              ]
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching homepage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Hero />
        <div className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded mb-8 max-w-2xl mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 bg-white rounded-lg shadow-md">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!homepage) {
    return (
      <>
        <Hero />
        <FeaturedProduct />
        <WhyChooseUs />
        <ServiceAreas />
      </>
    );
  }

  // Get structured content from metadata
  const homepageContent = homepage.metadata?.homepageContent;

  if (homepageContent) {
    return (
      <>
        <Hero 
          title={homepageContent.hero.title}
          subtitle={homepageContent.hero.subtitle}
          ctaText={homepageContent.hero.ctaText}
          ctaLink={homepageContent.hero.ctaLink}
        />
        <FeaturedProduct 
          title={homepageContent.featuredProduct.title}
          description={homepageContent.featuredProduct.description}
          imageUrl={homepageContent.featuredProduct.imageUrl}
          productLink={homepageContent.featuredProduct.productLink}
          ctaText={homepageContent.featuredProduct.ctaText}
        />
        <WhyChooseUs 
          title={homepageContent.whyChooseUs.title}
          subtitle={homepageContent.whyChooseUs.subtitle}
          features={homepageContent.whyChooseUs.features}
        />
        <ServiceAreas 
          title={homepageContent.serviceAreas.title}
          subtitle={homepageContent.serviceAreas.subtitle}
          serviceAreas={homepageContent.serviceAreas.areas}
          ctaText={homepageContent.serviceAreas.ctaText}
          ctaLink={homepageContent.serviceAreas.ctaLink}
        />
      </>
    );
  }

  // Fallback to basic hero
  return (
    <>
      <Hero 
        title={homepage.title}
        subtitle={homepage.content}
      />
      <FeaturedProduct />
      <WhyChooseUs />
      <ServiceAreas />
    </>
  );
}
