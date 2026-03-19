import { useEffect, useState } from 'react';

type ResolvedThemeMode = 'light' | 'dark';

const getResolvedThemeMode = (): ResolvedThemeMode => {
  if (typeof document === 'undefined') {
    return 'light';
  }

  const scheme = document.documentElement.getAttribute('data-kep-color-scheme');
  if (scheme === 'dark' || scheme === 'light') {
    return scheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useResolvedThemeMode = () => {
  const [mode, setMode] = useState<ResolvedThemeMode>(getResolvedThemeMode);

  useEffect(() => {
    const updateMode = () => {
      setMode(getResolvedThemeMode());
    };

    updateMode();

    const observer = new MutationObserver(updateMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-kep-color-scheme'],
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', updateMode);
    };
  }, []);

  return {
    mode,
    isDark: mode === 'dark',
  };
};

export default useResolvedThemeMode;
