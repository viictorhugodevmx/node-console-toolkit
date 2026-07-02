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

export function generateToken(bytes = 24): string {
  if (!Number.isInteger(bytes)) {
    throw new Error('Token bytes must be an integer');
  }

  if (bytes < 16 || bytes > 64) {
    throw new Error('Token bytes must be between 16 and 64');
  }

  return crypto.randomBytes(bytes).toString('hex');
}
