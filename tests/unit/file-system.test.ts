/**
 * @dcyfr/ai-code-gen - File system utilities tests
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { vol } from 'memfs';
import type { GeneratedFile } from '../../src/types/index.js';

// Mock node:fs with memfs
vi.mock('node:fs', () => ({
  existsSync: (...args: any[]) => vol.existsSync(...args),
  mkdirSync: (...args: any[]) => vol.mkdirSync(...args),
  readFileSync: (...args: any[]) => vol.readFileSync(...args),
  writeFileSync: (...args: any[]) => vol.writeFileSync(...args),
  readdirSync: (...args: any[]) => vol.readdirSync(...args),
  statSync: (...args: any[]) => vol.statSync(...args),
}));

// Import after mocking
import {
  ensureDir,
  writeGeneratedFile,
  readFileContents,
  fileExists,
  listTypeScriptFiles,
  getRelativePath,
} from '../../src/lib/file-system.js';

describe('File System Utilities', () => {
  beforeEach(() => {
    // Reset the in-memory file system before each test
    vol.reset();
  });

  describe('ensureDir', () => {
    it('should create a directory if it does not exist', () => {
      const dirPath = '/test/new/directory';
      
      expect(vol.existsSync(dirPath)).toBe(false);
      ensureDir(dirPath);
      expect(vol.existsSync(dirPath)).toBe(true);
    });

    it('should create nested directories recursively', () => {
      const dirPath = '/test/deeply/nested/directory/structure';
      
      ensureDir(dirPath);
      
      expect(vol.existsSync('/test')).toBe(true);
      expect(vol.existsSync('/test/deeply')).toBe(true);
      expect(vol.existsSync('/test/deeply/nested')).toBe(true);
      expect(vol.existsSync('/test/deeply/nested/directory')).toBe(true);
      expect(vol.existsSync(dirPath)).toBe(true);
    });

    it('should not throw error if directory already exists', () => {
      const dirPath = '/test/existing';
      
      vol.mkdirSync(dirPath, { recursive: true });
      expect(vol.existsSync(dirPath)).toBe(true);
      
      expect(() => ensureDir(dirPath)).not.toThrow();
      expect(vol.existsSync(dirPath)).toBe(true);
    });

    it('should handle root directory paths', () => {
      const dirPath = '/';
      
      expect(() => ensureDir(dirPath)).not.toThrow();
    });
  });

  describe('writeGeneratedFile', () => {
    it('should write file content to disk', () => {
      const baseDir = '/project';
      const file: GeneratedFile = {
        path: 'src/components/Button.tsx',
        content: 'export function Button() { return <button>Click me</button>; }',
      };

      const written = writeGeneratedFile(baseDir, file);

      expect(written).toBe(true);
      expect(vol.existsSync('/project/src/components/Button.tsx')).toBe(true);
      const content = vol.readFileSync('/project/src/components/Button.tsx', 'utf-8');
      expect(content).toBe(file.content);
    });

    it('should create parent directories automatically', () => {
      const baseDir = '/project';
      const file: GeneratedFile = {
        path: 'deeply/nested/path/to/file.ts',
        content: 'export const foo = "bar";',
      };

      const written = writeGeneratedFile(baseDir, file);

      expect(written).toBe(true);
      expect(vol.existsSync('/project/deeply/nested/path/to')).toBe(true);
      expect(vol.existsSync('/project/deeply/nested/path/to/file.ts')).toBe(true);
    });

    it('should skip writing if file exists and overwrite is false', () => {
      const baseDir = '/project';
      const filePath = '/project/src/existing.ts';
      const originalContent = 'const original = true;';
      
      vol.mkdirSync('/project/src', { recursive: true });
      vol.writeFileSync(filePath, originalContent, 'utf-8');

      const file: GeneratedFile = {
        path: 'src/existing.ts',
        content: 'const updated = true;',
        overwrite: false,
      };

      const written = writeGeneratedFile(baseDir, file);

      expect(written).toBe(false);
      const content = vol.readFileSync(filePath, 'utf-8');
      expect(content).toBe(originalContent); // Should not be overwritten
    });

    it('should overwrite file if overwrite flag is true', () => {
      const baseDir = '/project';
      const filePath = '/project/src/existing.ts';
      const originalContent = 'const original = true;';
      
      vol.mkdirSync('/project/src', { recursive: true });
      vol.writeFileSync(filePath, originalContent, 'utf-8');

      const file: GeneratedFile = {
        path: 'src/existing.ts',
        content: 'const updated = true;',
        overwrite: true,
      };

      const written = writeGeneratedFile(baseDir, file);

      expect(written).toBe(true);
      const content = vol.readFileSync(filePath, 'utf-8');
      expect(content).toBe(file.content); // Should be overwritten
    });

    it('should overwrite file if force parameter is true', () => {
      const baseDir = '/project';
      const filePath = '/project/src/existing.ts';
      const originalContent = 'const original = true;';
      
      vol.mkdirSync('/project/src', { recursive: true });
      vol.writeFileSync(filePath, originalContent, 'utf-8');

      const file: GeneratedFile = {
        path: 'src/existing.ts',
        content: 'const updated = true;',
        overwrite: false, // Note: overwrite is false
      };

      const written = writeGeneratedFile(baseDir, file, true); // force = true

      expect(written).toBe(true);
      const content = vol.readFileSync(filePath, 'utf-8');
      expect(content).toBe(file.content); // Should be overwritten due to force
    });

    it('should write file with absolute path in GeneratedFile', () => {
      const baseDir = '/project';
      const file: GeneratedFile = {
        path: '/absolute/path/file.ts',
        content: 'export const test = true;',
      };

      const written = writeGeneratedFile(baseDir, file);

      expect(written).toBe(true);
      expect(vol.existsSync('/absolute/path/file.ts')).toBe(true);
    });
  });

  describe('readFileContents', () => {
    it('should read file contents from disk', () => {
      const filePath = '/test/file.ts';
      const content = 'export const foo = "bar";';
      
      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(filePath, content, 'utf-8');

      const result = readFileContents(filePath);

      expect(result).toBe(content);
    });

    it('should throw error if file does not exist', () => {
      const filePath = '/nonexistent/file.ts';

      expect(() => readFileContents(filePath)).toThrow();
    });

    it('should read empty file correctly', () => {
      const filePath = '/test/empty.ts';
      
      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(filePath, '', 'utf-8');

      const result = readFileContents(filePath);

      expect(result).toBe('');
    });

    it('should read file with special characters', () => {
      const filePath = '/test/special.ts';
      const content = 'const emoji = "🚀"; const unicode = "中文";';
      
      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(filePath, content, 'utf-8');

      const result = readFileContents(filePath);

      expect(result).toBe(content);
    });
  });

  describe('fileExists', () => {
    it('should return true if file exists', () => {
      const filePath = '/test/exists.ts';
      
      vol.mkdirSync('/test', { recursive: true });
      vol.writeFileSync(filePath, 'content', 'utf-8');

      expect(fileExists(filePath)).toBe(true);
    });

    it('should return false if file does not exist', () => {
      const filePath = '/test/nonexistent.ts';

      expect(fileExists(filePath)).toBe(false);
    });

    it('should return true if directory exists', () => {
      const dirPath = '/test/directory';
      
      vol.mkdirSync(dirPath, { recursive: true });

      expect(fileExists(dirPath)).toBe(true);
    });

    it('should return false for empty string path', () => {
      expect(fileExists('')).toBe(false);
    });
  });

  describe('listTypeScriptFiles', () => {
    it('should list all .ts files in directory', () => {
      vol.fromJSON({
        '/project/src/index.ts': 'export {}',
        '/project/src/utils.ts': 'export {}',
        '/project/src/types.ts': 'export {}',
      });

      const files = listTypeScriptFiles('/project/src');

      expect(files).toHaveLength(3);
      expect(files).toContain('/project/src/index.ts');
      expect(files).toContain('/project/src/utils.ts');
      expect(files).toContain('/project/src/types.ts');
    });

    it('should list all .tsx files in directory', () => {
      vol.fromJSON({
        '/project/components/Button.tsx': 'export {}',
        '/project/components/Card.tsx': 'export {}',
      });

      const files = listTypeScriptFiles('/project/components');

      expect(files).toHaveLength(2);
      expect(files).toContain('/project/components/Button.tsx');
      expect(files).toContain('/project/components/Card.tsx');
    });

    it('should recursively find files in subdirectories', () => {
      vol.fromJSON({
        '/project/src/index.ts': 'export {}',
        '/project/src/utils/helpers.ts': 'export {}',
        '/project/src/utils/validators.ts': 'export {}',
        '/project/src/components/Button.tsx': 'export {}',
        '/project/src/components/ui/Card.tsx': 'export {}',
      });

      const files = listTypeScriptFiles('/project/src');

      expect(files).toHaveLength(5);
      expect(files).toContain('/project/src/index.ts');
      expect(files).toContain('/project/src/utils/helpers.ts');
      expect(files).toContain('/project/src/utils/validators.ts');
      expect(files).toContain('/project/src/components/Button.tsx');
      expect(files).toContain('/project/src/components/ui/Card.tsx');
    });

    it('should exclude node_modules directory', () => {
      vol.fromJSON({
        '/project/src/index.ts': 'export {}',
        '/project/node_modules/package/index.ts': 'export {}',
        '/project/node_modules/package/types.d.ts': 'export {}',
      });

      const files = listTypeScriptFiles('/project');

      expect(files).toHaveLength(1);
      expect(files).toContain('/project/src/index.ts');
      expect(files).not.toContain('/project/node_modules/package/index.ts');
    });

    it('should exclude dist directory', () => {
      vol.fromJSON({
        '/project/src/index.ts': 'export {}',
        '/project/dist/index.js': 'export {}',
        '/project/dist/types/index.d.ts': 'export {}',
      });

      const files = listTypeScriptFiles('/project');

      expect(files).toHaveLength(1);
      expect(files).toContain('/project/src/index.ts');
      expect(files).not.toContain('/project/dist/types/index.d.ts');
    });

    it('should exclude .git directory', () => {
      vol.fromJSON({
        '/project/src/index.ts': 'export {}',
        '/project/.git/config.ts': 'export {}',
      });

      const files = listTypeScriptFiles('/project');

      expect(files).toHaveLength(1);
      expect(files).toContain('/project/src/index.ts');
      expect(files).not.toContain('/project/.git/config.ts');
    });

    it('should return empty array if directory does not exist', () => {
      const files = listTypeScriptFiles('/nonexistent/directory');

      expect(files).toEqual([]);
    });

    it('should return empty array for empty string path', () => {
      vol.fromJSON({
        '/project/src/index.ts': 'export {}',
      });

      expect(listTypeScriptFiles('')).toEqual([]);
    });

    it('should ignore non-TypeScript files', () => {
      vol.fromJSON({
        '/project/src/index.ts': 'export {}',
        '/project/src/index.js': 'export {}',
        '/project/src/README.md': '# README',
        '/project/src/config.json': '{}',
        '/project/src/styles.css': '',
      });

      const files = listTypeScriptFiles('/project/src');

      expect(files).toHaveLength(1);
      expect(files).toContain('/project/src/index.ts');
    });

    it('should handle empty directory', () => {
      vol.fromJSON({
        '/project/empty/': null,
      });

      const files = listTypeScriptFiles('/project/empty');

      expect(files).toEqual([]);
    });
  });

  describe('getRelativePath', () => {
    it('should return relative path between two absolute paths', () => {
      const basePath = '/project/src/components';
      const targetPath = '/project/src/utils/helpers.ts';

      const result = getRelativePath(basePath, targetPath);

      expect(result).toBe('../utils/helpers.ts');
    });

    it('should return file name if in same directory', () => {
      const basePath = '/project/src';
      const targetPath = '/project/src/index.ts';

      const result = getRelativePath(basePath, targetPath);

      expect(result).toBe('index.ts');
    });

    it('should return dot if paths are identical', () => {
      const path = '/project/src';

      const result = getRelativePath(path, path);

      expect(result).toBe('');
    });

    it('should handle deeply nested paths', () => {
      const basePath = '/a/b/c/d/e';
      const targetPath = '/a/b/x/y/z/file.ts';

      const result = getRelativePath(basePath, targetPath);

      expect(result).toBe('../../../x/y/z/file.ts');
    });

    it('should handle paths with different depths', () => {
      const basePath = '/project';
      const targetPath = '/project/src/components/ui/Button.tsx';

      const result = getRelativePath(basePath, targetPath);

      expect(result).toBe('src/components/ui/Button.tsx');
    });
  });
});
