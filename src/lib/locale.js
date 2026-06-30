import {
  DEFAULT_LOCALE,
  LOCALES,
  isArabicLocale,
  isValidLocale,
  localePath,
  switchLocalePath,
  getLocaleFromPathname,
} from './locale-constants';

export {
  DEFAULT_LOCALE,
  LOCALES,
  isArabicLocale,
  isValidLocale,
  localePath,
  switchLocalePath,
  getLocaleFromPathname,
};

const API_BASE_URL = 'https://api-kitchenplanner.lggf-promotor.com/api';

function localeFileName(baseName, locale) {
  const normalized = baseName.replace(/\.json$/i, '');
  return locale === 'sa_ar' ? `${normalized}.ar.json` : `${normalized}.json`;
}

/** Fetch a global config key from the database API */
async function fetchConfigFromDb(key) {
  try {
    const res = await fetch(`${API_BASE_URL}/configs/${key}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.value;
  } catch (error) {
    console.error(`Error fetching config ${key} from DB:`, error);
    return null;
  }
}

export async function fetchProductsFromDb(locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/products?locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!res.ok) return null;

    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) return null;

    const grouped = {};
    items.forEach((item) => {
      const category = item.category || 'uncategorized';
      const product = item.details || item;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });

    return grouped;
  } catch (error) {
    console.error(`Error fetching products from DB table for locale ${locale}:`, error);
    return null;
    // This is the error showing: Error fetching products from DB table for locale sa_ar: fetch failed
  }
}

export async function loadProductsList(locale) {
  const dbProducts = await fetchProductsFromDb(locale);
  return {
    productsData: dbProducts || {},
    source: dbProducts ? 'api' : 'empty',
  };
}

// Statically analyze JSON file modules using Vite glob imports
const coreJsonModules = import.meta.glob('../data/*.json');
const blogJsonModules = import.meta.glob('../data/blogs/*.json');
const LOCAL_ONLY_CONFIGS = new Set([
  'content',
  'homepage',
  'footer',
  'faq',
  'installationGuides',
  'kitchenLayouts',
  'products',
  'productsList',
  'recProducts',
  'eCatalogue',
  'builtInProducts',
]);

/** Load any data file with optional Arabic variant (e.g. faq.json / faq.ar.json). */
export async function loadLocaleJson(locale, baseName) {
  const normalizedBase = baseName.replace(/\.json$/i, '');
  const dbKey = `${normalizedBase}_${locale}`;
  // Taking the name from the baseName and replacing .json with ''
  // 1. Try to fetch from DB
  if (!LOCAL_ONLY_CONFIGS.has(normalizedBase)) {
    const dbData = await fetchConfigFromDb(dbKey);
    // If dbData is true
    if (dbData) {
      let data = dbData;
      // save the dbData in the data 
      // And check the typeof that variable whether its string or not
      if (typeof data === 'string') {
        try {
          // converting the string to json
          data = JSON.parse(data);
        } catch (e) {
          console.error(`Error parsing dbData string for key ${dbKey}:`, e);
        }
      }
      return data;
    }
  }

  // 2. Fallback to filesystem representation in browser
  try {
    const fileName = localeFileName(baseName, locale);
    // Take the filename again
    const key = Object.keys(coreJsonModules).find((k) => k.endsWith(fileName));
    // Take the key by searching in the jsonmodlues and save it in key

    if (key) {
      // if the key is there then take the data from the key and parse it 
      const mod = await coreJsonModules[key]();
      let parsed = mod.default || mod;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Error loading local JSON fallback for ${baseName}:`, e);
  }
  return null;
}

export async function getContent(locale) {
  return loadLocaleJson(locale, 'content');
}

