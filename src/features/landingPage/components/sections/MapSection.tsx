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

  useImperativeHandle(ref, () => mapSectionRef.current as HTMLDivElement);

  useGSAP(() => {
    if (
      !mapSectionRef.current ||
      !blackSquareRef.current ||
      !firstMapImageRef.current ||
      !secondMapImageRef.current
    )
      return;

    gsap.set([firstMapImageRef.current, secondMapImageRef.current], {
      filter: 'blur(15px)',
      scale: 1.5,
      opacity: 0,
      transformOrigin: 'center center',
    });

    gsap.set(blackSquareRef.current, {
      x: '-100%',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mapSectionRef.current,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1.5,
        markers: true,
      },
    });

    // 첫 번째 이미지: 나타나기 → 선명해지기 → 커지면서 사라지기
    tl.to(
      firstMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.15,
      },
      0
    ).to(
      firstMapImageRef.current,
      {
        scale: 3,
        opacity: 0,
        filter: 'blur(15px)',
        ease: 'power2.in',
        duration: 0.15,
      },
      0.15
    );

    // 두 번째 이미지
    tl.to(
      secondMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        duration: 0.15,
      },
      0.3
    ).to(
      secondMapImageRef.current,
      {
        scale: 3,
        opacity: 0,
        filter: 'blur(15px)',
        ease: 'power2.in',
        duration: 0.15,
      },
      0.45
    );

    // BlackSquare 이동 (맨 마지막)
    tl.to(
      blackSquareRef.current,
      {
        x: '0%',
        ease: 'power2.inOut',
        duration: 0.4,
      },
      0.6
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={mapSectionRef}
      className="relative w-full h-screen flex justify-center items-center bg-white"
    >
      <img
        ref={firstMapImageRef}
        src="/images/landing/map-1.webp"
        alt="지도"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'filter, transform' }}
      />
      <img
        ref={secondMapImageRef}
        src="/images/landing/map-2.webp"
        alt="지도2"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'filter, transform' }}
      />
      {/* <img
        ref={thirdMapImageRef}
        src="/images/landing/map-3.webp"
        alt="지도3"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: 'filter, transform' }}
      /> */}
      <BlackSquare ref={blackSquareRef} />
    </section>
  );
});

export default MapSection;
