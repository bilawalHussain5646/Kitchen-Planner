'use client';


import { useLocale } from '@/context/LocaleContext';
import { isArabicLocale } from '@/lib/locale-constants';

export default function LocaleBackLink({ className, label }) {
  const { locale, path } = useLocale();
  const backLabel = label ?? (isArabicLocale(locale) ? 'رجوع' : 'Back');

  return (
    <a href={path('/')} className={className}>
      <img
        src="https://www.lgkitchenplanner.com/sa_en/assets/images/button/Arrow%2011.png"
        alt="Arrow"
        className="back-arrow"
      />
      <span>{backLabel}</span>
    </a>
  );
}
