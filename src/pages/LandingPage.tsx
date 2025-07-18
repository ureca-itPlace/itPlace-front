import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { useGSAP } from '@gsap/react';
import StartCTASection from '../features/landingPage/StartCTASection';
import VideoSection from '../features/landingPage/VideoSection';
import FeatureSection from '../features/landingPage/FeatureSection';
import PurpleCircle from '../features/landingPage/components/PurpleCircle';
import EarthSection from '../features/landingPage/EarthSection';
import IntroSection from '../features/landingPage/IntroSection';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const LandingPage = () => {
  const [introEnded, setIntroEnded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const circleRef = useRef<HTMLDivElement>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const earthSectionRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLDivElement>(null);

  // 지구 섹션 등장 애니메이션
  useEffect(() => {
    if (introEnded) {
      gsap.to(earthSectionRef.current, {
        opacity: 1,
        zIndex: 20,
        duration: 2,
        onComplete: () => {
          console.log('지구 등장 완료');
        },
      });
    }
  }, [introEnded]);

  // EarthSection에서 스크롤 활성화
  useEffect(() => {
    if (!introEnded) {
      // IntroSection에서 스크롤 비활성화
      document.documentElement.style.overflow = 'hidden';
    } else {
      // EarthSection에서 스크롤 활성화
      document.documentElement.style.overflow = 'auto';
    }
  }, [introEnded]);

  return (
    <div className="relative">
      {introEnded ? (
        <div ref={earthSectionRef} style={{ opacity: 0, zIndex: -1 }}>
          <EarthSection />
        </div>
      ) : (
        <div ref={introSectionRef}>
          <IntroSection onComplete={() => setIntroEnded(true)} />
        </div>
      )}

      {/* 기능 섹션 */}
      <div
        ref={featureSectionRef}
        className="relative h-screen w-full flex items-center justify-center"
      >
        <FeatureSection />
      </div>
    </div>
  );
};

export default LandingPage;
