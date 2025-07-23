import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PurpleCircle from '../common/PurpleCircle';
import Video from '../common/Video';

import { VideoSectionProps } from '../../types/landing.types';

gsap.registerPlugin(ScrollTrigger);

const VideoSection = ({ setVideoEnded }: VideoSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 초기 세팅
    gsap.set(circleRef.current, { scale: 0.5 });
    gsap.set(videoBoxRef.current, { clipPath: 'circle(0% at 50% 50%)' });

    // 애니메이션 타임라인
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=800',
        scrub: 0.5,
        pin: true,
      },
    });

    // 보라색 원 & 비디오 확대 애니메이션
    tl.to(circleRef.current, { scale: 30, duration: 2, ease: 'none' }).to(
      videoBoxRef.current,
      {
        clipPath: 'circle(100% at 50% 50%)',
        duration: 3,
        ease: 'none',
      },
      '-=1.5'
    );

    // 비디오 재생 트리거
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'center top',
      onEnter: () => {
        setVideoEnded(false);
      },
      onEnterBack: () => {
        setVideoEnded(false);
      },
      onUpdate: (self) => {
        const video = videoRef.current;
        if (!video) return;
        const progress = self.progress;
        if (self.direction === 1 && video.paused && progress > 0.95) {
          video.play().catch(console.log);
        }
        if (self.direction === -1 && !video.paused) {
          video.pause();
        }
      },
      onLeaveBack: () => {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      },
    });

    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black text-white flex items-center justify-center overflow-hidden"
    >
      <Video ref={videoRef} videoBoxRef={videoBoxRef} onVideoEnd={() => setVideoEnded(true)} />
      <PurpleCircle ref={circleRef} />
    </section>
  );
};

export default VideoSection;
