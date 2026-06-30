
import { localePath, loadLocaleJson } from '@/lib/locale';

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

export default async function RedirectToKitchenBlog({ params }) {
  const { locale, slug } = await params;
  redirect(localePath(locale, `/kitchen-blog/${slug}`));
}
