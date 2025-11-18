import { jest } from '@jest/globals';

// Mock Redis
jest.unstable_mockModule("../src/utils/redis.js", () => ({
  default: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(true),
    del: jest.fn().mockResolvedValue(true)
  }
}));

// silence console logs
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};