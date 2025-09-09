import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PageTemplate from '@/components/PageTemplate';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch the page from database
  const page = await prisma.page.findUnique({
    where: { 
      slug,
      isPublished: true 
    }
  });

  // If page doesn't exist or isn't published, show 404
  if (!page) {
    notFound();
  }

  // Parse metadata for template options
  const metadata = (page.metadata as Record<string, unknown>) || {};
  const templateValue = metadata.template;
  const template = (templateValue === 'hero' || templateValue === 'centered' || templateValue === 'wide') 
    ? templateValue 
    : 'default' as const;
  const showHero = Boolean(metadata.showHero) || false;
  const heroTitle = typeof metadata.heroTitle === 'string' ? metadata.heroTitle : undefined;
  const heroSubtitle = typeof metadata.heroSubtitle === 'string' ? metadata.heroSubtitle : undefined;

  return (
    <>
      <PageTemplate
        title={page.title}
        content={page.content || 'No content available.'}
        template={template}
        showHero={showHero}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        structuredContent={Array.isArray(metadata.structuredContent) ? 
          (metadata.structuredContent as Array<any>).filter((section: any) => 
            section && 
            typeof section.id === 'string' &&
            ['hero', 'text', 'image', 'gallery', 'features', 'contact', 'cta'].includes(section.type) &&
            typeof section.content === 'object' &&
            typeof section.order === 'number'
          ) : undefined}
      />
      
      {/* Page Metadata Footer */}
      <div className="py-8 bg-gray-50 border-t">
        <div className="container-custom">
          <div className="text-center text-gray-600 text-sm">
            <p>Last updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { isPublished: true },
    select: { slug: true }
  });

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  const page = await prisma.page.findUnique({
    where: { 
      slug,
      isPublished: true 
    }
  });

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.title,
    description: page.content?.substring(0, 160) || 'Page content',
  };
}
