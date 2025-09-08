import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{page.content || 'No content available.'}</ReactMarkdown>
          </div>
        </div>

        {/* Page Metadata */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Last updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
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
