
import { localePath } from '@/lib/locale';

export default async function ArticleIndexPage({ params }) {
  const { locale } = await params;
  redirect(
    localePath(
      locale,
      '/kitchen-blog/dazzle-your-guest-lg-induction-hob-thinq-hood'
    )
  );
}
