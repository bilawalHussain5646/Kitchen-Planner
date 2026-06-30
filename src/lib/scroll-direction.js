import { isArabicLocale } from '@/lib/locale-constants';

/** Horizontal scroll step; reverses for Arabic reading direction. */
export function scrollHorizontalStep(container, amount, locale) {
  if (!container) return;
  const step = isArabicLocale(locale) ? -amount : amount;
  container.scrollBy({ left: step, behavior: 'smooth' });
}

export function scrollHorizontalPrev(container, amount, locale) {
  scrollHorizontalStep(container, -Math.abs(amount), locale);
}

export function scrollHorizontalNext(container, amount, locale) {
  scrollHorizontalStep(container, Math.abs(amount), locale);
}
