import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseDatabaseUrl, buildPgRestoreCommand, DatabaseConfig } from '@/lib/db-utils';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { filename, confirm } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // WARNING: This will drop and recreate the database
    // For safety, we'll require a confirmation parameter
    if (!confirm) {
      return NextResponse.json(
        { 
          error: 'Restore requires confirmation',
          message: 'This operation will DROP ALL EXISTING DATA and restore from backup. Include confirm: true to proceed.'
        },
        { status: 400 }
      );
    }

    // Parse database configuration
    let dbConfig: DatabaseConfig;
    try {
      dbConfig = parseDatabaseUrl();
    } catch (error) {
      console.error('Database configuration error:', error);
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
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

    console.log('Starting database restore from:', filename);

    // Restore the database using dynamic configuration
    const restoreCommand = buildPgRestoreCommand(dbConfig, filepath);
    console.log('Running restore command:', restoreCommand.replace(dbConfig.password, '***'));

    // Set PGPASSWORD environment variable for authentication
    const env = { ...process.env };
    if (dbConfig.password) {
      env.PGPASSWORD = dbConfig.password;
    }

    const { stderr, stdout } = await execAsync(restoreCommand, { env });

    // pg_restore also writes to stderr on success, so we check for actual errors
    console.log('Restore completed. stderr output:', stderr);
    console.log('Restore stdout output:', stdout);

    // Check if stderr contains actual error indicators
    const hasErrors = stderr && (
      stderr.toLowerCase().includes('error') ||
      stderr.toLowerCase().includes('fatal') ||
      stderr.toLowerCase().includes('failed')
    );

    if (hasErrors) {
      console.error('Restore process had errors:', stderr);
      return NextResponse.json(
        { 
          error: 'Restore process encountered errors',
          details: stderr
        },
        { status: 500 }
      );
    }

    // Verify restore was successful by checking if we can query the database
    try {
      // First disconnect existing connections to avoid conflicts
      await prisma.$disconnect();
      
      // Reconnect and test that we can query after restore
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection test passed after restore');
      
      return NextResponse.json({
        success: true,
        message: 'Database restored successfully from backup. Please refresh the page to see changes.',
        filename
      });

    } catch (dbError) {
      console.error('Database connection test failed after restore:', dbError);
      return NextResponse.json(
        { 
          error: 'Restore completed but database connection test failed',
          details: `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to restore database backup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
