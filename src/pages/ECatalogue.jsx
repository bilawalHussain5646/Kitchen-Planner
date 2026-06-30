import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocaleBackLink from '@/components/LocaleBackLink';
import { getContent, getNavData, loadLocaleJson } from '@/lib/locale';

export default function ECatalogue() {
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
        const pageData = await loadLocaleJson(locale, 'eCatalogue');

        if (active) {
          setData({
            navData,
            pageData,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading e-catalogue page data:', err);
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

  const { navData, pageData } = data;

  return (
    <>
      <Header data={navData} />
      <main className="main-layout">
        <div className="catalogue-container">
          <div className="catalogue-header">
            <LocaleBackLink className="catalogue-back-btn" />
          </div>

          <div className="catalogue-content">
            <div className="catalogue-image-wrapper">
              <img
                src="https://lgkitchenplanner.com/sa_en/assets/images/catelogue/catelogue.png"
                alt={pageData.imageAlt}
                className="catalogue-image"
              />
            </div>

            <h1 className="catalogue-title">
              {pageData.titleParts[0]}
              <br className="desktop-only" />
              {pageData.titleParts[1]}
            </h1>

            <p className="catalogue-subtitle">{pageData.subtitle}</p>

            <div className="catalogue-actions">
              <div className="catalogue-download-wrapper">
                <a
                  href="https://lgkitchenplanner.com/sa_en/assets/images/catelogue/catelogue.png"
                  download={pageData.downloadFilename}
                  className="catalogue-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://www.lgkitchenplanner.com/sa_en/assets/images/catelogue/download.svg"
                    alt="Download Icon"
                    className="download-icon"
                  />
                  <span>{pageData.downloadButton}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
