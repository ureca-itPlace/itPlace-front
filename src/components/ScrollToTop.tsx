// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 경로가 바뀔 때마다 스크롤 맨 위로 이동
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
