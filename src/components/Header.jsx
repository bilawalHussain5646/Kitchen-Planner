import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import { useLocale } from '@/context/LocaleContext';
import {
  getLocaleFromPathname,
  isArabicLocale,
  switchLocalePath,
} from '@/lib/locale-constants';

function isServiceNavHref(href) {
  return (
    href.includes('/installation-guides') || href.includes('/e-catalogue')
  );
}

export default function Header({ data }) {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const { locale, path } = useLocale();
    const [isScrolled, setIsScrolled] = useState(false);
    const [lang, setLang] = useState(isArabicLocale(locale) ? 'AR' : 'EN');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { showNotification } = useToast();

    const homePath = path('/');
    const isHome =
      pathname === homePath ||
      pathname === `${homePath}/` ||
      pathname === '/';

    const servicesNav = data?.servicesNav;
    const serviceItems =
      servicesNav?.items ??
      data?.navLinks?.filter((l) => isServiceNavHref(l.href)) ??
      [];

    const servicesActive =
      pathname.includes('/installation-guides') || pathname.includes('/e-catalogue');

    useEffect(() => {
        setLang(isArabicLocale(getLocaleFromPathname(pathname)) ? 'AR' : 'EN');
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            setIsServicesOpen(false);
        }
    }, [isMobileMenuOpen]);

    const handleLangSelect = (selectedLang, e) => {
        e.stopPropagation();
        const targetLocale = selectedLang === 'AR' ? 'sa_ar' : 'sa_en';
        navigate(switchLocalePath(pathname, targetLocale));
        setIsLangOpen(false);
    };

    const handleConnectClick = () => {
        showNotification(`You selected: "${data.connectButtonText}"`);
    };

    const closeMenus = () => {
        setIsMobileMenuOpen(false);
        setIsServicesOpen(false);
    };

    const headerStyle = isScrolled ? {
        backgroundColor: 'rgba(244, 239, 235, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.3s ease'
    } : {
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        borderBottom: 'none',
        boxShadow: 'none',
        transition: 'all 0.3s ease'
    };

    const navLinkClass = (href) =>
      `nav-link ${pathname === href || pathname === `${href}/` ? 'active' : ''}`;

    const renderServicesDropdown = () => {
        if (!servicesNav?.label || serviceItems.length === 0) return null;

        return (
            <li style={{ position: 'relative' }}>
                <button
                    type="button"
                    className={`nav-link services-btn ${servicesActive ? 'active' : ''}`}
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    aria-expanded={isServicesOpen}
                    aria-haspopup="true"
                    suppressHydrationWarning
                >
                    {servicesNav.label}
                    <i className="fas fa-caret-down caret-icon" aria-hidden="true" />
                </button>
                {isServicesOpen && (
                    <div className="services-dropdown-menu">
                        {serviceItems.map((item) => {
                            const resolvedItemHref = path(item.href);
                            return (
                                <a
                                    key={item.href}
                                    href={resolvedItemHref}
                                    className={`services-dropdown-item ${
                                      pathname === resolvedItemHref || pathname === `${resolvedItemHref}/`
                                        ? 'active'
                                        : ''
                                    }`}
                                    onClick={closeMenus}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                    </div>
                )}
            </li>
        );
    };

    const renderNavLinks = () => {
        let servicesInserted = false;

        return (
            <>
                {!isHome && (
                    <li>
                        <a
                            href={homePath}
                            className={navLinkClass(homePath)}
                            onClick={closeMenus}
                        >
                            {isArabicLocale(locale) ? 'الرئيسية' : 'Home'}
                        </a>
                    </li>
                )}
                {data.navLinks.map((link) => {
                    const resolvedHref = path(link.href);
                    if (isServiceNavHref(link.href)) {
                        if (!servicesInserted) {
                            servicesInserted = true;
                            return (
                                <React.Fragment key="services-nav">
                                    {renderServicesDropdown()}
                                </React.Fragment>
                            );
                        }
                        return null;
                    }

                    return (
                        <li key={link.href}>
                            <a
                                href={resolvedHref}
                                className={navLinkClass(resolvedHref)}
                                onClick={closeMenus}
                            >
                                {link.label}
                            </a>
                        </li>
                    );
                })}
            </>
        );
    };

    return (
        <header className="header" dir={`${lang === 'EN' ? 'ltr' : 'rtl'}`} style={headerStyle}>
            <div className="header-container">
                <button className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Open Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} suppressHydrationWarning={true}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className="logo">
                    <a href={homePath} aria-label="LG Home">
                        <img src={data.logo.url} alt={data.logo.alt} className="brand-logo-img" />
                    </a>
                </div>

                <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <ul className="nav-list">
                        {renderNavLinks()}
                    </ul>
                    <div className="mobile-header-actions">
                        <div className="language-dropdown" style={{ position: 'relative' }}>
                            <button className="lang-btn" aria-label="Select Language" onClick={() => setIsLangOpen(!isLangOpen)} suppressHydrationWarning={true}>
                                <i className="fas fa-globe text-black"></i>
                                <span style={{ color: '#000', fontSize: '14px', fontWeight: '500' }}>{lang}</span>
                                <i className="fas fa-caret-down caret-icon"></i>
                            </button>
                            {isLangOpen && (
                                <div className="lang-dropdown-menu">
                                    <button className={`lang-option ${lang === 'EN' ? 'active' : ''}`} onClick={(e) => handleLangSelect('EN', e)} suppressHydrationWarning={true}>EN</button>
                                    <button className={`lang-option ${lang === 'AR' ? 'active' : ''}`} onClick={(e) => handleLangSelect('AR', e)} suppressHydrationWarning={true}>AR</button>
                                </div>
                            )}
                        </div>
                        <button className="btn-connect" onClick={handleConnectClick} suppressHydrationWarning={true}>{data.connectButtonText}</button>
                    </div>
                </nav>

                <div className="header-right">
                    <div className="language-dropdown" style={{ position: 'relative' }}>
                        <button className="lang-btn" aria-label="Select Language" onClick={() => setIsLangOpen(!isLangOpen)} suppressHydrationWarning={true}>
                            <i className="fas fa-globe text-black"></i>
                            <span style={{ color: '#000', fontSize: '20px', fontWeight: '500' }}>{lang}</span>
                            <i className="fas fa-caret-down caret-icon"></i>
                        </button>
                        {isLangOpen && (
                            <div className="lang-dropdown-menu">
                                <button className={`lang-option ${lang === 'EN' ? 'active' : ''}`} onClick={(e) => handleLangSelect('EN', e)} suppressHydrationWarning={true}>EN</button>
                                <button className={`lang-option ${lang === 'AR' ? 'active' : ''}`} onClick={(e) => handleLangSelect('AR', e)} suppressHydrationWarning={true}>AR</button>
                            </div>
                        )}
                    </div>
                    <a className="btn-connect" href={'https://lgkitchenplanner.com/sj-built-in-kitchen-planner/'}>{data.connectButtonText}</a>
                </div>
            </div>
        </header>
    );
}
