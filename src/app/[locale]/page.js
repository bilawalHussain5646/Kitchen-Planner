

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveKitchenLayouts from '@/components/InteractiveKitchenLayouts';
import HomepageBlog from '@/components/HomepageBlog';
import OurServices from '@/components/OurServices';
import HomepageFAQ from '@/components/HomepageFAQ';
import RecommendedProducts from '@/components/RecommendedProducts';
import HeroSvg from '@/components/HeroSvg';
import { useLocale } from '@/context/LocaleContext';
import { isArabicLocale } from '@/lib/locale-constants';
import {
  getContent,
  getNavData,
  loadLocaleJson,
  localePath,
} from '@/lib/locale';
import './homepage.css';



export async function generateMetadata({ params }) {
  const { locale } = await params;
  const homepageData = await loadLocaleJson(locale, 'homepage');
  return {
    title: homepageData.metadata.title,
    description: homepageData.metadata.description,
  };
}

export default async function Homepage({ params }) {
  const { locale } = await params;
  const contentData = await getContent(locale);
  const navData = getNavData(contentData);
  const homepageData = await loadLocaleJson(locale, 'homepage');

  const kitchenLayoutsData = await loadLocaleJson(locale, 'kitchenLayouts');
  const recProductsData = await loadLocaleJson(locale, 'recProducts');
  const blogListData = await loadLocaleJson(locale, 'blogList');
  const experienceNowBtn = 'https://lgkitchenplanner.com/sj-built-in-kitchen-planner';
  const quoteBtn = !isArabicLocale(locale) ? "https://lgkitchenplanner.com/sa_en/query/" : "https://lgkitchenplanner.com/sa_ar/query/";


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
