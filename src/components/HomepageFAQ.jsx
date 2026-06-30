'use client';

import React, { useState, useEffect } from 'react';

import { useLocale } from '@/context/LocaleContext';

function FaqAnswerText({ text }) {
  const lines = text.split('\n');
  return (
    <p className="faq-answer-text">
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
}

function FaqColumnContent({ item, continueReadingLabel, faqHref }) {
  return (
    <>
      <div className="faq-box faq-question-box">
        <div className="faq-user-profile">
          <img
            src={item.questionUser.avatar}
            alt={item.questionUser.avatarAlt}
            className="faq-avatar"
          />
          <div className="faq-user-info">
            <span className="faq-username">{item.questionUser.name}</span>
            <span className="faq-user-role">{item.questionUser.role}</span>
          </div>
        </div>
        <hr className="faq-divider" />
        <h3 className="faq-question-text">{item.question}</h3>
      </div>
      <div className="faq-box faq-answer-box">
        <div className="faq-user-profile">
          <img
            src={item.answerUser.avatar}
            alt={item.answerUser.avatarAlt}
            className="faq-avatar"
          />
          <div className="faq-user-info">
            <span className="faq-username">{item.answerUser.name}</span>
            <span className="faq-user-role faq-role-red">{item.answerUser.role}</span>
          </div>
        </div>
        <hr className="faq-divider" />
        <FaqAnswerText text={item.answer} />
        <div className="faq-btn-wrapper">
          <a href={faqHref} className="faq-btn">
            {continueReadingLabel}
          </a>
        </div>
      </div>
    </>
  );
}

function FaqHeader({ copy, faqHref }) {
  return (
    <div className="faq-header">
      <h2 className="faq-header-title">{copy.sectionTitle}</h2>
      <p className="faq-header-desc">{copy.sectionDescription}</p>
      <a href={faqHref} className="faq-header-btn">
        {copy.learnMore}
      </a>
    </div>
  );
}

export default function HomepageFAQ({ copy }) {
  const { path } = useLocale();
  const faqHref = path('/faq');
  const items = copy.items ?? [];
  const [activeIndex, setActiveIndex] = useState(1);
  const [prevActiveIndex, setPrevActiveIndex] = useState(1);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = (clientX) => {
    setDragStart(clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 60;
    if (dragOffset < -threshold) {
      setPrevActiveIndex(activeIndex);
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else if (dragOffset > threshold) {
      setPrevActiveIndex(activeIndex);
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }
    setDragOffset(0);
  };

  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  const isMobile = windowWidth <= 768;
  const cardWidth = isMobile ? windowWidth * 0.8 : 380;
  const overlapDistance = isMobile ? cardWidth * 0.62 : 255;

  const getCardStyle = (index) => {
    let diff = index - activeIndex;
    if (diff < -1) diff += items.length;
    if (diff > 1) diff -= items.length;

    const isWrapping =
      (prevActiveIndex === 1 && activeIndex === 2 && index === 0) ||
      (prevActiveIndex === 2 && activeIndex === 1 && index === 0) ||
      (prevActiveIndex === 2 && activeIndex === 0 && index === 1) ||
      (prevActiveIndex === 0 && activeIndex === 2 && index === 1) ||
      (prevActiveIndex === 0 && activeIndex === 1 && index === 2) ||
      (prevActiveIndex === 1 && activeIndex === 0 && index === 2);

    let scale = 1;
    let translateX = 0;
    let zIndex = 2;
    let opacity = 1;

    if (diff === 0) {
      scale = 1.05;
      translateX = 0;
      zIndex = 10;
      opacity = 1;
    } else if (diff === -1) {
      scale = 0.92;
      translateX = -overlapDistance;
      zIndex = 5;
      opacity = 0.85;
    } else if (diff === 1) {
      scale = 0.92;
      translateX = overlapDistance;
      zIndex = 5;
      opacity = 0.85;
    }

    if (isDragging) {
      const constrainedDrag = Math.max(Math.min(dragOffset, overlapDistance), -overlapDistance);
      translateX += constrainedDrag;
    }

    return {
      transform: `translate3d(calc(-50% + ${translateX}px), -50%, 0) scale(${scale})`,
      zIndex,
      opacity,
      transition:
        isDragging || isWrapping
          ? 'none'
          : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, z-index 0.4s ease',
      left: '50%',
      top: '50%',
      position: 'absolute',
    };
  };

  if (!isMobile) {
    return (
      <section className="homepage-faq-section">
        <div className="homepage-faq-container">
          <FaqHeader copy={copy} faqHref={faqHref} />
          <div className="faq-grid">
            {items.map((item) => (
              <div key={item.question} className="faq-column">
                <FaqColumnContent
                  item={item}
                  continueReadingLabel={copy.continueReading}
                  faqHref={faqHref}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="homepage-faq-section">
      <div className="homepage-faq-container">
        <FaqHeader copy={copy} faqHref={faqHref} />
      </div>

      <div className="faq-grid-bg-wrapper">
        <div className="homepage-faq-container" style={{ position: 'relative', overflow: 'visible' }}>
          <div
            className="faq-slider-container"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {items.map((item, index) => (
              <div
                key={item.question}
                className={`faq-column-slider ${activeIndex === index ? 'active' : ''}`}
                style={getCardStyle(index)}
                onClick={() => {
                  if (activeIndex !== index) {
                    setPrevActiveIndex(activeIndex);
                    setActiveIndex(index);
                  }
                }}
              >
                <FaqColumnContent
                  item={item}
                  continueReadingLabel={copy.continueReading}
                  faqHref={faqHref}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
