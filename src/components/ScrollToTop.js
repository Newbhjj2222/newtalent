// src/components/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Ibi nibyo bizamura page hejuru buri gihe
  }, [pathname]);

  return null;
};

export default ScrollToTop;
