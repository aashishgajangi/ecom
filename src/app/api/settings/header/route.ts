import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get header settings or create default if not exists
    let headerSettings = await prisma.headerSettings.findFirst();

    if (!headerSettings) {
      // Create default header settings
      headerSettings = await prisma.headerSettings.create({
        data: {
          logoText: 'Nisargalahari',
          logoImage: null,
          logoType: 'TEXT',
          navigation: [
            { name: 'Home', url: '/', order: 1, isActive: true },
            { name: 'About', url: '/about', order: 2, isActive: true },
            { name: 'Products', url: '/products', order: 3, isActive: true },
            { name: 'Contact', url: '/contact', order: 4, isActive: true }
          ],
          showCart: true,
          showLogin: true
        }
      });
    }

    return NextResponse.json({ headerSettings });

  } catch (error) {
    console.error('Get header settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch header settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { logoText, logoImage, logoType, navigation, showCart, showLogin } = await request.json();

    // Update or create header settings
    let headerSettings = await prisma.headerSettings.findFirst();

    if (headerSettings) {
      // Update existing
      headerSettings = await prisma.headerSettings.update({
        where: { id: headerSettings.id },
        data: {
          logoText,
          logoImage,
          logoType,
          navigation,
          showCart,
          showLogin
        }
      });
    } else {
      // Create new
      headerSettings = await prisma.headerSettings.create({
        data: {
          logoText,
          logoImage,
          logoType,
          navigation,
          showCart,
          showLogin
        }
      });
    }

    return NextResponse.json({
      success: true,
      headerSettings,
      message: 'Header settings updated successfully'
    });

  } catch (error) {
    console.error('Update header settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update header settings' },
      { status: 500 }
    );
  }
}
