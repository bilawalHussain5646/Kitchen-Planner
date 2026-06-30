'use client';

import React, { useRef, useMemo } from 'react';

import { useLocale } from '@/context/LocaleContext';
import { localePath } from '@/lib/locale-constants';
import { scrollHorizontalPrev, scrollHorizontalNext } from '@/lib/scroll-direction';

export default function HomepageBlog({ copy, blogList }) {
  const { locale } = useLocale();
  const blogSliderRef = useRef(null);

  const blogPosts = useMemo(
    () =>
      [
        blogList.featuredPost,
        ...(blogList.topSidePosts || []),
        ...(blogList.regularPosts || []),
      ].filter(Boolean).slice(0, 6),
    [blogList]
  );

  const getBlogScrollStep = () => {
    if (!blogSliderRef.current) return 320;
    const card = blogSliderRef.current.querySelector('.homepage-blog-card');
    const cardWidth = card ? card.offsetWidth : 300;
    const style = window.getComputedStyle(blogSliderRef.current);
    const gap = parseInt(style.columnGap || style.gap || '20', 10);
    return cardWidth + gap;
  };

  const scrollBlogLeft = () =>
    scrollHorizontalPrev(blogSliderRef.current, getBlogScrollStep(), locale);

  const scrollBlogRight = () =>
    scrollHorizontalNext(blogSliderRef.current, getBlogScrollStep(), locale);

  return (
    <section className="homepage-blog-section">
      <div className="homepage-blog-container">
        <div className="homepage-blog-header">
          <h2 className="homepage-blog-title">{copy.title}</h2>
          <p className="homepage-blog-subtitle">{copy.subtitle}</p>
          <div className="blog-header-controls">
            <a href={localePath(locale, '/kitchen-blog')} className="faq-header-btn blog-learn-more-btn-custom">
              {copy.learnMore}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <div className="blog-arrows">
              <button
                className="blog-arrow-btn"
                onClick={scrollBlogLeft}
                aria-label="Scroll left"
              >
                <img src="https://lgkitchenplanner.com/sa_en/assets/images/products/left-arrow.svg" alt="" />
              </button>
              <button
                className="blog-arrow-btn"
                onClick={scrollBlogRight}
                aria-label="Scroll right"
              >
                <img src="https://lgkitchenplanner.com/sa_en/assets/images/products/right-arrow.svg" alt="" />
              </button>
            </div>
          </div>
        </div>

        <div className="homepage-blog-grid" ref={blogSliderRef}>
          {blogPosts.map((post, idx) => (
            <a href={post.href} className="homepage-blog-card" key={idx}>
              <div className="homepage-blog-card-img-wrapper">
                <img src={post.image} alt={post.title} className="homepage-blog-card-img" />
              </div>
              <div className="homepage-blog-card-content">
                <h3 className="homepage-blog-card-title">{post.title}</h3>
                <div className="homepage-blog-card-footer">
                  <span className="homepage-blog-card-arrow-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
