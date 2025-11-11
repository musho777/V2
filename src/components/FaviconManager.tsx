'use client';

import { useEffect } from 'react';

export function FaviconManager() {
  useEffect(() => {
    const updateFavicon = (isDark: boolean) => {
      const link = (document.querySelector("link[rel*='icon']") ||
        document.createElement('link')) as HTMLLinkElement;
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = isDark ? '/favicon-dark.ico' : '/favicon.ico';

      if (!document.querySelector("link[rel*='icon']")) {
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    };

    // Initial check
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    updateFavicon(darkModeMediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => updateFavicon(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);

    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  return null;
}
