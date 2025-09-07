import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

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

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const backupDir = path.join(process.cwd(), 'backups');
    const filepath = path.join(backupDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return NextResponse.json(
        { error: 'Backup file not found' },
        { status: 404 }
      );
    }

    // WARNING: This will drop and recreate the database
    // For safety, we'll require a confirmation parameter
    const { confirm } = await request.json();
    
    if (!confirm) {
      return NextResponse.json(
        { 
          error: 'Restore requires confirmation',
          message: 'This operation will DROP ALL EXISTING DATA and restore from backup. Include confirm: true to proceed.'
        },
        { status: 400 }
      );
    }

    console.log('Starting database restore from:', filename);

    // Restore the database
    const { stderr } = await execAsync(
      `pg_restore -U aashish -d ecom -c -v "${filepath}"`
    );

    // pg_restore also writes to stderr on success
    console.log('Restore completed. stderr output:', stderr);

    // Verify restore was successful by checking if we can query the database
    try {
      // Test that we can connect and query after restore
      await prisma.$queryRaw`SELECT 1`;
      
      return NextResponse.json({
        success: true,
        message: 'Database restored successfully from backup',
        filename
      });

    } catch (dbError) {
      console.error('Database connection test failed after restore:', dbError);
      return NextResponse.json(
        { 
          error: 'Restore completed but database connection test failed',
          details: 'Please check the database manually'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore database backup' },
      { status: 500 }
    );
  }
}
