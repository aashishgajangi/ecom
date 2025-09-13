import { Metadata } from 'next';
import { prisma } from './prisma';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    // Try to get from a hypothetical site settings table
    // For now, we'll use header settings as a base and expand it
    const headerSettings = await prisma.headerSettings.findFirst();
    
    return {
      siteName: headerSettings?.logoText || 'Ecom',
      siteDescription: 'Pure, nature-friendly products that harness the power of nature',
      logoUrl: undefined, // Will implement image logo later
      faviconUrl: '/favicon.ico'
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      siteName: 'Ecom',
      siteDescription: 'Pure, nature-friendly products that harness the power of nature',
      faviconUrl: '/favicon.ico'
    };
  }
}

export async function generateDynamicMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: {
      template: `%s | ${settings.siteName}`,
      default: settings.siteName
    },
    description: settings.siteDescription,
    keywords: ['ecommerce', 'nature products', 'organic', 'healthy', 'natural'],
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/',
      title: settings.siteName,
      description: settings.siteDescription,
      siteName: settings.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteName,
      description: settings.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#70843d' },
      ],
    },
    manifest: '/site.webmanifest',
  };
}
