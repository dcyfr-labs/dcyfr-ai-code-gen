/**
 * @dcyfr/ai-code-gen - File system utilities
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import type { GeneratedFile } from '../types/index.js';

/**
 * Ensure a directory exists, creating parent directories as needed.
 */
export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write a generated file, creating directories as needed.
 * Returns true if the file was written, false if skipped.
 *
 * Atomicity: when `overwrite`/`force` is not set, the write uses the
 * `wx` flag, which fails (EEXIST) if the path already exists. This
 * fuses the "does it exist?" check with the write into a single
 * filesystem syscall, closing CodeQL js/file-system-race — the
 * previous existsSync+writeFileSync pair was a classic TOCTOU.
 */
export function writeGeneratedFile(
  baseDir: string,
  file: GeneratedFile,
  force = false,
): boolean {
  const fullPath = resolve(baseDir, file.path);
  const dir = dirname(fullPath);

  ensureDir(dir);

  const flag = file.overwrite || force ? 'w' : 'wx';
  try {
    writeFileSync(fullPath, file.content, { encoding: 'utf-8', flag });
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
      return false;
    }
    throw err;
  }
}

/**
 * Read file contents from disk.
 */
export function readFileContents(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

/**
 * Check if a file exists.
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * List all TypeScript files in a directory recursively.
 */
export function listTypeScriptFiles(dirPath: string): string[] {
  const results: string[] = [];

  function walk(dir: string): void {
    if (!existsSync(dir)) return;

    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        if (entry !== 'node_modules' && entry !== 'dist' && entry !== '.git') {
          walk(fullPath);
        }
      } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  }

  walk(dirPath);
  return results;
}

/**
 * Get the relative path from base to target.
 */
export function getRelativePath(basePath: string, targetPath: string): string {
  return relative(basePath, targetPath);
}
