import { access, readFile } from 'fs/promises';
import { constants } from 'fs';

interface FileRetrievalResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Handles file retrieval with comprehensive error management
 * @param filePath Path to the file to retrieve
 * @returns FileRetrievalResult with either file content or error details
 */
export async function handleFileRetrieval(filePath: string): Promise<FileRetrievalResult> {
  try {
    // Check file accessibility
    await access(filePath, constants.R_OK);

    // Read file content
    const data = await readFile(filePath, 'utf-8');

    return {
      success: true,
      data
    };
  } catch (error) {
    // Specific error handling
    if (error instanceof Error) {
      if (error.message.includes('no such file or directory')) {
        return {
          success: false,
          error: 'File not found: The specified file does not exist.'
        };
      }

      if (error.message.includes('permission denied')) {
        return {
          success: false,
          error: 'Cannot access file: Insufficient permissions.'
        };
      }
    }

    // Generic error fallback
    return {
      success: false,
      error: 'An unexpected error occurred while retrieving the file.'
    };
  }
}