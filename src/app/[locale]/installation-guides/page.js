import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InstallationGuidesInteractive from '@/components/InstallationGuidesInteractive';
import LocaleBackLink from '@/components/LocaleBackLink';
import { getContent, getNavData, loadLocaleJson } from '@/lib/locale';



export default async function InstallationGuidesPage({ params }) {
  const { locale } = await params;
  const contentData = await getContent(locale);
  const navData = getNavData(contentData);
  const pageData = await loadLocaleJson(locale, 'installationGuides');
  const productsData = await loadLocaleJson(locale, 'products');


  return (
    <>
      <Header data={navData} />
      <main className="main-layout">
        <div className="guides-container">
          <div className="guides-header">
            <LocaleBackLink className="guide-back-btn" />
          </div>

          <div className="guides-content-grid">
            <div className="guides-text-col">
              <h1 className="guides-title">{pageData.title}</h1>
              <p className="guides-subtitle">{pageData.subtitle}</p>
            </div>

            <div className="guides-image-col">
              <img
                src="https://www.lgkitchenplanner.com/sa_en/assets/images/installation_guides/hero-image.png"
                alt={pageData.heroAlt}
                className="guides-hero-image"
              />
            </div>
          </div>
        </div>

        <InstallationGuidesInteractive
          pageData={pageData}
          productsData={productsData}
        />
      </main>
      <Footer />
    </>
  );
}
