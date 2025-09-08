import { URL } from 'url';

export interface DatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  connectionString: string;
}

export function parseDatabaseUrl(): DatabaseConfig {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  try {
    const url = new URL(databaseUrl);
    
    return {
      user: url.username || 'postgres',
      password: url.password || '',
      host: url.hostname || 'localhost',
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1) || 'postgres', // Remove leading slash
      connectionString: databaseUrl
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function buildPgDumpCommand(config: DatabaseConfig, outputPath: string): string {
  const { user, host, port, database } = config;
  
  // Build pg_dump command with connection parameters
  const command = [
    'pg_dump',
    `-U "${user}"`,
    `-h "${host}"`,
    `-p ${port}`,
    `-d "${database}"`,
    '-F c', // Custom format
    '-b',   // Include blobs
    '-v',   // Verbose
    `-f "${outputPath}"`
  ].join(' ');

  return command;
}

export function buildPgRestoreCommand(config: DatabaseConfig, backupPath: string): string {
  const { user, host, port, database } = config;
  
  // Build pg_restore command with connection parameters
  const command = [
    'pg_restore',
    `-U "${user}"`,
    `-h "${host}"`,
    `-p ${port}`,
    `-d "${database}"`,
    '-c',   // Clean (drop) before recreating
    '-v',   // Verbose
    `"${backupPath}"`
  ].join(' ');

  return command;
}

export function buildPsqlCommand(config: DatabaseConfig, sqlCommand: string): string {
  const { user, host, port, database } = config;
  
  return [
    'psql',
    `-U "${user}"`,
    `-h "${host}"`,
    `-p ${port}`,
    `-d "${database}"`,
    `-c "${sqlCommand}"`
  ].join(' ');
}
