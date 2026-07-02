import crypto from 'crypto';

export function hashPassword(password: string): string {
  const normalizedPassword = password.trim();

  if (!normalizedPassword) {
    throw new Error('Password is required');
  }

  return crypto
    .createHash('sha256')
    .update(normalizedPassword)
    .digest('hex');
}
