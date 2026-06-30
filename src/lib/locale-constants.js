export const LOCALES = ['sa_en', 'sa_ar'];
export const DEFAULT_LOCALE = 'sa_en';

export function isValidLocale(locale) {
  return LOCALES.includes(locale);
}

export function isArabicLocale(locale) {
  return locale === 'sa_ar';
}

export function localePath(locale, href = '/') {
  if (!href || href === '/') {
    return `/${locale}/`;
  }
  let normalized = href.startsWith('/') ? href : `/${href}`;
  if (!normalized.endsWith('/') && !normalized.includes('.') && !normalized.includes('?') && !normalized.includes('#')) {
    normalized += '/';
  }
  if (LOCALES.some((l) => normalized === `/${l}` || normalized === `/${l}/` || normalized.startsWith(`/${l}/`))) {
    return normalized;
  }
  return `/${locale}${normalized}`;
}

export function switchLocalePath(pathname, targetLocale) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return `/${segments.join('/')}`;
}

export function getLocaleFromPathname(pathname) {
  const segment = pathname.split('/').filter(Boolean)[0];
  return LOCALES.includes(segment) ? segment : DEFAULT_LOCALE;
}
