import { vi } from 'vitest';
import { createMockRootState, createMockConfig } from './test-utils';

// Mock the @tuber/shared module first
vi.mock('@tuber/shared', () => ({
  get_config: vi.fn(() => createMockConfig()),
  DEFAULT_BLANK_PAGE: '/blank',
  DEFAULT_LANDING_PAGE: '/landing',
}));

// Mock the config module with a writable DEBUG property
const mockConfig = {
  DEBUG: false,
  DEFAULT_THEME_MODE: 'light' as const,
};

vi.mock('../../config', () => ({
  default: mockConfig,
}));

// Mock the business logic modules
vi.mock('../../business.logic/logging', () => ({
  ler: vi.fn(),
  log: vi.fn(),
  warn: vi.fn(),
  notice: vi.fn(),
  die: vi.fn(),
}));

vi.mock('../../business.logic/errors', () => ({
  error_id: vi.fn(() => ({
    remember_exception: vi.fn(),
  })),
  JsonapiError: class MockJsonapiError {
    message: string;
    constructor(message: string) {
      this.message = message;
    }
  },
}));

// Mock the state module
vi.mock('../../state', () => ({
  get_state: vi.fn(() => createMockRootState()),
  dummy_redux_handler: vi.fn(),
}));

// Mock the net.actions module
vi.mock('../../state/net.actions', () => ({
  get_req_state: vi.fn(),
  post_req_state: vi.fn(),
}));

// Export a setup function that can be called in tests
export function setupControllerMocks() {
  // Additional setup if needed
}

// Export the mock config so tests can modify it
export { mockConfig };