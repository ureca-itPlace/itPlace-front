import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { debounce } from 'lodash';
import { lazy, useEffect, useLayoutEffect, useState } from 'react';
import MobileHeader from '../components/MobileHeader';
import { useHeaderThemeObserver } from '../hooks/useHeaderThemeObserver';
import CustomCursor from '../features/landingPage/components/CustomCursor';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

import HeroSection from '../features/landingPage/sections/HeroSection';
import LoadingScreen from '../features/landingPage/components/LoadingScreen';
const MapSection = lazy(() => import('../features/landingPage/sections/MapSection'));
const FeatureSection = lazy(() => import('../features/landingPage/sections/FeatureSection'));
const VideoSection = lazy(() => import('../features/landingPage/sections/VideoSection'));
const StartCTASection = lazy(() => import('../features/landingPage/sections/StartCTASection'));

const LandingPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  // 헤더 색상 변경을 위한 섹션 색상 감지
  const [theme, setTheme] = useState<string>('light');
  useHeaderThemeObserver(setTheme);

  useEffect(() => {
    const handleResize = debounce(() => {
      ScrollTrigger.refresh();
    }, 300);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 새로 고침 시 최상단으로 이동
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 비디오 종료 후 스크롤 맨 아래로 이동
  useEffect(() => {
    if (videoEnded) {
      console.log('비디오 종료');
      gsap.to(window, {
        scrollTo: { y: 'max', autoKill: false },
        duration: 0.6,
        ease: 'power2.inOut',
      });
    }
  }, [videoEnded]);

  return (
    <>
      {showIntro ? (
        <LoadingScreen onFinish={() => setShowIntro(false)} />
      ) : (
        <div className="relative bg-white z-20 overflow-x-hidden">
          <MobileHeader theme={theme} backgroundColor="transparent" />
          <HeroSection />
          <MapSection />
          <FeatureSection />
          <VideoSection setVideoEnded={setVideoEnded} videoEnded={videoEnded} />
          <div style={{ display: videoEnded ? 'block' : 'none' }}>
            <StartCTASection />
          </div>
          <CustomCursor />
        </div>
      )}
    </>
  );
};

export default LandingPage;
