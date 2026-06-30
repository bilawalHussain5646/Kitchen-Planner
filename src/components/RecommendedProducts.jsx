'use client';

import React, { useRef, useState, useEffect } from 'react';

import { useLocale } from '@/context/LocaleContext';
import { scrollHorizontalPrev, scrollHorizontalNext } from '@/lib/scroll-direction';

const API_BASE_URL = 'https://api-kitchenplanner.lggf-promotor.com/api';

async function fetchRecommendedProducts(locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/products?locale=${locale}`);
    if (!res.ok) return [];
    const items = await res.json();
    return items.map(item => {
      const details = item.details || item;
      return {
        id: item.id || details.sku || Math.random().toString(),
        code: details.sku || details.code || '',
        name: details.name || '',
        img: details.image || details.img || '',
        link: details.pdfUrl || details.link || '#'
      };
    });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
}

export default function RecommendedProducts({ copy, products: initialProducts }) {
  const { path, locale } = useLocale();
  const [products, setProducts] = useState([]);
  const productsDetailPage = path('/built-in-products');
  const sliderRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      const items = await fetchRecommendedProducts(locale);
      if (active && items.length > 0) {
        setProducts(items);
      }
    }
    loadProducts();
    return () => {
      active = false;
    };
  }, [locale]);

  const getScrollStep = () => {
    if (!sliderRef.current) return 320;
    const card = sliderRef.current.querySelector('.recproducts-card');
    const cardWidth = card ? card.offsetWidth : 300;
    const style = window.getComputedStyle(sliderRef.current);
    const gap = parseInt(style.columnGap || style.gap || '20', 10);
    return cardWidth + gap;
  };
  const scrollLeft = () => scrollHorizontalPrev(sliderRef.current, getScrollStep(), locale);
  const scrollRight = () => scrollHorizontalNext(sliderRef.current, getScrollStep(), locale);

  return (
    <section className="homepage-recproducts-section">
      <div className="homepage-recproducts-container">
        <div className="recproducts-header">
          <h2 className="recproducts-title">{copy.title}</h2>
          <div className="recproducts-controls">
            <a href={productsDetailPage} className="faq-header-btn">{copy.viewAll}</a>

            <div className="recproducts-arrows">
              <button
                className="recproducts-arrow-btn"
                onClick={scrollLeft}
                aria-label="Scroll left"
              >
                <img src="https://lgkitchenplanner.com/sa_en/assets/images/products/left-arrow.svg" alt="" />
              </button>
              <button
                className="recproducts-arrow-btn"
                onClick={scrollRight}
                aria-label="Scroll right"
              >
                <img src="https://lgkitchenplanner.com/sa_en/assets/images/products/right-arrow.svg" alt="" />
              </button>
            </div>
          </div>
        </div>

        <div className="recproducts-slider" ref={sliderRef}>
          {products.map((product) => (
            <div key={product.id} className="recproducts-card">
              <div className="recproducts-card-info">
                <span className="recproducts-code">{product.code}</span>
                <h3 className="recproducts-name">{product.name}</h3>
              </div>
              <div className="recproducts-img-wrapper">
                <img src={product.img} alt={product.name} className="recproducts-img" />
              </div>
              <div className="recproducts-card-footer">
                <a href={product.link} className="recproducts-buy-btn">
                  {copy.buyNow}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
