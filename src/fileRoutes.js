const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/**
 * Route handler for retrieving files from CDN directory
 * @param {string} filename - Name of the file to retrieve
 * @returns {object} - File or error response
 */
router.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  
  // Validate filename
  if (!filename || filename.includes('..')) {
    return res.status(400).json({ 
      error: 'Invalid filename. Filename cannot be empty or contain path traversal.' 
    });
  }

  // Construct full file path
  const filePath = path.join(__dirname, 'cdn', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Send file
  res.sendFile(filePath);
});

module.exports = router;