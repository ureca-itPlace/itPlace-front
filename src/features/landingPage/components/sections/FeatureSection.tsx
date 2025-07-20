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
  }, [videoEnded]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black overflow-hidden flex justify-center items-center text-white text-8xl"
    >
      기능 설명 섹션입니다
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
