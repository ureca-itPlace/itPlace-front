import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PurpleCircle from '../common/PurpleCircle';
import VideoSection from './VideoSection';

import { FeatureSectionProps } from '../../types/landing.types.ts';

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = ({ videoEnded, setVideoEnded }: FeatureSectionProps) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    if (!circleRef.current || !sectionRef.current || !videoBoxRef.current) return;

    gsap.fromTo(
      circleRef.current,
      { scale: 0.3 },
      {
        scale: 30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: '+=500',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          markers: true,
        },
        ease: 'none',
      }
    );

    gsap.to(videoBoxRef.current, {
      clipPath: 'circle(100% at 50% 50%)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center',
        end: '+=500',
        scrub: 0.5,
        pin: false,
        markers: true,
      },
      ease: 'power1.inOut',
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'center top',
      onUpdate: (self) => {
        const video = videoRef.current;
        const progress = self.progress;
        if (!video) return;
        // 아래로 스크롤, 거의 끝에 도달했을 때 영상 재생
        if (self.direction === 1 && !videoEnded && video.paused && progress > 0.95) {
          video.play().catch((err) => {
            console.log('비디오 재생 실패:', err);
          });
        }
        // 위로 스크롤 시 영상 정지
        if (self.direction === -1 && !videoEnded && !video.paused) {
          video.pause();
        }
      },
      onLeaveBack: () => {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        setVideoEnded(false);
      },
    });

    ScrollTrigger.refresh();
  }, [videoEnded]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-gray-800 overflow-hidden text-white flex items-center justify-center"
    >
      <div className="w-full h-full flex gap-96 items-center justify-center max-sm:flex-col">
        <div className="flex flex-col gap-28 text-[64px] ml-36">
          <h1>메뉴1</h1>
          <h1>메뉴2</h1>
          <h1>메뉴3</h1>
          <h1>메뉴4</h1>
        </div>
        <div className="flex flex-col w-[1100px] h-full ml-auto">
          <div className="bg-gray-600 flex flex-col items-center justify-center h-screen w-[1100px] ml-auto">
            <div className="flex items-center justify-center mb-20 mt-24 w-[964px] h-[476px]">
              <img
                src="/images/landing/landing-feature-1.png"
                alt="기능-소개1"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-14 ml-16 mr-20">
              <h1 className="text-title-1">지도에서 주변 제휴처를 한눈에!</h1>
              <h4 className="text-2xl leading-loose font-light pb-20">
                이제 복잡한 검색 없이 지도에서 내 주변의 제휴 매장과 혜택을 바로 확인하세요. 현재
                위치를 기준으로 가까운 제휴처들을 표시해 빠르게 찾고 편리하게 이용할 수 있습니다.
              </h4>
            </div>
          </div>
        </div>
      </div>
      {/* 기능 설명 섹션입니다 */}
      <VideoSection
        onVideoEnd={() => {
          setVideoEnded(true);
        }}
        videoBoxRef={videoBoxRef}
        ref={videoRef}
      />
      <PurpleCircle ref={circleRef} />
    </section>
  );
};

export default FeatureSection;