function parseMaybeJson(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function pickFirstString(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function extractBlogMetaFromDb(dbBlog) {
  const dbMeta = parseMaybeJson(dbBlog?.meta) || {};
  return {
    title: pickFirstString(
      dbBlog?.meta_title,
      dbBlog?.metaTitle,
      dbBlog?.seo_title,
      dbBlog?.seoTitle,
      dbBlog?.title_tag,
      dbMeta?.title,
      dbMeta?.meta_title,
      dbMeta?.seo_title
    ),
    description: pickFirstString(
      dbBlog?.meta_description,
      dbBlog?.metaDescription,
      dbBlog?.seo_description,
      dbBlog?.seoDescription,
      dbBlog?.description,
      dbMeta?.description,
      dbMeta?.meta_description,
      dbMeta?.seo_description
    ),
  };
}

export async function loadBlogContent(locale, slug) {
  // 1. Try to fetch from Flask Backend DB
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}?locale=${locale}`);
    if (res.ok) {
      const dbBlog = await res.json();
      if (dbBlog && dbBlog.article_content) {
        let content = dbBlog.article_content;
        if (typeof content === 'string') {
          try {
            content = JSON.parse(content);
          } catch (e) {
            console.error(`Error parsing dbBlog article_content string for ${slug}:`, e);
          }
        }
        const dbMeta = extractBlogMetaFromDb(dbBlog);
        return {
          ...content,
          meta: {
            ...(content.meta || {}),
            ...(dbMeta.title ? { title: dbMeta.title } : {}),
            ...(dbMeta.description ? { description: dbMeta.description } : {}),
          },
        };
      }
    }
  } catch (error) {
    console.error(`Error fetching blog ${slug} (${locale}) from DB:`, error);
  }

  // 2. Fallback to local files
  try {
    const fileName = locale === 'sa_ar' ? `${slug}.ar.json` : `${slug}.json`;
    const key = Object.keys(blogJsonModules).find((k) => k.endsWith(fileName));
    if (key) {
      const mod = await blogJsonModules[key]();
      let parsed = mod.default || mod;
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Error loading local blog JSON fallback for ${slug}:`, e);
  }
  return null;
}

export function getNavData(content) {
  return content.header;
}

/**
 * Fetch the blog list directly from the database API.
 * No local-file fallback — always returns live DB data.
 * Returns null if the API is unreachable or returns an error.
 */
export async function fetchBlogListFromDb(locale) {
  const key = `blogList_${locale}`;
  try {
    const res = await fetch(`${API_BASE_URL}/configs/${key}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    if (!res.ok) {
      console.error(`fetchBlogListFromDb: API returned ${res.status} for key "${key}"`);
      return null;
    }
    const json = await res.json();
    let data = json.value;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error(`fetchBlogListFromDb: failed to parse value for "${key}"`, e);
        return null;
      }
    }
    return data;
  } catch (error) {
    console.error(`fetchBlogListFromDb: network error for "${key}"`, error);
    return null;
  }
}

/**
 * Fetch the full live blog list from /api/blogs (same source as the kitchen-blog page).
 * Returns {featuredPost, topSidePosts, regularPosts} with hrefs already locale-prefixed.
 * New blogs added via the CMS will appear here immediately.
 * Items are sorted newest-first (by descending id) before categorisation.
 */
export async function fetchBlogsFromApi(locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs?locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    if (!res.ok) {
      console.error(`fetchBlogsFromApi: API returned ${res.status} for locale "${locale}"`);
      return null;
    }
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) return null;

    // Sort by position ascending — respects the order set in the CMS
    const sorted = [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    let featuredPost = null;
    const topSidePosts = [];
    const regularPosts = [];

    sorted.forEach((item) => {
      const href = localePath(locale, `/kitchen-blog/${item.slug}`);
      const post = {
        id: item.id ?? `post-${item.slug}`,
        title: item.title,
        excerpt: item.excerpt,
        image: item.image_url,
        href,
      };
      if (item.is_featured) {
        featuredPost = post;
      } else if (item.is_top_side) {
        topSidePosts.push(post);
      } else {
        regularPosts.push(post);
      }
    });

    return { featuredPost, topSidePosts, regularPosts };
  } catch (error) {
    console.error(`fetchBlogsFromApi: network error for locale "${locale}"`, error);
    return null;
  }
}

export function localizeBlogList(blogList, locale) {
  const prefixHref = (href) => {
    if (!href || href.startsWith('http')) return href;
    return localePath(locale, href);
  };

  return {
    ...blogList,
    featuredPost: blogList.featuredPost
      ? { ...blogList.featuredPost, href: prefixHref(blogList.featuredPost.href) }
      : blogList.featuredPost,
    topSidePosts: (blogList.topSidePosts || []).map((post) => ({
      ...post,
      href: prefixHref(post.href),
    })),
    regularPosts: (blogList.regularPosts || []).map((post) => ({
      ...post,
      href: prefixHref(post.href),
    })),
  };
}
