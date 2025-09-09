import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseDatabaseUrl, buildPgDumpCommand, DatabaseConfig } from '@/lib/db-utils';
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

    const { notes } = await request.json();

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

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.dump`;
    const filepath = path.join(backupDir, filename);

    // Create database backup using dynamic configuration
    const backupCommand = buildPgDumpCommand(dbConfig, filepath);
    console.log('Running backup command:', backupCommand.replace(dbConfig.password, '***'));

    // Set PGPASSWORD environment variable for authentication
    const env = { ...process.env };
    if (dbConfig.password) {
      env.PGPASSWORD = dbConfig.password;
    }

    const { stderr } = await execAsync(backupCommand, { env });

    // pg_dump writes progress to stderr even on success, so we only check if file was created
    // Check if backup file was actually created
    if (!fs.existsSync(filepath)) {
      console.error('Backup file was not created. stderr:', stderr);
      throw new Error('Backup failed - no file created');
    }

    // Get file stats
    const stats = fs.statSync(filepath);
    const size = stats.size;

    // Save backup record to database
    const backupRecord = await prisma.databaseBackup.create({
      data: {
        filename,
        size,
        status: 'COMPLETED',
        notes
      }
    });

    return NextResponse.json({
      success: true,
      backup: backupRecord,
      message: 'Database backup created successfully'
    });

  } catch (error) {
    console.error('Backup error:', error);
    
    // Save failed backup record
    try {
      await prisma.databaseBackup.create({
        data: {
          filename: `failed_backup_${new Date().toISOString().replace(/[:.]/g, '-')}`,
          size: 0,
          status: 'FAILED',
          notes: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      });
    } catch (dbError) {
      console.error('Failed to save error record:', dbError);
    }

    return NextResponse.json(
      { 
        error: 'Failed to create database backup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    // Get all backups from database
    const backups = await prisma.databaseBackup.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Check if backup files exist
    const backupDir = path.join(process.cwd(), 'backups');
    const backupsWithStatus = backups.map(backup => ({
      ...backup,
      fileExists: fs.existsSync(path.join(backupDir, backup.filename))
    }));

    return NextResponse.json({ backups: backupsWithStatus });

  } catch (error) {
    console.error('Get backups error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backups' },
      { status: 500 }
    );
  }
}
