import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://www.nisargalahari.com';
  const isMarathi = lang === 'mr';
  
  return {
    title: isMarathi ? 'निसर्गलहरी - शुद्ध गायीचे तूप' : 'Nisargalahari - Pure Cow Ghee',
    description: isMarathi 
      ? 'पारंपारिक शुद्ध गायीच्या तुपाची चव अनुभवा' 
      : 'Experience the goodness of traditional pure cow ghee',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'en-US': `${baseUrl}/en`,
        'mr': `${baseUrl}/mr`,
        'mr-IN': `${baseUrl}/mr`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: isMarathi ? 'निसर्गलहरी - शुद्ध गायीचे तूप' : 'Nisargalahari - Pure Cow Ghee',
      description: isMarathi 
        ? 'पारंपारिक शुद्ध गायीच्या तुपाची चव अनुभवा' 
        : 'Experience the goodness of traditional pure cow ghee',
      url: `${baseUrl}/${lang}`,
      siteName: 'Nisargalahari',
      locale: isMarathi ? 'mr_IN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isMarathi ? 'निसर्गलहरी - शुद्ध गायीचे तूप' : 'Nisargalahari - Pure Cow Ghee',
      description: isMarathi 
        ? 'पारंपारिक शुद्ध गायीच्या तुपाची चव अनुभवा' 
        : 'Experience the goodness of traditional pure cow ghee',
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  return (
    <html lang={lang}>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
