import fs from 'fs';
import path from 'path';

import type { User } from './user.types';

const usersFilePath = path.resolve(process.cwd(), 'data', 'users.json');

function ensureUsersFile(): void {
  const dataDir = path.dirname(usersFilePath);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, '[]', 'utf-8');
  }
}

export function readUsers(): User[] {
  ensureUsersFile();

  const rawData = fs.readFileSync(usersFilePath, 'utf-8');

  if (!rawData.trim()) {
    return [];
  }

  return JSON.parse(rawData) as User[];
}

export function writeUsers(users: User[]): void {
  ensureUsersFile();

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

export function createUser(name: string, email: string): User {
  const users = readUsers();

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeUsers(users);

  return user;
}
