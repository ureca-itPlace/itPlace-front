// src/components/ScrollToTop.tsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const isMainPage = pathname === '/main';
    const isMobile = window.innerWidth < 768;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isMainPage && isMobile && isSafari) {
      // 메인 페이지 + 모바일 + Safari: 특별 처리
      const forceScroll = () => {
        // Safari에서 overflow hidden이 적용되기 전에 여러 번 스크롤 시도
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // 추가로 한 번 더 시도
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
      };

      // 즉시 실행
      forceScroll();
      
      // MainPageLayout의 overflow hidden 적용을 기다렸다가 다시 시도
      setTimeout(forceScroll, 50);
      setTimeout(forceScroll, 100);
      setTimeout(forceScroll, 200);
    } else {
      // 일반적인 경우: 기존 방식
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
