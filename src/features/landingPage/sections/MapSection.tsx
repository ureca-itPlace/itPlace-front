import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

const MapSection = () => {
  const mapSectionRef = useRef<HTMLDivElement>(null);
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
        zIndex: 0,
      }
    );

    const changeTl = gsap.timeline({
      scrollTrigger: {
        trigger: mapSectionRef.current,
        start: 'top top',
        end: '+=2500',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    // 첫 번째 이미지
    changeTl
      .to(
        firstMapImageRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'expo.out',
        },
        0
      )
      .to(
        firstMapImageRef.current,
        {
          scale: 1.4,
          opacity: 0,
          duration: 3,
          filter: 'blur(10px)',
          ease: 'power4.out',
        },
        '+=1.5'
      );

    // 두 번째 이미지
    changeTl
      .to(
        secondMapImageRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'expo.out',
        },
        '>-1'
      )
      .to(
        secondMapImageRef.current,
        {
          scale: 2,
          x: 80,
          opacity: 0,
          duration: 3,
          ease: 'power4.out',
          filter: 'blur(10px)',
        },
        '+=1.2'
      );

    // 세 번째 이미지
    changeTl
      .to(
        thirdMapImageRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'expo.out',
        },
        '>-1'
      )
      .to(
        thirdMapImageRef.current,
        {
          scale: 2,
          x: xDistance,
          y: yDistance,
          opacity: 0,
          duration: 3,
          ease: 'power4.out',
          filter: 'blur(10px)',
        },
        '+=1.2'
      );

    // 네 번째 이미지
    changeTl.to(
      fourthMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'expo.out',
      },
      '>-1'
    );

    // 다음 섹션 전 지연 시간
    changeTl.to({}, { duration: 1 });

    return () => {
      changeTl.kill();
    };
  }, [mapSectionRef]);

  return (
    <section
      ref={mapSectionRef}
      className="relative w-full h-screen flex justify-center items-center overflow-hidden bg-white"
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
    </section>
  );
};

export default MapSection;
