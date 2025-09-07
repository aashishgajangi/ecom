# Database Backup System

## Overview
This system provides a complete database backup solution with admin panel integration. Backups can be created, downloaded, and managed directly from the admin interface.

## Features

- **One-click backups**: Create database backups with optional notes
- **Download backups**: Download backup files directly from the admin panel
- **Backup management**: View backup history and delete old backups
- **Security**: Admin authentication required for all operations
- **File validation**: Checks if backup files actually exist before offering download

## Database Schema

The system uses the following Prisma model:

```prisma
model DatabaseBackup {
  id          String   @id @default(cuid())
  filename    String
  size        Int
  status      BackupStatus @default(COMPLETED)
  createdAt   DateTime @default(now())
  notes       String?

  @@map("database_backups")
}

enum BackupStatus {
  PENDING
  COMPLETED
  FAILED
}
```

## API Endpoints

### POST `/api/admin/backup`
Creates a new database backup.

**Request Body:**
```json
{
  "notes": "Optional backup description"
}
```

**Response:**
```json
{
  "success": true,
  "backup": {
    "id": "backup_id",
    "filename": "backup_2025-09-07T17-30-07-086Z.dump",
    "size": 26148,
    "status": "COMPLETED",
    "notes": "Optional backup description",
    "createdAt": "2025-09-07T17:30:07.086Z"
  },
  "message": "Database backup created successfully"
}
```

### GET `/api/admin/backup`
Retrieves backup history (last 50 backups).

**Response:**
```json
{
  "backups": [
    {
      "id": "backup_id",
      "filename": "backup_2025-09-07T17-30-07-086Z.dump",
      "size": 26148,
      "status": "COMPLETED",
      "notes": "Optional description",
      "createdAt": "2025-09-07T17:30:07.086Z",
      "fileExists": true
    }
  ]
}
```

### GET `/api/admin/backup/[filename]`
Downloads a specific backup file.

**Response:** Binary file download

### DELETE `/api/admin/backup/[filename]`
Deletes a backup file and its database record.

## Admin Interface

Access the backup system at: `/admin/backup`

### Features in Admin Panel:
- Create new backups with optional notes
- View backup history with file sizes and status
- Download backup files (click "Download" button)
- Delete old backups (click "Delete" button)
- Real-time status indicators (Completed/Pending/Failed)

## Backup File Storage

Backup files are stored in the `backups/` directory at the project root. The directory is automatically created when needed.

File naming convention: `backup_YYYY-MM-DDTHH-MM-SS-SSSZ.dump`

## Technical Details

### Backup Format
- Uses PostgreSQL `pg_dump` with custom format (`-F c`)
- Includes blobs (`-b`) for complete data backup
- Verbose output (`-v`) for better error tracking

### Security
- All operations require admin authentication
- Files are validated before download
- No direct file system access from frontend

### Error Handling
- Failed backups are recorded in database with error details
- File existence is verified before offering download
- Comprehensive error messages for troubleshooting

## Usage Examples

### Creating a Backup via API
```bash
curl -X POST http://localhost:3000/api/admin/backup \
  -H "Content-Type: application/json" \
  -H "Cookie: your_auth_cookie_here" \
  -d '{"notes":"Monthly backup"}'
```

### Manual Backup (Command Line)
```bash
pg_dump -U aashish -d ecom -F c -b -v -f "backup_$(date +%Y%m%d_%H%M%S).dump"
```

## Restoring from Backup

To restore a backup file:

```bash
pg_restore -U aashish -d ecom -c -v backup_file.dump
```

**Warning:** Restoring will drop existing database objects before recreating them (`-c` flag).

## Automation

For automated backups, consider setting up a cron job:

```bash
# Daily backup at 2 AM
0 2 * * * pg_dump -U aashish -d ecom -F c -f /path/to/backups/backup_$(date +\%Y\%m\%d).dump
```

## Troubleshooting

### Common Issues

1. **Permission denied**: Ensure the web server user has write access to backups directory
2. **pg_dump not found**: Install PostgreSQL client tools
3. **Authentication failed**: Check database connection string in `.env`
4. **Disk space**: Monitor backup directory size and implement rotation

### Logs
Check the browser console and server logs for detailed error messages.
