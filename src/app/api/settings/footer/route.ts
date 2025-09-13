import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get footer settings or create default if not exists
    let footerSettings = await prisma.footerSettings.findFirst();

    if (!footerSettings) {
      // Create default footer settings
      footerSettings = await prisma.footerSettings.create({
        data: {
          companyInfo: {
            companyName: 'Ecom',
            description: 'Pure, nature-friendly products that harness the power of nature.',
            phone: '+1 (555) 123-4567',
            email: 'info@ecom.com',
            address: 'Your Business Address Here'
          },
          quickLinks: [
            {
              title: 'Quick Links',
              links: [
                { name: 'Home', url: '/' },
                { name: 'About', url: '/about' },
                { name: 'Products', url: '/products' },
                { name: 'Contact', url: '/contact' }
              ]
            }
          ],
          socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
          },
          legalLinks: [
            { name: 'Privacy Policy', url: '/privacy-policy' },
            { name: 'Terms & Conditions', url: '/terms' }
          ]
        }
      });
    }

    return NextResponse.json({ footerSettings });

  } catch (error) {
    console.error('Get footer settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyInfo, quickLinks, socialLinks, legalLinks } = await request.json();

    // Update or create footer settings
    let footerSettings = await prisma.footerSettings.findFirst();

    if (footerSettings) {
      // Update existing
      footerSettings = await prisma.footerSettings.update({
        where: { id: footerSettings.id },
        data: {
          companyInfo,
          quickLinks,
          socialLinks,
          legalLinks
        }
      });
    } else {
      // Create new
      footerSettings = await prisma.footerSettings.create({
        data: {
          companyInfo,
          quickLinks,
          socialLinks,
          legalLinks
        }
      });
    }

    return NextResponse.json({
      success: true,
      footerSettings,
      message: 'Footer settings updated successfully'
    });

  } catch (error) {
    console.error('Update footer settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update footer settings' },
      { status: 500 }
    );
  }
}
