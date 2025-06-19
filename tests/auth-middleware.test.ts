import { describe, it, expect, vi } from 'vitest';
import { authMiddleware } from '../src/middleware/auth-middleware';
import { Request, Response, NextFunction } from 'express';

describe('Authentication Middleware', () => {
  const mockNext = vi.fn() as NextFunction;

  it('should reject requests without an API key', () => {
    const mockReq = {
      headers: {},
      query: {},
      path: '/files/upload'
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should allow admin API key for all routes', () => {
    process.env.ADMIN_API_KEY = 'admin_test_key';

    const mockReq = {
      headers: { 'x-api-key': 'admin_test_key' },
      query: {},
      path: '/files/upload'
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should reject invalid API keys', () => {
    const mockReq = {
      headers: { 'x-api-key': 'invalid_key' },
      query: {},
      path: '/files/upload'
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });
});