import fs from 'fs';
import path from 'path';

import { readUsers } from '../users/user.repository';

interface HealthCheckResult {
  status: 'ok' | 'error';
  nodeVersion: string;
  cwd: string;
  usersFile: {
    exists: boolean;
    readable: boolean;
    totalUsers: number;
  };
  backupsDir: {
    exists: boolean;
  };
}

export function getHealthCheck(): HealthCheckResult {
  const cwd = process.cwd();
  const usersFilePath = path.resolve(cwd, 'data', 'users.json');
  const backupsDirPath = path.resolve(cwd, 'backups');

  let usersFileReadable = false;
  let totalUsers = 0;

  const usersFileExists = fs.existsSync(usersFilePath);

  try {
    const users = readUsers();

    usersFileReadable = true;
    totalUsers = users.length;
  } catch {
    usersFileReadable = false;
    totalUsers = 0;
  }

  const backupsDirExists = fs.existsSync(backupsDirPath);

  const status = usersFileExists && usersFileReadable ? 'ok' : 'error';

  return {
    status,
    nodeVersion: process.version,
    cwd,
    usersFile: {
      exists: usersFileExists,
      readable: usersFileReadable,
      totalUsers
    },
    backupsDir: {
      exists: backupsDirExists
    }
  };
}
