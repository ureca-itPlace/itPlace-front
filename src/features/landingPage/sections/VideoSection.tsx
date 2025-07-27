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
  const rockRefs = useRef<HTMLImageElement[]>([]);

  useGSAP(() => {
    const video = videoRef.current;
    let hasPlayed = false;
    // 초기 세팅
    gsap.set(circleRef.current, { scale: 0.5 });
    gsap.set(videoBoxRef.current, { clipPath: 'circle(0% at 50% 50%)' });
    gsap.set(rockRefs.current, { opacity: 0, rotate: 0 });

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
        x: -1500,
        skewX: 20,
        duration: 6,
        ease: 'power1.out',
      },
      3.2
    );

    tl.to(
      rockRefs.current,
      {
        opacity: 1,
        x: -300,
        rotate: 180,
        duration: 6,
        ease: 'expo.out',
        stagger: 0.2,
      },
      3.2
    );

    tl.fromTo(
      [circleRef.current, videoBoxRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' },
      9.3
    );

    // 보라색 원 & 비디오 확대 애니메이션
    tl.to(circleRef.current, { scale: 30, duration: 2, ease: 'none' }, 9.8).to(
      videoBoxRef.current,
      {
        clipPath: 'circle(100% at 50% 50%)',
        duration: 3,
        ease: 'none',
      },
      10.3
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
      <div className="absolute left-32 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
        <h1 ref={textRef} className="relative custom-font text-[30vh] whitespace-nowrap">
          LET'S EXPLORE TOGETHER
        </h1>
        <img
          ref={(el) => {
            if (el) rockRefs.current[0] = el;
          }}
          src="/images/landing/rock-1.webp"
          alt="rock1"
          className="absolute w-40 h-40 left-0 top-[-5%]"
        />
        <img
          ref={(el) => {
            if (el) rockRefs.current[1] = el;
          }}
          src="/images/landing/rock-2.webp"
          alt="rock2"
          className="absolute w-40 h-40 left-1/4 top-2/3"
        />
        <img
          ref={(el) => {
            if (el) rockRefs.current[2] = el;
          }}
          src="/images/landing/rock-3.webp"
          alt="rock3"
          className="absolute w-40 h-40 right-1/3 top-1/3"
        />
      </div>
    </section>
  );
};

export default VideoSection;
