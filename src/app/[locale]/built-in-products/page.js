import BuiltInProductsClient from '@/components/BuiltInProductsClient';
import { getContent, getNavData, loadProductsList, loadLocaleJson } from '@/lib/locale';

export default async function BuiltInProductsPage({ params }) {
  const { locale } = await params;
  const contentData = await getContent(locale);
  const navData = getNavData(contentData);
  const pageData = await loadLocaleJson(locale, 'builtInProducts');
  const footerData = await loadLocaleJson(locale, 'footer');

  const { productsData, source: productsSource } = await loadProductsList(locale);
  console.log(`Built-in products source: ${productsSource}`);

  return (
    <BuiltInProductsClient
      locale={locale}
      navData={navData}
      footerData={footerData}
      pageData={pageData}
      productsData={{}}
      productsSource="api"
    />
  );
}
