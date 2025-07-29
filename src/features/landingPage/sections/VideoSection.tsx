import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import PurpleCircle from '../components/PurpleCircle';
import Video from '../components/Video';
import { VideoSectionProps } from '../types/landing.types';
import { useResponsive } from '../../../hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

const VideoSection = ({ videoEnded, setVideoEnded }: VideoSectionProps) => {
  const { isMobile, isTablet } = useResponsive();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLHeadingElement[]>([]);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  const texts = [
    <>
      LET'S <span className="custom-font text-purple04">EXPLORE</span>
      <span className="align-text-top">🌍</span>TOGETHER
    </>,
    <>
      FIND<span className="align-text-top">⭐</span>YOUR{' '}
      <span className="custom-font inline-block text-purple04 border-4 px-10">MEMBERSHIP</span>
    </>,
    <>
      <span className="custom-font text-purple04">BENEFITS</span> AROUND YOU
      <span className="align-text-top">🐰</span>
    </>,
  ];

  useGSAP(() => {
    const video = videoRef.current;
    // 초기 세팅
    gsap.set(circleRef.current, { scale: 0.5 });
    gsap.set(videoBoxRef.current, { clipPath: 'circle(0% at 50% 50%)' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2600',
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 텍스트 등장
    tl.from(textRefs.current, {
      opacity: 0,
      y: 80,
      duration: 2,
      ease: 'power2.out',
      delay: 1,
      stagger: 0.2,
    });

    // 텍스트 X축 개별 이동
    textRefs.current.forEach((el, idx) => {
      tl.to(
        el,
        {
          x: idx % 2 === 0 ? (isMobile ? 1800 : 2400) : -(isMobile ? 2400 : isTablet ? 3200 : 3000),
          skewX: idx % 2 === 0 ? -20 : 20,
          duration: 7,
          ease: 'power1.out',
        },
        3.2 + idx * 0.2
      );
    });

    tl.to(h1Ref.current, { color: 'white', duration: 2 }, 9.7);

    // 보라색 원 & 비디오 마스크 등장
    tl.fromTo(
      [circleRef.current, videoBoxRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' },
      11
    );

    // 보라색 원 & 비디오 확대
    tl.to(circleRef.current, { scale: 30, duration: 2, ease: 'none' }, 11.8).to(
      videoBoxRef.current,
      {
        clipPath: 'circle(100% at 50% 50%)',
        duration: 3,
        ease: 'none',
      },
      12.1
    );

    // 비디오 재생 트리거
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=2000',
      scrub: 0.5,
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
      className="relative w-full min-h-[100vh] bg-[#000000] text-white flex items-center justify-center overflow-hidden"
    >
      <Video ref={videoRef} videoBoxRef={videoBoxRef} onVideoEnd={() => setVideoEnded(true)} />
      <PurpleCircle ref={circleRef} />
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
        {texts.map((text, i) => (
          <h1
            key={i}
            ref={(el) => {
              if (el) textRefs.current[i] = el;
            }}
            className="relative custom-font pl-4 text-[22vh] whitespace-nowrap"
          >
            {text}
          </h1>
        ))}
      </div>
      <h1 ref={h1Ref} className="custom-font text-center text-6xl px-4 text-[#000000]">
        ARE YOU READY?
      </h1>
    </section>
  );
};

export default VideoSection;
