import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackSquare from '../BlackSquare';
import { useGSAP } from '@gsap/react';
import Cloud from '../Cloud';

gsap.registerPlugin(ScrollTrigger);

const MapSection = () => {
  const cloudRef = useRef<HTMLImageElement>(null);

  const mapSectionRef = useRef<HTMLDivElement>(null);
  const blackSquareRef = useRef<HTMLDivElement>(null);
  const firstMapImageRef = useRef<HTMLImageElement>(null);
  const secondMapImageRef = useRef<HTMLImageElement>(null);
  const thirdMapImageRef = useRef<HTMLImageElement>(null);
  const fourthMapImageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (
      !mapSectionRef.current ||
      !blackSquareRef.current ||
      !firstMapImageRef.current ||
      !secondMapImageRef.current ||
      !thirdMapImageRef.current ||
      !fourthMapImageRef.current ||
      !cloudRef.current
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

    gsap.set(cloudRef.current, { opacity: 1, x: '100%', scale: 1.5 });

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
        markers: {
          startColor: 'blue',
          endColor: 'pink',
          fontSize: '20px',
          indent: 20,
        },
      },
    });

    // 1. 구름 등장
    tl.to(
      cloudRef.current,
      {
        x: '-150%',
        scale: 2,
        opacity: 1,
        duration: 5,
        ease: 'none',
      },
      0
    );

    // 첫 번째 이미지: 나타나기 -> 커지기 -> 블러 처리하기
    tl.to(
      firstMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'none',
        duration: 0.5,
      },
      2
    )
      .to(
        firstMapImageRef.current,
        {
          scale: 2,
          x: 50,
          opacity: 0,
          ease: 'power2.in',
          duration: 1.5,
        },
        4.5
      )
      .to(
        firstMapImageRef.current,
        {
          filter: 'blur(15px)',
          duration: 1,
          ease: 'none',
        },
        5.5
      );

    // 두 번째 이미지
    tl.to(
      secondMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.5,
      },
      6
    )
      .to(
        secondMapImageRef.current,
        {
          scale: 2,
          x: 100,
          opacity: 0,
          ease: 'power2.in',
          duration: 1.5,
        },
        6.5
      )
      .to(
        secondMapImageRef.current,
        {
          filter: 'blur(15px)',
          duration: 1,
          ease: 'none',
        },
        7.5
      );

    // 세 번째 이미지
    tl.to(
      thirdMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.5,
      },
      8
    )
      .to(
        thirdMapImageRef.current,
        {
          scale: 1.5,
          y: 100,
          opacity: 0,
          ease: 'power2.in',
          duration: 1.5,
        },
        8.5
      )
      .to(
        thirdMapImageRef.current,
        {
          filter: 'blur(15px)',
          duration: 1,
          ease: 'none',
        },
        10
      );

    // 네 번째 이미지
    tl.to(
      fourthMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 1,
      },
      10.5
    );

    // BlackSquare 이동 (맨 마지막)
    tl.to(
      blackSquareRef.current,
      {
        x: '0%',
        ease: 'power1.Out',
        duration: 1.5,
      },
      12
    );

    tl.to({}, { duration: 1 });

    return () => {
      tl.kill();
    };
  }, [mapSectionRef]);

  return (
    <section
      ref={mapSectionRef}
      className="relative w-full h-screen flex justify-center items-center overflow-hidden"
    >
      <Cloud className="right-[-20%] top-[-20%]" ref={cloudRef} />
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
