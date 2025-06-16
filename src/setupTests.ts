import '@testing-library/jest-dom';
import '@testing-library/react';

// Configurações adicionais para testes de permissões
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para console.log em ambiente de teste
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  // Silenciar logs durante os testes, exceto se NODE_ENV=development
  if (process.env.NODE_ENV !== 'development') {
    console.log = jest.fn();
    console.error = jest.fn();
  }
});

afterEach(() => {
  // Restaurar console original após cada teste
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
