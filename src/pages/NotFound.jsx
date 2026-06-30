import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getContent, getNavData } from '@/lib/locale';
import { getLocaleFromPathname, isArabicLocale } from '@/lib/locale-constants';
import fallbackContent from '@/data/content.json';
import fallbackContentAr from '@/data/content.ar.json';

export default function NotFound() {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  
  const isAr = isArabicLocale(locale);
  const fallback = isAr ? fallbackContentAr : fallbackContent;
  
  // Initialize navigation data with local fallback to prevent any loading states or empty screen crashes
  const [navData, setNavData] = useState(() => {
    try {
      return getNavData(fallback) || fallback.header;
    } catch (e) {
      return fallback.header;
    }
  });

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const baseData = await getContent(locale);
        if (baseData) {
          const nav = getNavData(baseData);
          if (active && nav) {
            setNavData(nav);
          }
        }
      } catch (err) {
        console.error('Error loading dynamic 404 page navigation data:', err);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [locale]);

  const title = isAr ? 'هل تهت في المطبخ؟' : 'Lost in the Kitchen?';
  const subtitle = isAr 
    ? 'الصفحة التي تبحث عنها قد تكون تمت إزالتها، أو تغير اسمها، أو غير متاحة مؤقتاً. دعنا نساعدك في العودة لتخطيط مطبخ أحلامك.' 
    : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to planning your dream kitchen.";
  const homeBtnText = isAr ? 'الذهاب إلى الصفحة الرئيسية' : 'Go to Homepage';
  const blogBtnText = isAr ? 'استكشف مدونة المطبخ' : 'Explore Kitchen Blog';
  
  const homeLink = `/${locale}/`;
  const blogLink = `/${locale}/kitchen-blog/`;

  return (
    <>
      <Header data={navData} />
      <main className="not-found-main" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="not-found-container">
          <div className="not-found-card">
            <div className="not-found-badge">404</div>
            <h1 className="not-found-title">{title}</h1>
            <p className="not-found-text">{subtitle}</p>
            <div className="not-found-actions">
              <Link to={homeLink} className="btn-not-found btn-home">
                <span>{homeBtnText}</span>
                <img 
                  src="https://lgkitchenplanner.com/sa_en/assets/images/button/Arrow%2010.png" 
                  alt="Arrow" 
                  className={`btn-icon ${isAr ? 'flip-ar' : ''}`}
                />
              </Link>
              <Link to={blogLink} className="btn-not-found btn-blog">
                <span>{blogBtnText}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .not-found-main {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 140px;
          padding-bottom: 60px;
          background: #f4efe9;
        }
        .not-found-container {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: center;
        }
        .not-found-card {
          max-width: 650px;
          width: 100%;
          text-align: center;
          background: transparent;
          border: 1px solid #d3cdc6;
          border-radius: 24px;
          padding: 60px 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }
        .not-found-badge {
          font-family: sans-serif;
          font-size: 90px;
          font-weight: 700;
          color: #a50034;
          line-height: 1;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }
        .not-found-title {
          font-family: sans-serif;
          font-size: 32px;
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: 20px;
          color: #1c1c1c;
        }
        .not-found-text {
          font-size: 16px;
          line-height: 1.7;
          color: #4e4e4e;
          margin-bottom: 40px;
        }
        .not-found-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 480px) {
          .not-found-actions {
            flex-direction: row;
            gap: 20px;
          }
        }
        .btn-not-found {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 30px;
          font-weight: 600;
          font-size: 15px;
          border-radius: 50px;
          transition: all 0.3s ease;
          cursor: pointer;
          min-width: 200px;
          text-decoration: none;
        }
        .btn-home {
          background-color: #a50034;
          color: #ffffff;
          border: 1px solid #a50034;
          gap: 10px;
        }
        .btn-home:hover {
          background-color: #1c1c1c;
          border-color: #1c1c1c;
          transform: translateY(-2px);
        }
        .btn-blog {
          background-color: transparent;
          color: #1c1c1c;
          border: 1px solid #1c1c1c;
        }
        .btn-blog:hover {
          background-color: #a50034;
          color: #ffffff;
          border-color: #a50034;
          transform: translateY(-2px);
        }
        .btn-icon {
          width: 14px;
          height: auto;
          transition: transform 0.3s ease;
        }
        .btn-icon.flip-ar {
          transform: scaleX(-1);
        }
        .btn-home:hover .btn-icon:not(.flip-ar) {
          transform: translateX(4px);
        }
        .btn-home:hover .btn-icon.flip-ar {
          transform: scaleX(-1) translateX(4px);
        }
      `}</style>
    </>
  );
}
