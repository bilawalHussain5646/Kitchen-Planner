import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveKitchenLayouts from '@/components/InteractiveKitchenLayouts';
import HomepageBlog from '@/components/HomepageBlog';
import OurServices from '@/components/OurServices';
import HomepageFAQ from '@/components/HomepageFAQ';
import RecommendedProducts from '@/components/RecommendedProducts';
import HeroSvg from '@/components/HeroSvg';
import { isArabicLocale } from '@/lib/locale-constants';
import { getContent, getNavData, loadLocaleJson, fetchBlogsFromApi } from '@/lib/locale';
import '@/app/[locale]/homepage.css';

export default function Home() {
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
        const homepageData = await loadLocaleJson(locale, 'homepage');
        const kitchenLayoutsData = await loadLocaleJson(locale, 'kitchenLayouts');
        const recProductsData = await loadLocaleJson(locale, 'recProducts');
        // Fetch directly from the live blogs table — same source as the kitchen-blog page.
        // New blogs added via the CMS are sorted newest-first and appear immediately.
        const blogListData = (await fetchBlogsFromApi(locale)) ?? { featuredPost: null, topSidePosts: [], regularPosts: [] };

        if (active) {
          setData({
            navData,
            homepageData,
            kitchenLayoutsData,
            recProductsData,
            blogListData,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
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

  const { navData, homepageData, kitchenLayoutsData, recProductsData, blogListData } = data;
  const experienceNowBtn = 'https://lgkitchenplanner.com/sj-built-in-kitchen-planner';
  const quoteBtn = !isArabicLocale(locale) ? 'https://lgkitchenplanner.com/sa_en/query/' : 'https://lgkitchenplanner.com/sa_ar/query/';

  return (
    <>
      <Header data={navData} />
      <main className="homepage-main">
        <div className="homepage-container">
          <div className="homepage-left">
            <h1 className="homepage-title">{homepageData.hero.title}</h1>
            <p className="homepage-subtitle">{homepageData.hero.subtitle}</p>
            <div className="homepage-buttons">
              <a href={experienceNowBtn} className="btn-homepage-experience">
                <span>{homepageData.hero.experienceButton}</span>
                <img
                  src="https://lgkitchenplanner.com/sa_en/assets/images/button/Arrow%2010.png"
                  alt="Arrow"
                  className="btn-icon"
                />
              </a>
              <a href={quoteBtn} className="btn-homepage-quote">
                <span>{homepageData.hero.quoteButton}</span>
                <img
                  src="https://lgkitchenplanner.com/sa_en/assets/images/button/Arrow%2010.png"
                  alt="Arrow"
                  className="btn-icon"
                />
              </a>
            </div>
          </div>

          <div className="homepage-right">
            <HeroSvg />
          </div>
        </div>

        <InteractiveKitchenLayouts data={kitchenLayoutsData} copy={homepageData.kitchenLayouts} />
        <HomepageBlog copy={homepageData.blog} blogList={blogListData} />
        <OurServices copy={homepageData.services} />
        <HomepageFAQ copy={homepageData.faq} />
        <RecommendedProducts copy={homepageData.recommendedProducts} products={[]} />
      </main>
      <Footer />
    </>
  );
}
