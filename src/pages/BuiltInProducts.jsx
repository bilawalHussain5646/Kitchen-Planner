import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuiltInProductsClient from '@/components/BuiltInProductsClient';
import { getContent, getNavData, loadLocaleJson } from '@/lib/locale';

export default function BuiltInProducts() {
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
        const pageData = await loadLocaleJson(locale, 'builtInProducts');
        const footerData = await loadLocaleJson(locale, 'footer');

        if (active) {
          setData({
            navData,
            pageData,
            footerData,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading built-in products page data:', err);
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

  const { navData, pageData, footerData } = data;

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
