
import { LocaleProvider } from '@/context/LocaleContext';
import { isValidLocale } from '@/lib/locale-constants';

export function generateStaticParams() {
  return [{ locale: 'sa_en' }, { locale: 'sa_ar' }];
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
