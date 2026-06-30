'use client';

import React from 'react';

import { useLocale } from '@/context/LocaleContext';

export default function OurServices({ copy }) {
  const { path } = useLocale();
  return (
    <section className="homepage-services-section">
      <div className="services-header-wrapper">
        <div className="services-header-box">
          <h2 className="services-header-title">{copy.title}</h2>
        </div>
      </div>

      <div className="homepage-services-container">
        <div className="services-grid">
          <div className="services-card">
            <div className="services-card-info">
              <h3 className="services-card-title">{copy.installationGuides.cardTitle}</h3>
              <p className="services-card-desc">{copy.installationGuides.description}</p>
              <a href={path('/installation-guides')} className="faq-header-btn">
                {copy.installationGuides.button}
              </a>
            </div>
            <div className="services-card-image-wrapper">
              <img
                src="https://lgkitchenplanner.com/sa_en/assets/images/services/our-services-oven.png"
                alt={copy.installationGuides.imageAlt}
                className="services-card-img img-oven"
              />
            </div>
          </div>

          <div className="services-card">
            <div className="services-card-info">
              <h3 className="services-card-title">{copy.eCatalogue.cardTitle}</h3>
              <p className="services-card-desc">{copy.eCatalogue.description}</p>
              <a href={path('/e-catalogue')} className="faq-header-btn">
                {copy.eCatalogue.button}
              </a>
            </div>
            <div className="services-card-image-wrapper">
              <img
                src="https://lgkitchenplanner.com/sa_en/assets/images/services/catalogue-mockup.png"
                alt={copy.eCatalogue.imageAlt}
                className="services-card-img img-catalogue"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
