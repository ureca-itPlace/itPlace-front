import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { useGSAP } from '@gsap/react';
import StartCTASection from '../features/landingPage/StartCTASection';
import VideoSection from '../features/landingPage/VideoSection';
import FeatureSection from '../features/landingPage/FeatureSection';
import PurpleCircle from '../features/landingPage/components/PurpleCircle';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const LandingPage = () => {
  const [videoEnded, setVideoEnded] = useState(false);

  const circleRef = useRef<HTMLDivElement>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    // 보라색 원 & 영상 중심에 고정
    const centerFixedStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
    };

    // 보라색 원 초기 세팅
    gsap.set(circleRef.current, {
      ...centerFixedStyle,
      scale: 0.1,
      opacity: 1,
      zIndex: 30,
    });

    // 영상 마스크 초기 세팅
    gsap.set(videoMaskRef.current, {
      ...centerFixedStyle,
      clipPath: 'circle(10% at 50% 50%)',
      opacity: 0,
      zIndex: 40,
    });

    // 애니메이션 순차 실행
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: featureSectionRef.current,
        start: '20px top',
        end: '+=1000',
        scrub: 0.5,
        markers: true,
      },
    });

    // 원 & 영상 애니메이션
    tl.to(
      circleRef.current,
      {
        scale: 30,
        opacity: 1,
        ease: 'power1.out',
        duration: 5,
      },
      'sync'
    ).to(
      videoMaskRef.current,
      {
        clipPath: 'circle(120% at 50% 50%)',
        opacity: 1,
        ease: 'power1.out',
        duration: 1,
      },
      'sync+=0.1'
    );

    // 스크롤 트리거 생성
    ScrollTrigger.create({
      trigger: featureSectionRef.current,
      start: '20px top',
      end: 'center top',
      pin: true,

      onUpdate: (self) => {
        const video = videoRef.current;
        const progress = self.progress;

        if (!video) return;

        // 비디오가 끝나지 않았고, 거의 끝에 도달했을 때 아래로 스크롤 시 영상 재생
        if (self.direction === 1 && !videoEnded && video.paused && progress > 0.95) {
          video.play().catch((err) => {
            console.log('비디오 재생 실패:', err);
          });
        }

        // 비디오가 끝나지 않았는데 위로 스크롤 시 영상 정지
        if (self.direction === -1 && !videoEnded && !video.paused) {
          video.pause();
        }
      },

      // 역방향 스크롤 후 트리거를 떠났을 때
      onLeaveBack: () => {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        setVideoEnded(false);
      },
    });
  }, []);

  useEffect(() => {
    if (videoEnded && ctaRef.current) {
      gsap.to(ctaRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 1,
      });
    }
  }, [videoEnded]);

  return (
    <div className="relative">
      {/* 보라색 원 */}
      <PurpleCircle ref={circleRef} />

      {/* 비디오 */}
      <div
        ref={videoMaskRef}
        className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center overflow-hidden pointer-events-auto"
        style={{ clipPath: 'circle(5% at 50% 50%)' }}
      >
        <VideoSection
          ref={videoRef}
          onVideoEnd={() => {
            setVideoEnded(true);
          }}
        />
      </div>

      {/* 기능 섹션 */}
      <div ref={featureSectionRef} className="h-[100vh] w-screen flex items-center justify-center">
        <FeatureSection />
      </div>

      {/* CTA 섹션 */}
      <div
        className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: videoEnded ? 1 : 0, pointerEvents: videoEnded ? 'auto' : 'none' }}
        ref={ctaRef}
      >
        <StartCTASection />
      </div>
    </div>
  );
};

export default LandingPage;
