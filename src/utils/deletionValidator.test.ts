import { describe, it, expect } from 'vitest';
import { validateFileDeletion } from './deletionValidator';

describe('File Deletion Validation', () => {
  // Valid deletion scenarios
  it('should validate deletion for admin with valid file identifier', () => {
    const result = validateFileDeletion('valid_file_123', {
      apiKey: 'test-key', 
      userRole: 'admin'
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  // Invalid file identifier scenarios
  it('should reject short file identifiers', () => {
    const result = validateFileDeletion('short', {
      apiKey: 'test-key', 
      userRole: 'admin'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('File identifier must be at least 10 characters long');
  });

  it('should reject file identifiers with special characters', () => {
    const result = validateFileDeletion('invalid file!@#', {
      apiKey: 'test-key', 
      userRole: 'admin'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('File identifier contains invalid characters');
  });

  // Authorization scenarios
  it('should reject non-admin user deletion', () => {
    const result = validateFileDeletion('valid_file_123', {
      apiKey: 'test-key', 
      userRole: 'user'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Only administrators can delete files');
  });

  it('should reject deletion without API key', () => {
    const result = validateFileDeletion('valid_file_123', {
      apiKey: '', 
      userRole: 'admin'
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('API key is required');
  });
});