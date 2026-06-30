import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ArticleDetail() {
  const { locale, slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${locale || 'sa_en'}/kitchen-blog/${slug}/`, { replace: true });
  }, [locale, slug, navigate]);

  return null;
}
