import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

console.log("***************************** debugando ********************************************");

Object.assign(globalThis, { TextEncoder, TextDecoder });

if (typeof Element !== 'undefined') {
  Element.prototype.animate = jest.fn().mockReturnValue({
    finished: Promise.resolve(),
    ready: Promise.resolve(),
    onfinish: null,
    cancel: jest.fn(),
    finish: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    reverse: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    currentTime: 0,
    startTime: 0,
    playbackRate: 1,
    playState: 'idle'
  });
}

// --- 3. Mock do matchMedia ---
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock de PointerEvent (React 19)
class PointerEvent extends Event {
  constructor(type, props) {
    super(type, props);
    this.button = props?.button || 0;
    this.ctrlKey = props?.ctrlKey || false;
    this.pointerType = props?.pointerType || 'mouse';
  }
}
globalThis.PointerEvent = PointerEvent;
window.PointerEvent = PointerEvent;

// Métodos de captura de ponteiro que o React 19 chama nos elementos
if (typeof HTMLElement !== 'undefined') {
  HTMLElement.prototype.hasPointerCapture = jest.fn();
  HTMLElement.prototype.setPointerCapture = jest.fn();
  HTMLElement.prototype.releasePointerCapture = jest.fn();
  // Mock extra para scroll
  HTMLElement.prototype.scrollIntoView = jest.fn();
}

// Mock do Canvas
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn((x, y, w, h) => ({ data: new Array(w * h * 4).fill(0) })),
    putImageData: jest.fn(),
    createImageData: jest.fn([], () => ({})),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
  }));
}

// Timers e ComputedStyle
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
window.scrollTo = jest.fn();

const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (elt) => originalGetComputedStyle(elt);