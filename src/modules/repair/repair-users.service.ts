import { readUsers, writeUsers } from '../users/user.repository';
import type { User } from '../users/user.types';

interface RepairUsersResult {
  beforeTotal: number;
  afterTotal: number;
  removed: number;
  normalized: number;
  removedDuplicateEmails: number;
}

function isValidEmail(email: string): boolean {
  return email.includes('@') && email.split('@')[1]?.includes('.');
}

function isValidDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

export function repairUsers(): RepairUsersResult {
  const users = readUsers();

  const repairedUsers: User[] = [];
  const seenEmails = new Set<string>();

  let normalized = 0;
  let removedDuplicateEmails = 0;

  for (const user of users) {
    const id = user.id?.trim();
    const name = user.name?.trim();
    const email = user.email?.trim().toLowerCase();
    const createdAt = user.createdAt?.trim();
    const updatedAt = user.updatedAt?.trim();

    if (!id || !name || !email || !createdAt) {
      continue;
    }

    if (!isValidEmail(email) || !isValidDate(createdAt)) {
      continue;
    }

    if (seenEmails.has(email)) {
      removedDuplicateEmails += 1;
      continue;
    }

    const repairedUser: User = {
      id,
      name,
      email,
      createdAt
    };

    if (updatedAt && isValidDate(updatedAt)) {
      repairedUser.updatedAt = updatedAt;
    }

    if (
      id !== user.id ||
      name !== user.name ||
      email !== user.email ||
      createdAt !== user.createdAt ||
      repairedUser.updatedAt !== user.updatedAt
    ) {
      normalized += 1;
    }

    repairedUsers.push(repairedUser);
    seenEmails.add(email);
  }

  writeUsers(repairedUsers);

  return {
    beforeTotal: users.length,
    afterTotal: repairedUsers.length,
    removed: users.length - repairedUsers.length,
    normalized,
    removedDuplicateEmails
  };
}
