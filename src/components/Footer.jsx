"use client";

import React from 'react';

import { useToast } from './ToastContext';
import { useLocale } from '@/context/LocaleContext';

import footerEn from '@/data/footer.json';
import footerAr from '@/data/footer.ar.json';

export default function Footer({ data }) {
  const { showNotification } = useToast();
  const { path, locale } = useLocale();

  const footerData = data || (locale === 'sa_ar' ? footerAr : footerEn);

  const handleSubscribe = (e) => {
    e.preventDefault();
    showNotification("You've subscribed successfully!");
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Column 1: Stay Connected */}
        <div className="footer-col footer-col-newsletter">
          {/* <h4 className="footer-col-heading">{footerData.newsletterTitle}</h4>
          <form className="newsletter-form-stacked" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder={footerData.newsletterPlaceholder || 'Enter your email'}
              required
              className="newsletter-input-stacked"
              suppressHydrationWarning={true}
            />
            <button type="submit" className="newsletter-btn-pill" suppressHydrationWarning={true}>
              {footerData.newsletterButton}
            </button>
          </form> */}
        </div>

        {/* Column 2: Main Menu */}
        <div className="footer-col">
          <h4 className="footer-col-heading">{footerData.mainMenu.title}</h4>
          <ul className="footer-col-list">
            {footerData.mainMenu.links.map((link, i) => {
              const label = typeof link === 'object' ? link.label : link;
              const href = typeof link === 'object' ? link.href : '#';
              const resolvedHref = href.startsWith('http') ? href : path(href);

              return (
                <li key={i}>
                  {href.startsWith('http') ? (
                    <a href={resolvedHref} className="footer-col-link" target="_blank" rel="noopener noreferrer">
                      {label}
                    </a>
                  ) : (
                    <a href={resolvedHref} className="footer-col-link">
                      {label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3: Customer Support */}
        <div className="footer-col">
          <h4 className="footer-col-heading">{footerData.customerSupport.title}</h4>
          {footerData.customerSupport.sections.map((section, i) => (
            <div className="footer-support-section" key={i}>
              <p className="footer-support-label">{section.label}</p>
              {section.items.map((item, j) => (
                <p className="footer-support-item" key={j}>{item}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Column 4: Address */}
        <div className="footer-col">
          <h4 className="footer-col-heading">{footerData.address.title}</h4>
          <p className="footer-address-text">{footerData.address.text}</p>
          <div className="footer-socials">
            {footerData.address.socials.map((social, i) => (
              <a key={i} href={social.href} className="footer-social-icon" aria-label={social.name} onClick={(e) => e.preventDefault()}>
                {social.name === 'Facebook' && (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                {social.name === 'X' && (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {social.name === 'YouTube' && (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>{footerData.copyright}</p>
      </div>
    </footer>
  );
}
