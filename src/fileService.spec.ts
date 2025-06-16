import { describe, it, expect } from 'vitest';
import { getFile } from './fileService';
import path from 'path';
import fs from 'fs';

describe('File Service', () => {
  it('should successfully retrieve an existing file', () => {
    const testFilename = 'sample.txt';
    const result = getFile(testFilename);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.toString()).toBe('This is a sample file for CDN retrieval.');
  });

  it('should return error for non-existent file', () => {
    const testFilename = 'nonexistent.txt';
    const result = getFile(testFilename);

    expect(result.success).toBe(false);
    expect(result.error).toBe('File not found');
  });

  it('should prevent directory traversal', () => {
    const testFilename = '../sensitive_file.txt';
    const result = getFile(testFilename);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid file path');
  });
});