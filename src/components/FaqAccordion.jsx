"use client";

import React, { useState, useEffect } from 'react';

import { useLocale } from '@/context/LocaleContext';
import { isArabicLocale } from '@/lib/locale-constants';

const API_BASE_URL = 'https://api-kitchenplanner.lggf-promotor.com/api';

async function fetchFaqsFromDb(locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/faqs?locale=${locale}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!res.ok) return null;
    const items = await res.json();
    
    const uniqueItems = [];
    const seenQuestions = new Set();
    for (const item of items) {
      if (item.question) {
        const trimmedQ = item.question.trim();
        if (!seenQuestions.has(trimmedQ)) {
          seenQuestions.add(trimmedQ);
          uniqueItems.push(item);
        }
      }
    }

    return uniqueItems.map(item => ({
      id: item.id,
      q: item.question,
      a: item.answer
    }));
  } catch (error) {
    console.error(`Error fetching FAQs from DB table for locale ${locale}:`, error);
    return null;
  }
}

export default function FaqAccordion({ data, initialQuestions = [] }) {
  const { path, locale } = useLocale();
  const [openId, setOpenId] = useState(1);
  const [questions, setQuestions] = useState(initialQuestions);

  useEffect(() => {
    let active = true;
    async function loadFaqs() {
      const items = await fetchFaqsFromDb(locale);
      if (active && items) {
        setQuestions(items);
      }
    }
    loadFaqs();
    return () => {
      active = false;
    };
  }, [locale]);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <a href={path('/')} className="faq-back-btn">
          <img 
            src="https://www.lgkitchenplanner.com/sa_en/assets/images/button/Arrow%2011.png" 
            alt="Arrow" 
            className="back-arrow" 
          />
          <span>{isArabicLocale(locale) ? 'رجوع' : 'Back'}</span>
        </a>
        <h1 className="faq-title">{data.title}</h1>
        <p className="faq-subtitle">{data.subtitle}</p>
      </div>
      
      <div className="faq-section">
        <h2 className="faq-section-title">{data.sectionTitle}</h2>
        <div className="faq-list">
          {questions.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <div className="faq-question" onClick={() => toggleItem(item.id)}>
                  <div className="faq-q-icon">Q</div>
                  <div className="faq-q-text">{item.q}</div>
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <div className="faq-a-icon">A</div>
                    <div className="faq-a-text">{item.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
