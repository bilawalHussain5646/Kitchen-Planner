

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleContent from '@/components/ArticleContent';
import MoreToRead from '@/components/MoreToRead';
import { getContent, getNavData, loadBlogContent, loadLocaleJson } from '@/lib/locale';



export async function generateStaticParams({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'sa_en';
  try {
    const blogList = await loadLocaleJson(locale, 'blogList');
    const posts = [
      blogList.featuredPost,
      ...(blogList.topSidePosts || []),
      ...(blogList.regularPosts || [])
    ].filter(Boolean);

    return posts.map(post => {
      const slug = post.href.split('/').pop().replace('.html', '');
      return { slug };
    });
  } catch (e) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;

  const blogContent = await loadBlogContent(locale, slug);
  const baseData = await getContent(locale);
  const contentData = blogContent || baseData;

  const metaTitle =
    contentData.meta?.title ||
    contentData.post?.title ||
    'Kitchen Blog';

  const metaDescription =
    contentData.meta?.description ||
    contentData.article?.introParagraphs?.[0] ||
    'Read our kitchen blog articles.';

  return {
    title: `${metaTitle}`,
    description: metaDescription,
  };
}

export default async function ArticleSlugPage({ params }) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;

  const baseData = await getContent(locale);
  const navData = getNavData(baseData);

  const blogContent = await loadBlogContent(locale, slug);
  let contentData = blogContent;

  if (!contentData) {
    notFound();
  }

  // Handle page redirect to external link if configured
  if (contentData.redirect?.enabled && contentData.redirect?.url) {
    redirect(contentData.redirect.url);
  }

  const mergedData = {
    ...baseData,
    ...contentData,
    post: {
      title: contentData.post?.title || "",
      heroImage: typeof contentData.post?.heroImage === 'string'
        ? { src: contentData.post.heroImage, alt: contentData.post.title || "" }
        : contentData.post?.heroImage || { src: "", alt: "" }
    },
    article: {
      introParagraphs: contentData.article?.introParagraphs || [],
      sections: contentData.article?.sections || []
    },
    sidebar: {
      featureTitle: contentData.sidebar?.featureTitle || baseData.sidebar?.featureTitle || "",
      products: contentData.sidebar?.products || baseData.sidebar?.products || []
    },
    moreToRead: {
      sectionTitle: contentData.moreToRead?.sectionTitle || baseData.moreToRead?.sectionTitle || "",
      cards: contentData.moreToRead?.cards || baseData.moreToRead?.cards || []
    },
  };

  return (
    <>
      <Header data={navData} />
      <main className="main-layout">
        <div className="container">
          <header className="post-header">
            <h1 className="post-title">{mergedData.post.title}</h1>
          </header>

          <div className="content-grid">
            <Sidebar data={mergedData.sidebar} />
            <ArticleContent data={mergedData.article} heroImage={mergedData.post.heroImage} />
          </div>

          <MoreToRead data={mergedData.moreToRead} />
        </div>
      </main>
      <Footer />
    </>
  );
}
