import fs from 'fs';
import path from 'path';

import type { User } from './user.types';

const usersFilePath = path.resolve(process.cwd(), 'data', 'users.json');

export type UserSortField = 'name' | 'email' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

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

function validateEmail(email: string): void {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
}

function isUserSortField(value: string): value is UserSortField {
  return ['name', 'email', 'createdAt', 'updatedAt'].includes(value);
}

function isSortDirection(value: string): value is SortDirection {
  return ['asc', 'desc'].includes(value);
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

  validateEmail(normalizedEmail);

  const user = users.find((currentUser) => currentUser.email === normalizedEmail);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export function searchUsers(query: string): User[] {
  const users = readUsers();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    throw new Error('Search query is required');
  }

  return users.filter((user) => {
    return (
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function sortUsers(field: string, direction: string): User[] {
  if (!isUserSortField(field)) {
    throw new Error('Invalid sort field. Use: name, email, createdAt or updatedAt');
  }

  if (!isSortDirection(direction)) {
    throw new Error('Invalid sort direction. Use: asc or desc');
  }

  const users = readUsers();

  return [...users].sort((firstUser, secondUser) => {
    const firstValue = firstUser[field] ?? '';
    const secondValue = secondUser[field] ?? '';

    const result = firstValue.localeCompare(secondValue);

    return direction === 'asc' ? result : result * -1;
  });
}

export function createUser(name: string, email: string): User {
  const users = readUsers();

  const normalizedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedName) {
    throw new Error('Name is required');
  }

  validateEmail(normalizedEmail);

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

export function updateUserByEmail(
  currentEmail: string,
  newName: string,
  newEmail: string
): User {
  const users = readUsers();

  const normalizedCurrentEmail = normalizeEmail(currentEmail);
  const normalizedNewName = newName.trim();
  const normalizedNewEmail = normalizeEmail(newEmail);

  validateEmail(normalizedCurrentEmail);

  if (!normalizedNewName) {
    throw new Error('Name is required');
  }

  validateEmail(normalizedNewEmail);

  const userIndex = users.findIndex((user) => user.email === normalizedCurrentEmail);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const duplicatedEmail = users.some((user) => {
    return user.email === normalizedNewEmail && user.email !== normalizedCurrentEmail;
  });

  if (duplicatedEmail) {
    throw new Error('Email already exists');
  }

  const currentUser = users[userIndex];

  const updatedUser: User = {
    ...currentUser,
    name: normalizedNewName,
    email: normalizedNewEmail,
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;

  writeUsers(users);

  return updatedUser;
}

export function deleteUserByEmail(email: string): User {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  validateEmail(normalizedEmail);

  const userToDelete = users.find((user) => user.email === normalizedEmail);

  if (!userToDelete) {
    throw new Error('User not found');
  }

  const remainingUsers = users.filter((user) => user.email !== normalizedEmail);

  writeUsers(remainingUsers);

  return userToDelete;
}

export function resetUsers(): number {
  const users = readUsers();
  const deletedCount = users.length;

  writeUsers([]);

  return deletedCount;
}
