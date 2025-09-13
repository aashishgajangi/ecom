import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateDynamicMetadata } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  return await generateDynamicMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Apply theme immediately to prevent FOUC
              (function() {
                try {
                  fetch('/api/themes')
                    .then(res => res.json())
                    .then(data => {
                      if (data.activeTheme && data.activeTheme.colorScheme) {
                        const root = document.documentElement;
                        const colorScheme = data.activeTheme.colorScheme;
                        
                        // Apply primary colors
                        if (colorScheme.primary) {
                          Object.entries(colorScheme.primary).forEach(([key, value]) => {
                            root.style.setProperty('--color-primary-' + key, value);
                          });
                        }
                        
                        // Apply UI colors
                        if (colorScheme.ui) {
                          // Badge colors
                          if (colorScheme.ui.badge) {
                            Object.entries(colorScheme.ui.badge).forEach(([key, value]) => {
                              root.style.setProperty('--ui-badge-' + key, value);
                            });
                          }
                          // Interactive colors
                          if (colorScheme.ui.interactive) {
                            Object.entries(colorScheme.ui.interactive).forEach(([key, value]) => {
                              root.style.setProperty('--ui-interactive-' + key, value);
                            });
                          }
                          // Status colors
                          if (colorScheme.ui.status) {
                            Object.entries(colorScheme.ui.status).forEach(([key, value]) => {
                              root.style.setProperty('--ui-status-' + key, value);
                            });
                          }
                          // Rating colors
                          if (colorScheme.ui.rating) {
                            Object.entries(colorScheme.ui.rating).forEach(([key, value]) => {
                              root.style.setProperty('--ui-rating-' + key, value);
                            });
                          }
                          // Form colors
                          if (colorScheme.ui.form) {
                            Object.entries(colorScheme.ui.form).forEach(([key, value]) => {
                              root.style.setProperty('--ui-form-' + key, value);
                            });
                          }
                          // Navigation colors
                          if (colorScheme.ui.nav) {
                            Object.entries(colorScheme.ui.nav).forEach(([key, value]) => {
                              root.style.setProperty('--ui-nav-' + key, value);
                            });
                          }
                          // Footer colors
                          if (colorScheme.ui.footer) {
                            Object.entries(colorScheme.ui.footer).forEach(([key, value]) => {
                              root.style.setProperty('--ui-footer-' + key, value);
                            });
                          }
                        }
                      }
                    })
                    .catch(err => console.log('Theme preload failed:', err));
                } catch (e) {
                  console.log('Theme preload error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider>
            <Header />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
