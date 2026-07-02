import fs from 'fs';
import path from 'path';

import { readUsers } from '../users/user.repository';

interface UsersExport {
  exportedAt: string;
  total: number;
  users: ReturnType<typeof readUsers>;
}

export function exportUsers(outputPath: string): UsersExport {
  const normalizedOutputPath = outputPath.trim();

  if (!normalizedOutputPath) {
    throw new Error('Output path is required');
  }

  if (!normalizedOutputPath.endsWith('.json')) {
    throw new Error('Output file must be a .json file');
  }

  const users = readUsers();

  const exportData: UsersExport = {
    exportedAt: new Date().toISOString(),
    total: users.length,
    users
  };

  const absoluteOutputPath = path.resolve(process.cwd(), normalizedOutputPath);
  const outputDir = path.dirname(absoluteOutputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(absoluteOutputPath, JSON.stringify(exportData, null, 2), 'utf-8');

  return exportData;
}
