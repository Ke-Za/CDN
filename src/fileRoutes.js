const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Base CDN directory to prevent file access outside this directory
const CDN_DIR = path.join(__dirname, 'cdn');

/**
 * Route handler for retrieving files from CDN directory
 * @param {string} filename - Name of the file to retrieve
 * @returns {object} - File or error response
 */
router.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  
  // Validate filename
  if (!filename) {
    return res.status(400).json({ 
      error: 'Filename cannot be empty.' 
    });
  }

  // Check for path traversal attempts
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ 
      error: 'Invalid filename. Path traversal is not allowed.' 
    });
  }

  // Construct full file path
  const filePath = path.join(CDN_DIR, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Send file
  res.sendFile(filePath);
});

module.exports = router;