import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogGrid from '@/components/BlogGrid';
import { getContent, getNavData, loadLocaleJson, localizeBlogList } from '@/lib/locale';

export default function KitchenBlog() {
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
        let baseBlogList = await loadLocaleJson(locale, 'blogList');

        baseBlogList.featuredPost = null;
        baseBlogList.topSidePosts = [];
        baseBlogList.regularPosts = [];

        const blogListData = localizeBlogList(baseBlogList, locale);

        if (active) {
          setData({
            navData,
            blogListData,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading kitchen blog page data:', err);
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

  const { navData, blogListData } = data;

  return (
    <>
      <Header data={navData} />
      <main className="main-layout" style={{ paddingBottom: 0 }}>
        <BlogGrid data={blogListData} locale={locale} />
      </main>
      <Footer />
    </>
  );
}
