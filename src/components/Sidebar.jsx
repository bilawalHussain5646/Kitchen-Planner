"use client";

import React from 'react';
import { useToast } from './ToastContext';

export default function Sidebar({ data }) {
  const { showNotification } = useToast();

  const handleActionClick = (text) => {
    showNotification(`You selected: "${text}"`);
  };

  return (
    <aside className="sidebar">
        <div className="sidebar-sticky">
            <div className="feature-product-card">
                <div className="feature-header">
                    <p className="feature-title">{data.featureTitle}</p>
                </div>

                <div className="products-list">
                    {data.products.map(product => (
                        <div className="product-item" key={product.id}>
                            <div className="product-img-wrapper">
                                <img src={product.image.src} alt={product.image.alt} className="product-img" />
                            </div>
                            {product.name ? (
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <button 
                                        className={product.button?.class && product.button.class !== "btn-class" ? product.button.class : "btn-action btn-red"} 
                                        onClick={() => product.href
                                            ? window.open(product.href, '_blank', 'noopener,noreferrer')
                                            : handleActionClick(product.button?.text)
                                        }
                                    >
                                        {product.button?.text}
                                    </button>
                                </div>
                            ) : (
                                <div className="product-actions">
                                    <button 
                                        className={product.button?.class && product.button.class !== "btn-class" ? product.button.class : "btn-action btn-green"} 
                                        onClick={() => product.href
                                            ? window.open(product.href, '_blank', 'noopener,noreferrer')
                                            : handleActionClick(product.button?.text)
                                        }
                                    >
                                        {product.button?.text}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </aside>
  );
}
