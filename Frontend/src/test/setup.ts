import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock IntersectionObserver for Framer Motion and react-intersection-observer under JSDOM
class MockIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

// Force useInView to always return true under tests since JSDOM lacks a layout engine
vi.mock('framer-motion', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useInView: () => true
  };
});

afterEach(() => {
  cleanup();
});