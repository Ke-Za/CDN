import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import fileRoutes from './fileRoutes';

describe('File Retrieval Route', () => {
  const app = express();
  app.use(fileRoutes);

  it('should retrieve an existing file successfully', async () => {
    const response = await request(app).get('/files/sample.txt');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('sample file for testing');
  });

  it('should return 404 for non-existent file', async () => {
    const response = await request(app).get('/files/nonexistent.txt');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'File not found');
  });

  it('should prevent path traversal attacks', async () => {
    const response = await request(app).get('/files/../secret.txt');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', expect.stringContaining('Path traversal'));
  });

  it('should reject empty filename', async () => {
    const response = await request(app).get('/files/');
    
    expect(response.status).toBe(404); // Express default behavior for undefined route
  });
});