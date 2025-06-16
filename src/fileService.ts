import express from 'express';
import path from 'path';
import fs from 'fs';

const CDN_DIR = path.join(process.cwd(), 'cdn');

export function getFile(filename: string): { success: boolean; data?: Buffer; error?: string } {
  try {
    // Prevent directory traversal by resolving and checking the file path
    const filePath = path.resolve(CDN_DIR, filename);
    
    // Check if the file is within the CDN directory
    if (!filePath.startsWith(CDN_DIR)) {
      return { success: false, error: 'Invalid file path' };
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    return { success: true, data: fileBuffer };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export function createFileRoutes(app: express.Application) {
  app.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    const result = getFile(filename);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.send(result.data);
  });
}