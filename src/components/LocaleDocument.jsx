import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLocaleFromPathname, isArabicLocale } from '@/lib/locale-constants';

export default function LocaleDocument() {
  const location = useLocation();
  const pathname = location.pathname;
  const locale = getLocaleFromPathname(pathname);
  const isRtl = isArabicLocale(locale);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.lang = isRtl ? 'ar' : 'en';
    html.dir = 'ltr';
    html.classList.toggle('locale-ar', isRtl);
    body.classList.toggle('locale-ar', isRtl);
  }, [isRtl]);

  return null;
}
