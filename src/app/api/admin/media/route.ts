import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Generate unique filename
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Return file URL
    const fileUrl = `/uploads/${filename}`;

    // Store media record in database
    const media = await prisma.media.create({
      data: {
        filename: filename,
        originalName: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type,
        uploadedById: session.user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: media.id,
        url: fileUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        createdAt: media.createdAt
      }
    });

  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all media files
    const mediaFiles = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Image format guidelines
    const imageGuidelines = {
      png: {
        quality: "High",
        size: "Large",
        description: "Best for images with transparency, logos, and graphics that require high quality",
        recommended: "Graphics, logos, screenshots"
      },
      jpg: {
        quality: "Medium",
        size: "Medium",
        description: "Good balance between quality and file size, supports compression",
        recommended: "Photographs, complex images"
      },
      webp: {
        quality: "High",
        size: "Small",
        description: "Modern format with excellent compression and quality, supported by most browsers",
        recommended: "All image types (best overall)"
      },
      gif: {
        quality: "Low",
        size: "Variable",
        description: "Supports animation but limited to 256 colors, not recommended for photos",
        recommended: "Simple animations, icons"
      },
      svg: {
        quality: "Vector (infinite)",
        size: "Very Small",
        description: "Vector format that scales perfectly, ideal for icons and illustrations",
        recommended: "Icons, logos, illustrations"
      }
    };

    return NextResponse.json({
      success: true,
      files: mediaFiles,
      guidelines: imageGuidelines,
      recommendations: [
        "Use WEBP for best performance and quality balance",
        "Use PNG when transparency is needed",
        "Use JPG for photographic content",
        "Use SVG for vector graphics and icons",
        "Avoid GIF for static images (use PNG or WEBP instead)"
      ]
    });

  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
