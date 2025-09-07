import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nisargalahari - Pure Desi Cow Ghee & Traditional Tup",
  description: "Premium quality A2 Desi Cow Ghee and authentic Traditional Tup. Organic, pure, and nourishing - delivered fresh across Mumbai.",
  keywords: [
    "Nisargalahari",
    "Desi Cow Ghee",
    "Pure A2 Ghee",
    "Traditional Tup",
    "Organic Ghee Mumbai",
    "Borivali Ghee",
    "Dahisar Ghee",
    "Authentic Indian Ghee",
    "Premium Cow Ghee",
    "Ayurvedic Ghee"
  ],
  metadataBase: new URL('https://www.nisargalahari.com'),
  alternates: {
    canonical: 'https://www.nisargalahari.com',
  },
  openGraph: {
    url: 'https://www.nisargalahari.com',
    siteName: 'Nisargalahari',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
