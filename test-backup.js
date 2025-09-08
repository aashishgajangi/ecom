#!/usr/bin/env node

const { parseDatabaseUrl, buildPgDumpCommand, buildPgRestoreCommand } = require('./test-build/db-utils.js');

console.log('Testing backup system configuration...');

try {
  // Test parsing DATABASE_URL
  const dbConfig = parseDatabaseUrl();
  console.log('✓ Database configuration parsed successfully');
  console.log('  - Host:', dbConfig.host);
  console.log('  - Port:', dbConfig.port);
  console.log('  - Database:', dbConfig.database);
  console.log('  - User:', dbConfig.user);
  console.log('  - Password:', dbConfig.password ? '***' : 'Not set');

  // Test command generation
  const backupCommand = buildPgDumpCommand(dbConfig, '/tmp/test.dump');
  console.log('✓ Backup command generated:', backupCommand.replace(dbConfig.password, '***'));

  const restoreCommand = buildPgRestoreCommand(dbConfig, '/tmp/test.dump');
  console.log('✓ Restore command generated:', restoreCommand.replace(dbConfig.password, '***'));

  console.log('\n✅ All tests passed! Backup system should work correctly.');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
