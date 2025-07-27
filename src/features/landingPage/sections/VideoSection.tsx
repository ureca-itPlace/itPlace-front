import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import PurpleCircle from '../components/PurpleCircle';
import Video from '../components/Video';
import { VideoSectionProps } from '../types/landing.types';

gsap.registerPlugin(ScrollTrigger);

const VideoSection = ({ videoEnded, setVideoEnded }: VideoSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const rockRefs = useRef<HTMLImageElement[]>([]);

  useGSAP(() => {
    const video = videoRef.current;
    // 초기 세팅
    gsap.set(circleRef.current, { scale: 0.5 });
    gsap.set(videoBoxRef.current, { clipPath: 'circle(0% at 50% 50%)' });
    gsap.set(rockRefs.current, { opacity: 0, rotate: 0 });

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

    // 텍스트 등장
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

    // 텍스트 x축 이동
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

    // 암석 x축 이동
    tl.to(
      rockRefs.current,
      {
        opacity: 1,
        x: -300,
        rotate: 270,
        duration: 6,
        ease: 'expo.out',
        stagger: 0.2,
      },
      3.2
    );

    // 보라색 원 & 비디오 마스크 등장
    tl.fromTo(
      [circleRef.current, videoBoxRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' },
      9.3
    );

    // 보라색 원 & 비디오 확대
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
      end: '+=2000',
      scrub: true,
      onUpdate: (self) => {
        if (!video) return;
        if (self.direction === 1 && !videoEnded && video.paused && self.progress >= 0.95) {
          video.play().catch(console.log);
        }

        // 역방향으로 올라갈 때 영상 일시 정지
        if (self.direction === -1 && !videoEnded && !video.paused) {
          video.pause();
        }
      },

      onLeaveBack: () => {
        // 위로 완전히 벗어나면 처음부터 시작
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        setVideoEnded(false);
      },

      onEnterBack: () => {
        setVideoEnded(false);
        // 다시 아래로 돌아오면 시작
        if (video && video.paused) {
          video.play().catch(console.log);
        }
      },
    });

    ScrollTrigger.refresh();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      data-theme="dark"
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
          className="absolute w-40 h-40 right-[45%] top-1/3"
        />
      </div>
    </section>
  );
};

export default VideoSection;
