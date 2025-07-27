import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { lazy, useEffect, useState } from 'react';
import MobileHeader from '../components/MobileHeader';
import StartCTASection from '../features/landingPage/sections/StartCTASection';
import { useHeaderThemeObserver } from '../hooks/useHeaderThemeObserver';

gsap.registerPlugin(ScrollToPlugin);

const EarthSection = lazy(() => import('../features/landingPage/sections/EarthSection'));
const MapSection = lazy(() => import('../features/landingPage/sections/MapSection'));
const FeatureSection = lazy(() => import('../features/landingPage/sections/FeatureSection'));
const VideoSection = lazy(() => import('../features/landingPage/sections/VideoSection'));
// const StartCTASection = lazy(() => import('../features/landingPage/sections/StartCTASection'));

const LandingPage = () => {
  // 지구 로드 상태
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [theme, setTheme] = useState<string>('light');
  useHeaderThemeObserver(setTheme);

  // 새로 고침 시 최상단으로 이동
  useEffect(() => {
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0);
    };
  }, []);

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
    <div className="relative bg-white z-20 overflow-x-hidden">
      {/* 지구 */}
      <EarthSection onLoaded={() => setIsLoaded(true)} />

      {/* 헤더 */}
      {/* {isLoaded && (isMobile || isTablet ? <MobileHeader /> : <Header variant="glass" />)} */}
      {isLoaded && <MobileHeader theme={theme} />}
      {/* 더미 박스 */}
      <div className="h-[65vh]" />
      {/* 지도 */}
      <MapSection />
      {/* 기능 설명 */}
      <FeatureSection />
      {/* 비디오 & CTA */}
      <VideoSection setVideoEnded={setVideoEnded} videoEnded={videoEnded} />
      {/* CTA */}
      {videoEnded && <StartCTASection />}
    </div>
  );
};

export default LandingPage;
