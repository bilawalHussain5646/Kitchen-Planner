'use client';

import React, { useState, useEffect } from 'react';


const API_BASE_URL = 'https://api-kitchenplanner.lggf-promotor.com/api';

async function fetchBlogsFromDb(locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs?locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!res.ok) return null;
    const items = await res.json();
    
    let featuredPost = null;
    const topSidePosts = [];
    const regularPosts = [];

    items.forEach(item => {
      const postItem = {
        id: item.id || `post-${item.slug}`,
        title: item.title,
        excerpt: item.excerpt,
        image: item.image_url,
        href: `/sa_en/kitchen-blog/${item.slug}`,
        ...(item.article_content || {})
      };
      
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

export default function BlogGrid({ data, locale }) {
  const [blogData, setBlogData] = useState({
    featuredPost: null,
    topSidePosts: [],
    regularPosts: []
  });

  useEffect(() => {
    let active = true;
    async function loadBlogs() {
      const dbBlogList = await fetchBlogsFromDb(locale);
      if (active && dbBlogList) {
        setBlogData(dbBlogList);
      }
    }
    loadBlogs();
    return () => {
      active = false;
    };
  }, [locale]);

  const { featuredPost, topSidePosts, regularPosts } = blogData;

  return (
    <div className="blog-grid-container">
      {/* Top Section */}
      <div className="blog-top-section">
        {featuredPost && (
          <a href={featuredPost.href} className="featured-post">
            <div className="featured-img-wrapper">
               <img src={featuredPost.image} alt={featuredPost.title} className="featured-img" />
            </div>
            <div className="featured-content">
              <h2 className="featured-title">{featuredPost.title}</h2>
              <p className="featured-excerpt">{featuredPost.excerpt}</p>
            </div>
          </a>
        )}
        <div className="top-side-posts">
          {topSidePosts.map(post => (
            <a href={post.href} className="top-side-post" key={post.id}>
              <div className="side-post-img-wrapper">
                 <img src={post.image} alt={post.title} className="side-post-img" />
              </div>
              <div className="side-post-content">
                <h3 className="side-post-title">{post.title}</h3>
                <p className="side-post-excerpt">{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Regular Posts Grid */}
      <div className="blog-regular-grid">
        {regularPosts.map(post => (
          <a href={post.href} className="regular-post" key={post.id}>
             <div className="regular-post-img-wrapper">
                <img src={post.image} alt={post.title} className="regular-post-img" />
             </div>
            <div className="regular-post-content">
              <h3 className="regular-post-title">{post.title}</h3>
              <p className="regular-post-excerpt">{post.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
