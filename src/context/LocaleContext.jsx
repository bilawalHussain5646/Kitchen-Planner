'use client';

import { createContext, useContext, useMemo } from 'react';
import { localePath } from '@/lib/locale-constants';

const LocaleContext = createContext(null);

export function LocaleProvider({ locale, children }) {
  const value = useMemo(
    () => ({
      locale,
      path: (href) => localePath(locale, href),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
