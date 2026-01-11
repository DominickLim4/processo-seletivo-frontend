// src/setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- MOCK 1: window.matchMedia ---
// Ant design usa isso pra saber se é mobile ou desktop
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

// --- MOCK 2: ResizeObserver ---
// Ant design usa isso para tabelas que se ajustam sozinhas
window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// compatibilidade
window.jest = vi;