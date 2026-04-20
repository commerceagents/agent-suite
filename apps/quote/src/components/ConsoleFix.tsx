'use client';

import { useEffect } from 'react';

/**
 * ConsoleFix component to suppress non-actionable library warnings.
 * Specifically targets THREE.Clock deprecation warnings that originate from internal R3F code.
 */
export default function ConsoleFix() {
  useEffect(() => {
    const originalWarn = console.warn;
    
    console.warn = (...args) => {
      // Suppress specific THREE.Clock deprecation warning
      if (
        typeof args[0] === 'string' && 
        args[0].includes('THREE.Clock: This module has been deprecated')
      ) {
        return;
      }
      
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
