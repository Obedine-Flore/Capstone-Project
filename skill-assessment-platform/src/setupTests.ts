import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// No need to import matchers explicitly - modern @testing-library/jest-dom
// automatically registers matchers when imported

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock global objects if needed
// For example, if you need to mock window.matchMedia:
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});