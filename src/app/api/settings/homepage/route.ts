import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get homepage settings or create default if not exists
    let homepageSettings = await prisma.homepageSettings.findFirst();

    if (!homepageSettings) {
      // Create default homepage settings
      homepageSettings = await prisma.homepageSettings.create({
        data: {
          heroTitle: 'Welcome to Nisargalahari',
          heroSubtitle: 'Pure, nature-friendly products that harness the power of nature',
          showFeaturedSection: true,
          showServicesSection: true,
          showTestimonials: true,
          featuredProducts: []
        }
      });
    }

    return NextResponse.json({ homepageSettings });

  } catch (error) {
    console.error('Get homepage settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      heroTitle, 
      heroSubtitle, 
      featuredProducts, 
      showFeaturedSection, 
      showServicesSection, 
      showTestimonials 
    } = await request.json();

    // Update or create homepage settings
    let homepageSettings = await prisma.homepageSettings.findFirst();

    if (homepageSettings) {
      // Update existing
      homepageSettings = await prisma.homepageSettings.update({
        where: { id: homepageSettings.id },
        data: {
          heroTitle,
          heroSubtitle,
          featuredProducts,
          showFeaturedSection,
          showServicesSection,
          showTestimonials
        }
      });
    } else {
      // Create new
      homepageSettings = await prisma.homepageSettings.create({
        data: {
          heroTitle,
          heroSubtitle,
          featuredProducts,
          showFeaturedSection,
          showServicesSection,
          showTestimonials
        }
      });
    }

    return NextResponse.json({
      success: true,
      homepageSettings,
      message: 'Homepage settings updated successfully'
    });

  } catch (error) {
    console.error('Update homepage settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage settings' },
      { status: 500 }
    );
  }
}
