import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Simular Tauri API
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

// Provide mocks for standard browser things if needed
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}
