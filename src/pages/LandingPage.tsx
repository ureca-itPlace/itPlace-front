import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { useGSAP } from '@gsap/react';
import IntroSection from '../features/landingPage/components/sections/IntroSection';
import EarthSection from '../features/landingPage/components/sections/EarthSection';
import MapSection from '../features/landingPage/components/sections/MapSection';
import FeatureSection from '../features/landingPage/components/sections/FeatureSection';
// import VideoSection from '../features/landingPage/components/sections/VideoSection';
import StartCTASection from '../features/landingPage/components/sections/StartCTASection';
import LoadLanding from '../features/landingPage/components/common/LoadLanding';
// import PurpleCircle from '../features/landingPage/components/common/PurpleCircle';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [introEnded, setIntroEnded] = useState(false);
  // const [videoEnded, setVideoEnded] = useState(false);

  // const circleRef = useRef<HTMLDivElement>(null);
  // const featureSectionRef = useRef<HTMLDivElement>(null);
  // const videoMaskRef = useRef<HTMLDivElement>(null);
  // const ctaRef = useRef<HTMLDivElement>(null);
  // const videoRef = useRef<HTMLVideoElement>(null);

  // const earthSectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!introEnded) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }
  }, [introEnded]);

  if (isLoading) {
    return <LoadLanding />;
  }

  return (
    <div className="relative">
      {introEnded ? (
        <>
          <EarthSection />
          <MapSection />
          <FeatureSection />
          <StartCTASection />
        </>
      ) : (
        <IntroSection onComplete={() => setIntroEnded(true)} />
      )}
    </div>
  );
};

export default LandingPage;
