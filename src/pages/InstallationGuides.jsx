import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InstallationGuidesInteractive from '@/components/InstallationGuidesInteractive';
import LocaleBackLink from '@/components/LocaleBackLink';
import { getContent, getNavData, loadLocaleJson } from '@/lib/locale';

export default function InstallationGuides() {
  const { locale } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      try {
        const contentData = await getContent(locale);
        const navData = getNavData(contentData);
        const pageData = await loadLocaleJson(locale, 'installationGuides');
        const productsData = await loadLocaleJson(locale, 'products');

        if (active) {
          setData({
            navData,
            pageData,
            productsData,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading installation guides page data:', err);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [locale]);

  if (loading || !data) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4efe9' }}>
        <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid rgba(0,0,0,0.1)', borderTopColor: '#a50034', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const { navData, pageData, productsData } = data;

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
