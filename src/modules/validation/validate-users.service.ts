import { readUsers } from '../users/user.repository';
import type { User } from '../users/user.types';

interface ValidationIssue {
  index: number;
  email: string;
  field: keyof User | 'duplicateEmail';
  message: string;
}

interface ValidateUsersResult {
  valid: boolean;
  totalUsers: number;
  totalIssues: number;
  issues: ValidationIssue[];
}

function isValidEmail(email: string): boolean {
  return email.includes('@') && email.split('@')[1]?.includes('.');
}

function isValidDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

export function validateUsers(): ValidateUsersResult {
  const users = readUsers();
  const issues: ValidationIssue[] = [];
  const emailCounter = new Map<string, number>();

  users.forEach((user) => {
    const normalizedEmail = user.email?.trim().toLowerCase() ?? '';
    const currentCount = emailCounter.get(normalizedEmail) ?? 0;

    emailCounter.set(normalizedEmail, currentCount + 1);
  });

  users.forEach((user, index) => {
    const email = user.email || 'unknown';

    if (!user.id || !user.id.trim()) {
      issues.push({
        index,
        email,
        field: 'id',
        message: 'User id is required'
      });
    }

    if (!user.name || !user.name.trim()) {
      issues.push({
        index,
        email,
        field: 'name',
        message: 'User name is required'
      });
    }

    if (!user.email || !isValidEmail(user.email)) {
      issues.push({
        index,
        email,
        field: 'email',
        message: 'User email is invalid'
      });
    }

    if (!user.createdAt || !isValidDate(user.createdAt)) {
      issues.push({
        index,
        email,
        field: 'createdAt',
        message: 'User createdAt is invalid'
      });
    }

    const normalizedEmail = user.email?.trim().toLowerCase() ?? '';

    if (normalizedEmail && emailCounter.get(normalizedEmail)! > 1) {
      issues.push({
        index,
        email,
        field: 'duplicateEmail',
        message: 'User email is duplicated'
      });
    }
  });

  return {
    valid: issues.length === 0,
    totalUsers: users.length,
    totalIssues: issues.length,
    issues
  };
}
