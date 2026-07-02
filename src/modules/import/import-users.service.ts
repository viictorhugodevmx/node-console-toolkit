import { readJsonFile } from '../json-files/json-file.service';
import { readUsers, writeUsers } from '../users/user.repository';
import type { User } from '../users/user.types';

interface UsersBackupFile {
  exportedAt: string;
  total: number;
  users: User[];
}

interface ImportUsersResult {
  imported: number;
  skipped: number;
  totalAfterImport: number;
}

function isUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  const hasRequiredFields =
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.createdAt === 'string';

  const hasValidUpdatedAt =
    candidate.updatedAt === undefined || typeof candidate.updatedAt === 'string';

  return hasRequiredFields && hasValidUpdatedAt;
}

function isUsersBackupFile(value: unknown): value is UsersBackupFile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.exportedAt === 'string' &&
    typeof candidate.total === 'number' &&
    Array.isArray(candidate.users) &&
    candidate.users.every(isUser)
  );
}

export function importUsers(inputPath: string): ImportUsersResult {
  const backupData = readJsonFile(inputPath);

  if (!isUsersBackupFile(backupData)) {
    throw new Error('Invalid users backup file');
  }

  const currentUsers = readUsers();
  const existingEmails = new Set(currentUsers.map((user) => user.email));
  const usersToImport: User[] = [];

  for (const user of backupData.users) {
    const normalizedEmail = user.email.trim().toLowerCase();

    if (existingEmails.has(normalizedEmail)) {
      continue;
    }

    usersToImport.push({
      ...user,
      email: normalizedEmail
    });

    existingEmails.add(normalizedEmail);
  }

  const mergedUsers = [...currentUsers, ...usersToImport];

  writeUsers(mergedUsers);

  return {
    imported: usersToImport.length,
    skipped: backupData.users.length - usersToImport.length,
    totalAfterImport: mergedUsers.length
  };
}
