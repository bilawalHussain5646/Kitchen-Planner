"use client";

import React from 'react';
import { useToast } from './ToastContext';

export default function ArticleContent({ data, heroImage }) {
  const { showNotification } = useToast();

  const handleArticleClick = (e) => {
    const link = e.target.closest('.brand-link');
    if (link) {
      e.preventDefault();
      const text = link.getAttribute('data-click') || link.textContent;
      showNotification(`Navigating to category: ${text}`);
    }
  };

  return (
    <article className="post-content">
        <div className="hero-image-wrapper">
            <img src={heroImage.src} alt={heroImage.alt} className="hero-image" />
        </div>

        <div className="article-body" onClick={handleArticleClick}>
            {data.introParagraphs.map((paragraph, index) => (
                <p 
                    key={index} 
                    className={index === 0 ? "intro-paragraph" : undefined} 
                    dangerouslySetInnerHTML={{ __html: paragraph }} 
                />
            ))}

            {data.sections.map((section, index) => (
                <section className="content-section" key={index}>
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((para, pIndex) => (
                        <p key={pIndex} dangerouslySetInnerHTML={{ __html: para }} />
                    ))}
                </section>
            ))}
        </div>
    </article>
  );
}
