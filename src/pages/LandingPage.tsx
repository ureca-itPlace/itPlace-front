import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useState, useRef, useEffect, lazy } from 'react';

import LoadLanding from '../features/landingPage/components/common/LoadLanding';
import IntroSection from '../features/landingPage/components/sections/IntroSection';
const EarthSection = lazy(() => import('../features/landingPage/components/sections/EarthSection'));
const MapSection = lazy(() => import('../features/landingPage/components/sections/MapSection'));
const FeatureSection = lazy(
  () => import('../features/landingPage/components/sections/FeatureSection')
);
const VideoSection = lazy(() => import('../features/landingPage/components/sections/VideoSection'));
const StartCTASection = lazy(
  () => import('../features/landingPage/components/sections/StartCTASection')
);

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [introEnded, setIntroEnded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const mapSectionRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 로딩 완료
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // 새로 고침 시 최상단으로 이동
  useEffect(() => {
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0);
    };
  }, []);

  // 비디오 종료 후 맨 아래로 이동
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

  if (isLoading) {
    console.log('로딩중');
    return <LoadLanding />;
  }

  return (
    <div className="relative overflow-x-hidden">
      {introEnded ? (
        <>
          <EarthSection />
          <MapSection ref={mapSectionRef} />
          <FeatureSection />
          <VideoSection setVideoEnded={setVideoEnded} />
          {/* 비디오가 끝났을 때만 표시 */}
          {videoEnded && <StartCTASection />}
        </>
      ) : (
        <IntroSection onComplete={() => setIntroEnded(true)} />
      )}
    </div>
  );
};

export default LandingPage;
