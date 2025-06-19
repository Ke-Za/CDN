import { describe, it, expect, beforeEach } from 'vitest';
import { handleFileRetrieval } from '../src/fileErrorHandler';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

describe('File Retrieval Error Handling', () => {
  const testDir = join(process.cwd(), 'test-files');

  beforeEach(async () => {
    // Ensure test directory exists
    await mkdir(testDir, { recursive: true });
  });

  it('should handle non-existent file', async () => {
    const nonExistentFilePath = join(testDir, 'non-existent-file.txt');
    
    const result = await handleFileRetrieval(nonExistentFilePath);
    
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/File not found/i);
  });

  it('should handle retrieving a directory as if it were a file', async () => {
    const result = await handleFileRetrieval(testDir);
    
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Cannot access file/i);
  });

  it('should successfully retrieve an existing file', async () => {
    const testFilePath = join(testDir, 'valid-file.txt');
    const testContent = 'Valid file content';
    
    await writeFile(testFilePath, testContent);
    
    const result = await handleFileRetrieval(testFilePath);
    
    expect(result.success).toBe(true);
    expect(result.data).toBe(testContent);
  });
});