import Header from '@/components/Header';
import BlogGrid from '@/components/BlogGrid';
import Footer from '@/components/Footer';
import { getContent, getNavData, loadLocaleJson, localizeBlogList } from '@/lib/locale';

const API_BASE_URL = 'https://api-kitchenplanner.lggf-promotor.com/api';

async function fetchBlogsFromDb(locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs?locale=${locale}`);
    if (!res.ok) return null;
    const items = await res.json();
    
    let featuredPost = null;
    const topSidePosts = [];
    const regularPosts = [];

    items.forEach(item => {
      // Reconstruct standard listing item attributes
      const postItem = {
        id: item.id || `post-${item.slug}`,
        title: item.title,
        excerpt: item.excerpt,
        image: item.image_url,
        href: `/sa_en/kitchen-blog/${item.slug}`, // Standard dynamic href format
        ...(item.article_content || {})
      };
      
      // Override locale path segment in href correctly if sa_ar
      if (locale === 'sa_ar') {
        postItem.href = `/sa_ar/kitchen-blog/${item.slug}`;
      }

      if (item.is_featured) {
        featuredPost = postItem;
      } else if (item.is_top_side) {
        topSidePosts.push(postItem);
      } else {
        regularPosts.push(postItem);
      }
    });

    return {
      featuredPost,
      topSidePosts,
      regularPosts
    };
  } catch (error) {
    console.error(`Error fetching blogs list from DB for locale ${locale}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const homepageData = await loadLocaleJson(locale, 'homepage');
  return {
    title: `${homepageData.blog.title} | LG Kitchen Planner`,
    description: homepageData.blog.subtitle,
  };
}

export default async function BlogListing({ params }) {
  const { locale } = await params;
  const contentData = await getContent(locale);
  const navData = getNavData(contentData);

  // Load structural blog list layout
  let baseBlogList = await loadLocaleJson(locale, 'blogList');
  
  // Clear lists to prevent build-time prerendering of blog items
  baseBlogList.featuredPost = null;
  baseBlogList.topSidePosts = [];
  baseBlogList.regularPosts = [];

  const blogListData = localizeBlogList(baseBlogList, locale);

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
