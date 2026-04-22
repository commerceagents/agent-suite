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

    // Aggressively unregister any rogue service workers from other localhost:3000 projects
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        let hasServiceWorker = false;
        for(let registration of registrations) {
          registration.unregister();
          hasServiceWorker = true;
          console.log("🧹 Unregistered Rogue Service Worker.");
        }
        
        // Clear caches that might be interfering
        if (hasServiceWorker && 'caches' in window) {
          caches.keys().then((names) => {
            for (let name of names) {
              caches.delete(name);
            }
            console.log("🧹 Cleared Stale Localhost Caches.");
            // Optional: force reload to fetch fresh assets
            // window.location.reload(); 
          });
        }
      });
    }

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
