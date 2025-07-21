import { useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackSquare from '../common/BlackSquare';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const MapSection = forwardRef<HTMLDivElement>((_, ref) => {
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const blackSquareRef = useRef<HTMLDivElement>(null);
  const firstMapImageRef = useRef<HTMLImageElement>(null);
  const secondMapImageRef = useRef<HTMLImageElement>(null);
  const thirdMapImageRef = useRef<HTMLImageElement>(null);
  const fourthMapImageRef = useRef<HTMLImageElement>(null);

  useImperativeHandle(ref, () => mapSectionRef.current as HTMLDivElement);

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
      }
    );

    gsap.set(blackSquareRef.current, {
      x: '-100%',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mapSectionRef.current,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1.5,
        markers: true,
      },
    });
    // 첫 번째 이미지: 나타나기 -> 커지기 -> 블러 처리하기
    tl.to(
      firstMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.2,
      },
      0
    )
      .to(
        firstMapImageRef.current,
        {
          scale: 3,
          x: 50,
          opacity: 0,
          ease: 'power2.in',
          duration: 1,
        },
        0.2
      )
      .to(
        firstMapImageRef.current,
        {
          filter: 'blur(30px)',
          duration: 0.8,
          ease: 'none',
        },
        0.7
      );

    // 두 번째 이미지
    tl.to(
      secondMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.2,
      },
      1
    )

      .to(
        secondMapImageRef.current,
        {
          scale: 3,
          x: 100,
          opacity: 0,
          ease: 'power2.in',
          duration: 1,
        },
        1.2
      )

      .to(
        secondMapImageRef.current,
        {
          filter: 'blur(30px)',
          duration: 0.6,
          ease: 'none',
        },
        1.6
      );

    // 세 번째 이미지
    tl.to(
      thirdMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.2,
      },
      2
    )

      .to(
        thirdMapImageRef.current,
        {
          scale: 1.5,
          opacity: 0,
          ease: 'power2.in',
          duration: 1,
        },
        2.2
      )

      .to(
        thirdMapImageRef.current,
        {
          filter: 'blur(30px)',
          duration: 0.6,
          ease: 'none',
        },
        2.6
      );

    // 네 번째 이미지
    tl.to(
      fourthMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.2,
      },
      3
    );

    // BlackSquare 이동 (맨 마지막)
    tl.to(
      blackSquareRef.current,
      {
        x: '0%',
        ease: 'power2.inOut',
        duration: 1,
      },
      3.5
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={mapSectionRef}
      className="relative w-full h-screen flex justify-center items-center bg-white overflow-hidden"
    >
      <img
        ref={firstMapImageRef}
        src="/images/landing/map-1.webp"
        alt="지도"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform, opacity' }}
      />
      <img
        ref={secondMapImageRef}
        src="/images/landing/map-2.webp"
        alt="지도2"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform, opacity' }}
      />
      <img
        ref={thirdMapImageRef}
        src="/images/landing/map-3.webp"
        alt="지도3"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform, opacity' }}
      />
      <img
        ref={fourthMapImageRef}
        src="/images/landing/map-4.webp"
        alt="지도4"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'transform, opacity' }}
      />
      <BlackSquare ref={blackSquareRef} />
    </section>
  );
});

export default MapSection;
