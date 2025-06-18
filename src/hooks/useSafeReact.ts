
import React, { useState, useEffect, useRef } from 'react';

// Safe wrapper for React hooks that checks for React availability
export function useSafeState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Check if React is available
  if (typeof React === 'undefined' || !React || typeof React.useState !== 'function') {
    console.warn('[useSafeState] React not available, returning static values');
    return [initialValue, () => {}];
  }

  try {
    return useState(initialValue);
  } catch (error) {
    console.error('[useSafeState] Error using useState:', error);
    return [initialValue, () => {}];
  }
}

export function useSafeEffect(effect: () => void | (() => void), deps?: any[]): void {
  // Check if React is available
  if (typeof React === 'undefined' || !React || typeof React.useEffect !== 'function') {
    console.warn('[useSafeEffect] React not available, skipping effect');
    return;
  }

  try {
    return useEffect(effect, deps);
  } catch (error) {
    console.error('[useSafeEffect] Error using useEffect:', error);
  }
}

export function useSafeRef<T>(initialValue: T): { current: T } {
  // Check if React is available
  if (typeof React === 'undefined' || !React || typeof React.useRef !== 'function') {
    console.warn('[useSafeRef] React not available, returning static ref');
    return { current: initialValue };
  }

  try {
    return useRef(initialValue);
  } catch (error) {
    console.error('[useSafeRef] Error using useRef:', error);
    return { current: initialValue };
  }
}
