import fs from 'fs';
import path from 'path';

export function readJsonFile(filePath: string): unknown {
  const normalizedPath = filePath.trim();

  if (!normalizedPath) {
    throw new Error('File path is required');
  }

  if (!normalizedPath.endsWith('.json')) {
    throw new Error('Only .json files are supported');
  }

  const absolutePath = path.resolve(process.cwd(), normalizedPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${normalizedPath}`);
  }

  const rawContent = fs.readFileSync(absolutePath, 'utf-8');

  if (!rawContent.trim()) {
    throw new Error(`File is empty: ${normalizedPath}`);
  }

  try {
    return JSON.parse(rawContent) as unknown;
  } catch {
    throw new Error(`Invalid JSON file: ${normalizedPath}`);
  }
}
