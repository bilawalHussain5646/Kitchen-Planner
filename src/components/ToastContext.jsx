"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showNotification = useCallback((message) => {
    setToast({ message, id: Date.now() });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showNotification }}>
      {children}
      {toast && <Toast message={toast.message} />}
    </ToastContext.Provider>
  );
};

const Toast = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="lg-toast"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#A50034',
        color: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '6px',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
        zIndex: '1000',
        opacity: isVisible ? '1' : '0',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {message}
    </div>
  );
};
