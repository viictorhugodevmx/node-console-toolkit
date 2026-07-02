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

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
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

export function findUserByEmail(email: string): User {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail.includes('@')) {
    throw new Error('Invalid email');
  }

  const user = users.find((currentUser) => currentUser.email === normalizedEmail);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export function createUser(name: string, email: string): User {
  const users = readUsers();

  const normalizedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedName) {
    throw new Error('Name is required');
  }

  if (!normalizedEmail.includes('@')) {
    throw new Error('Invalid email');
  }

  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeUsers(users);

  return user;
}

export function deleteUserByEmail(email: string): User {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail.includes('@')) {
    throw new Error('Invalid email');
  }

  const userToDelete = users.find((user) => user.email === normalizedEmail);

  if (!userToDelete) {
    throw new Error('User not found');
  }

  const remainingUsers = users.filter((user) => user.email !== normalizedEmail);

  writeUsers(remainingUsers);

  return userToDelete;
}
