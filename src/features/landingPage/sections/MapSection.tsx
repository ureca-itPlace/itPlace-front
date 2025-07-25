import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import BlackSquare from '../components/BlackSquare';
import { useResponsive } from '../../../hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

const MapSection = () => {
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const blackSquareRef = useRef<HTMLDivElement>(null);
  const firstMapImageRef = useRef<HTMLImageElement>(null);
  const secondMapImageRef = useRef<HTMLImageElement>(null);
  const thirdMapImageRef = useRef<HTMLImageElement>(null);
  const fourthMapImageRef = useRef<HTMLImageElement>(null);

  const { isMobile, isTablet } = useResponsive();

  // 반응형을 고려한 세 번째 이미지 x축 이동
  const xDistance = isMobile ? 100 : isTablet ? 200 : 400;
  const yDistance = isMobile ? -150 : 50;

  useGSAP(() => {
    if (
      !mapSectionRef.current ||
      !blackSquareRef.current ||
      !firstMapImageRef.current ||
      !secondMapImageRef.current ||
      !thirdMapImageRef.current ||
      !fourthMapImageRef.current
    )
      return;

    // 초기 설정
    gsap.set(
      [
        firstMapImageRef.current,
        secondMapImageRef.current,
        thirdMapImageRef.current,
        fourthMapImageRef.current,
      ],
      {
        scale: 1,
        opacity: 0,
        filter: 'blur(10px)',
        zIndex: 0, // 각 이미지가 겹치지 않도록 z-index 설정
      }
    );

    gsap.set(blackSquareRef.current, {
      x: '-100%',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mapSectionRef.current,
        start: 'top top',
        end: '+=2400',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
      },
    });

    // 첫 번째 이미지: 나타나기 -> 커지기 -> 블러 처리하기
    tl.to(
      firstMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'none',
        duration: 2,
      },
      2
    )
      .to(
        firstMapImageRef.current,
        {
          scale: 1.5,
          opacity: 0,
          ease: 'power2.out',
          duration: 4,
        },
        5
      )
      .to(
        firstMapImageRef.current,
        {
          filter: 'blur(15px)',
          duration: 0.7,
          ease: 'none',
        },
        6.5
      );

    // 두 번째 이미지
    tl.to(
      secondMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 1,
      },
      6.5
    )
      .to(
        secondMapImageRef.current,
        {
          scale: 2,
          x: 80,
          opacity: 0,
          ease: 'power2.out',
          duration: 4,
          delay: 1,
        },
        7.5
      )
      .to(
        secondMapImageRef.current,
        {
          filter: 'blur(15px)',
          duration: 0.7,
          ease: 'none',
        },
        10
      );

    // 세 번째 이미지
    tl.to(
      thirdMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 1,
      },
      10
    )
      .to(
        thirdMapImageRef.current,
        {
          scale: 2,
          x: xDistance,
          y: yDistance,
          opacity: 0,
          ease: 'power2.out',
          duration: 4,
          delay: 1,
        },
        11
      )
      .to(
        thirdMapImageRef.current,
        {
          filter: 'blur(15px)',
          duration: 0.7,
          ease: 'none',
        },
        13.5
      );

    // 네 번째 이미지
    tl.to(
      fourthMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 3,
      },
      14.5
    );

    // BlackSquare 이동 (맨 마지막)
    tl.to(
      blackSquareRef.current,
      {
        x: '0%',
        ease: 'none',
        duration: 4,
      },
      17
    );

    tl.to({}, { duration: 1 });

    return () => {
      tl.kill();
    };
  }, [mapSectionRef]);

  return (
    <section
      ref={mapSectionRef}
      className="relative w-full h-[100dvh] flex justify-center items-center overflow-hidden"
    >
      <img
        ref={firstMapImageRef}
        src="/images/landing/map-1.webp"
        alt="지도"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <img
        ref={secondMapImageRef}
        src="/images/landing/map-2.webp"
        alt="지도2"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <img
        ref={thirdMapImageRef}
        src="/images/landing/map-3.webp"
        alt="지도3"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <img
        ref={fourthMapImageRef}
        src="/images/landing/map-4.webp"
        alt="지도4"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <BlackSquare ref={blackSquareRef} />
    </section>
  );
};

export default MapSection;
