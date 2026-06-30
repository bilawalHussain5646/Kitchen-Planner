import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from '@/pages/Home';
import BuiltInProducts from '@/pages/BuiltInProducts';
import Faq from '@/pages/Faq';
import ECatalogue from '@/pages/ECatalogue';
import InstallationGuides from '@/pages/InstallationGuides';
import KitchenBlog from '@/pages/KitchenBlog';
import KitchenBlogDetail from '@/pages/KitchenBlogDetail';
import ArticleDetail from '@/pages/ArticleDetail';
import NotFound from '@/pages/NotFound';
import LocaleDocument from '@/components/LocaleDocument';
import { LocaleProvider } from '@/context/LocaleContext';
import { isValidLocale } from '@/lib/locale-constants';

function LocaleRouteWrapper({ children }) {
  const { locale } = useParams();
  const valid = isValidLocale(locale);
  const resolvedLocale = valid ? locale : 'sa_en';
  return (
    <LocaleProvider locale={resolvedLocale}>
      {valid ? children : <NotFound />}
    </LocaleProvider>
  );
}

export default function App() {
  return (
    <Router>
      <LocaleDocument />
      <Routes>
        {/* Redirect empty root to sa_en */}
        <Route path="/" element={<Navigate to="/sa_en/" replace />} />
        
        {/* Localized routes */}
        <Route path="/:locale/" element={<LocaleRouteWrapper><Home /></LocaleRouteWrapper>} />
        <Route path="/:locale/built-in-products/" element={<LocaleRouteWrapper><BuiltInProducts /></LocaleRouteWrapper>} />
        <Route path="/:locale/faq/" element={<LocaleRouteWrapper><Faq /></LocaleRouteWrapper>} />
        <Route path="/:locale/e-catalogue/" element={<LocaleRouteWrapper><ECatalogue /></LocaleRouteWrapper>} />
        <Route path="/:locale/installation-guides/" element={<LocaleRouteWrapper><InstallationGuides /></LocaleRouteWrapper>} />
        <Route path="/:locale/kitchen-blog/" element={<LocaleRouteWrapper><KitchenBlog /></LocaleRouteWrapper>} />
        <Route path="/:locale/kitchen-blog/:slug/" element={<LocaleRouteWrapper><KitchenBlogDetail /></LocaleRouteWrapper>} />
        <Route path="/:locale/article/:slug/" element={<LocaleRouteWrapper><ArticleDetail /></LocaleRouteWrapper>} />
        
        {/* Fallback wildcard route to NotFound */}
        <Route path="*" element={<LocaleRouteWrapper><NotFound /></LocaleRouteWrapper>} />
      </Routes>
    </Router>
  );
}
