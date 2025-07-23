import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useState, useEffect, lazy } from 'react';

import LoadLanding from '../features/landingPage/components/LoadLanding';
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
  const [videoEnded, setVideoEnded] = useState(false);

  // 컴포넌트 마운트 시 로딩 완료
  useEffect(() => {
    // 4초 후 로딩 완료
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
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
    return <LoadLanding />;
  }

  return (
    <div className="relative h-full w-full overflow-x-hidden bg-white">
      <EarthSection />
      <MapSection />
      <FeatureSection />
      <VideoSection setVideoEnded={setVideoEnded} />
      {/* 비디오가 끝났을 때만 표시 */}
      {videoEnded && <StartCTASection />}
    </div>
  );
};

export default LandingPage;
