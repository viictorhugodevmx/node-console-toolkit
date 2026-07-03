import path from 'path';

import { exportUsers } from '../export/export-users.service';

interface BackupUsersResult {
  outputPath: string;
  exportedAt: string;
  total: number;
}

function createTimestamp(): string {
  return new Date()
    .toISOString()
    .replace('T', '-')
    .replace(/\..+/, '')
    .replace(/:/g, '-');
}

export function backupUsers(): BackupUsersResult {
  const timestamp = createTimestamp();
  const outputPath = path.join('backups', `users-${timestamp}.json`);

  const exportData = exportUsers(outputPath);

  return {
    outputPath,
    exportedAt: exportData.exportedAt,
    total: exportData.total
  };
}
