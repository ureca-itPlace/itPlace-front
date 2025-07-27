import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import PurpleCircle from '../components/PurpleCircle';
import Video from '../components/Video';
import { VideoSectionProps } from '../types/landing.types';

gsap.registerPlugin(ScrollTrigger);

const VideoSection = ({ setVideoEnded }: VideoSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const video = videoRef.current;
    let hasPlayed = false;
    // 초기 세팅
    gsap.set(circleRef.current, { scale: 0.5 });
    gsap.set(videoBoxRef.current, { clipPath: 'circle(0% at 50% 50%)' });

    // 애니메이션 타임라인
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2000',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.from(
      textRef.current,
      {
        opacity: 0,
        y: 80,
        duration: 2,
        ease: 'power2.out',
        delay: 1,
      },
      0
    );

    tl.to(
      textRef.current,
      {
        x: -1300,
        skewX: 20,
        duration: 6,
        ease: 'power1.out',
      },
      2.2
    );

    tl.fromTo(
      [circleRef.current, videoBoxRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' },
      8.3
    );

    // 보라색 원 & 비디오 확대 애니메이션
    tl.to(circleRef.current, { scale: 30, duration: 2, ease: 'none' }, 8.8).to(
      videoBoxRef.current,
      {
        clipPath: 'circle(100% at 50% 50%)',
        duration: 3,
        ease: 'none',
      },
      9.3
    );

    // 비디오 재생 트리거
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=2000', // timeline과 동일
      scrub: true,
      onUpdate: (self) => {
        if (!hasPlayed && self.progress >= 0.9) {
          if (video && video.paused) {
            video.play().catch(console.log);
            setVideoEnded(false);
            hasPlayed = true;
          }
        }
      },
      onLeaveBack: () => {
        if (video) {
          video.pause();
          video.currentTime = 0;
          hasPlayed = false; // ⬅️ 뒤로 갈 때 다시 재생 가능하게 초기화
        }
      },
    });

    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#000000] text-white flex items-center justify-center overflow-hidden"
    >
      <Video ref={videoRef} videoBoxRef={videoBoxRef} onVideoEnd={() => setVideoEnded(true)} />
      <PurpleCircle ref={circleRef} />
      <h1
        ref={textRef}
        className="absolute top-1/2 left-32 -translate-y-1/2 custom-font text-[30vh] whitespace-nowrap"
      >
        WELCOME TO ITPLACE
      </h1>
    </section>
  );
};

export default VideoSection;
