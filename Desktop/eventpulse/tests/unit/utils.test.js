const AppError = require('../../utils/AppError');
const asyncHandler = require('../../utils/asyncHandler');

describe('AppError Unit Tests', () => {
  test('should create operational error with correct status code and fail status', () => {
    const error = new AppError('Resource Not Found', 404);
    expect(error.message).toBe('Resource Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  test('should set status to error for 500 status codes', () => {
    const error = new AppError('Internal Database Error', 500);
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
  });
});

describe('asyncHandler Unit Tests', () => {
  test('should execute wrapped function successfully', async () => {
    const mockFn = jest.fn().mockResolvedValue('Success');
    const req = {}, res = {}, next = jest.fn();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });

  test('should catch asynchronous error and forward to next()', async () => {
    const mockError = new Error('Async failure');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const req = {}, res = {}, next = jest.fn();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    // Wait for promise microtask resolution
    await new Promise(setImmediate);
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
