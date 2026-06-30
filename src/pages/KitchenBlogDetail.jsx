import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import ArticleContent from '@/components/ArticleContent';
import MoreToRead from '@/components/MoreToRead';
import { getContent, getNavData, loadBlogContent } from '@/lib/locale';

function setMetaTag(attribute, key, content) {
  let tag = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content || '');
}

function setCanonicalLink(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function applyBlogMetadata(meta, fallbackTitle) {
  const title = meta?.title || fallbackTitle || '';
  const description = meta?.description || '';
  const canonicalUrl = window.location.origin + window.location.pathname;
  if (title) document.title = title;
  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setCanonicalLink(canonicalUrl);
}

export default function KitchenBlogDetail() {
  const { locale, slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      try {
        const baseData = await getContent(locale);
        const navData = getNavData(baseData);
        const blogContent = await loadBlogContent(locale, slug);

        if (!blogContent) {
          if (active) navigate(`/${locale}/kitchen-blog/`);
          return;
        }

        if (blogContent.redirect?.enabled && blogContent.redirect?.url) {
          window.location.href = blogContent.redirect.url;
          return;
        }

        const mergedData = {
          ...baseData,
          ...blogContent,
          post: {
            title: blogContent.post?.title || '',
            heroImage: typeof blogContent.post?.heroImage === 'string'
              ? { src: blogContent.post.heroImage, alt: blogContent.post.title || '' }
              : blogContent.post?.heroImage || { src: '', alt: '' }
          },
          article: {
            introParagraphs: blogContent.article?.introParagraphs || [],
            sections: blogContent.article?.sections || []
          },
          sidebar: {
            featureTitle: blogContent.sidebar?.featureTitle || baseData.sidebar?.featureTitle || '',
            products: blogContent.sidebar?.products || baseData.sidebar?.products || []
          },
          moreToRead: {
            sectionTitle: blogContent.moreToRead?.sectionTitle || baseData.moreToRead?.sectionTitle || '',
            cards: blogContent.moreToRead?.cards || baseData.moreToRead?.cards || []
          },
          meta: {
            title: blogContent.meta?.title || blogContent.post?.title || '',
            description: blogContent.meta?.description || '',
          },
        };

        applyBlogMetadata(mergedData.meta, mergedData.post.title);

        if (active) {
          setData({
            navData,
            mergedData,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading kitchen blog detail page data:', err);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [locale, slug, navigate]);

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

  const { navData, mergedData } = data;

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
