import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { useGSAP } from '@gsap/react';
// import StartCTASection from '../features/landingPage/StartCTASection';
// import VideoSection from '../features/landingPage/VideoSection';
// import FeatureSection from '../features/landingPage/FeatureSection';
// import PurpleCircle from '../features/landingPage/components/PurpleCircle';
import EarthSection from '../features/landingPage/EarthSection';
import IntroSection from '../features/landingPage/IntroSection';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const LandingPage = () => {
  // const [videoEnded, setVideoEnded] = useState(false);
  const [introEnded, setIntroEnded] = useState(false);

  // const circleRef = useRef<HTMLDivElement>(null);
  // const featureSectionRef = useRef<HTMLDivElement>(null);
  // const videoMaskRef = useRef<HTMLDivElement>(null);
  // const ctaRef = useRef<HTMLDivElement>(null);
  // const videoRef = useRef<HTMLVideoElement>(null);

  const earthSectionRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (introEnded) {
      // EarthSection 애니메이션 (opacity 1로 부드럽게 등장)
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
      {/* <div ref={featureSectionRef} className="h-[100vh] w-screen flex items-center justify-center">
        <FeatureSection />
      </div> */}

      {/* CTA 섹션 */}
      {/* <div
        className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: videoEnded ? 1 : 0, pointerEvents: videoEnded ? 'auto' : 'none' }}
        ref={ctaRef}
      >
        <StartCTASection />
      </div> */}
    </div>
  );
};

export default LandingPage;
