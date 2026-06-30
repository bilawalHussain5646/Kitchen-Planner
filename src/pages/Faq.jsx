import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/FaqAccordion';
import { getContent, getNavData, loadLocaleJson } from '@/lib/locale';

export default function Faq() {
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
        const faqData = await loadLocaleJson(locale, 'faq');

        if (faqData) {
          faqData.questions = [];
        }

        if (active) {
          setData({
            navData,
            faqData,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading FAQ page data:', err);
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

  const { navData, faqData } = data;

  return (
    <>
      <Header data={navData} />
      <main className="main-layout">
        <FaqAccordion data={faqData} initialQuestions={[]} />
      </main>
      <Footer />
    </>
  );
}
