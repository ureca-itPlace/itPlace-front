import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  // Hero Refs
  const wrapperRef = useRef(null);
  const heroRef = useRef(null);
  const windowRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const whiteOverlayRef = useRef(null);

  // Map Refs
  const mapContainerRef = useRef(null);
  const firstMapImageRef = useRef(null);
  const secondMapImageRef = useRef(null);
  const thirdMapImageRef = useRef(null);
  const fourthMapImageRef = useRef(null);
  const mapTextRef = useRef(null);

  const { isMobile, isTablet, isLaptop } = useResponsive();
  const xDistance = isMobile ? 50 : isTablet ? 150 : isLaptop ? 100 : 300;
  const yDistance = isMobile ? -150 : 50;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=6000',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          markers: false,
        },
      });

      // 초기 세팅
      gsap.set(windowRef.current, { scale: 1, transformOrigin: 'center center' });
      gsap.set(subtitleRef.current, { y: 100, opacity: 0 });
      gsap.set(titleRef.current, { y: 100, opacity: 0 });
      gsap.set(whiteOverlayRef.current, { opacity: 0, pointerEvents: 'none' });
      gsap.set(mapContainerRef.current, { opacity: 0, visibility: 'hidden' });
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
        }
      );

      // Hero 애니메이션
      tl.to(windowRef.current, {
        scale: 3.55,
        duration: 2.5,
        ease: 'power1.inOut',
      });
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' });
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' });
      tl.to(whiteOverlayRef.current, { opacity: 1, duration: 1.2, ease: 'power1.inOut' }, '+=0.3');
      tl.to(
        heroRef.current,
        {
          opacity: 0,
          duration: 1.2,
          ease: 'power1.inOut',
        },
        '+=0.2'
      );

      // Map 애니메이션
      tl.set(mapContainerRef.current, { visibility: 'visible', scale: 1 })
        .to(mapContainerRef.current, { opacity: 1, duration: 0.5 }, '<0.5')
        .to(whiteOverlayRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '<')
        .to(
          firstMapImageRef.current,
          { opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power1.out' },
          '<'
        )
        .to(
          firstMapImageRef.current,
          { scale: 1.4, opacity: 0, duration: 2, filter: 'blur(3px)', ease: 'none' },
          '+=2'
        )
        .to(secondMapImageRef.current, { opacity: 1, filter: 'blur(0px)', duration: 1 }, '>-0.5')
        .to({}, { duration: 2 })
        .to(
          secondMapImageRef.current,
          { scale: 1.7, x: 80, opacity: 0, duration: 2, filter: 'blur(3px)' },
          '+=1.2'
        )
        .to(thirdMapImageRef.current, { opacity: 1, filter: 'blur(0px)', duration: 1 }, '+=0.5')
        .to({}, { duration: 2 })
        .to(
          thirdMapImageRef.current,
          { scale: 1.5, x: xDistance, y: yDistance, opacity: 0, duration: 2, filter: 'blur(3px)' },
          '+=1.2'
        )
        .to(fourthMapImageRef.current, { opacity: 1, filter: 'blur(0px)', duration: 1.5 }, '+=0.2')
        .to(
          fourthMapImageRef.current,
          {
            borderRadius: 6,
            scale: 0.6,
            opacity: 0,
            transformOrigin: 'center center',
            duration: 3,
          },
          '+=1.5'
        )
        .from(mapTextRef.current, {
          opacity: 0,
          y: 60,
          duration: 1,
        });

      tl.to({}, { duration: 2 });
    }, wrapperRef);

    return () => ctx.revert();
  }, [xDistance, yDistance]);

  return (
    <section ref={wrapperRef} className="relative w-full min-h-[100vh] overflow-hidden">
      {/* 우주 토끼 섹션 */}
      <div
        ref={heroRef}
        className="relative w-full h-full bg-[url('/images/landing/hero-bg.webp')] bg-no-repeat bg-cover bg-center"
      >
        <img
          ref={windowRef}
          src="/images/landing/hero-window-1.png"
          className="absolute inset-0 w-full h-full object-cover z-40 max-md:hidden"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-10 z-50 max-md:gap-6">
          <div ref={subtitleRef} className="custom-font text-[6vw] text-white leading-none">
            EXPLORE THE
          </div>
          <div ref={titleRef} className="custom-font text-[12vw] text-white leading-none">
            ITPLACE
          </div>
        </div>
        <div
          ref={whiteOverlayRef}
          className="absolute inset-0 w-full h-full bg-white z-50 pointer-events-none"
        />
      </div>
      {/* 지도 섹션 */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-white z-60">
        <img
          ref={firstMapImageRef}
          src="/images/landing/map-1.webp"
          className="absolute inset-0 w-full h-screen object-cover"
          loading="lazy"
        />
        <img
          ref={secondMapImageRef}
          src="/images/landing/map-2.webp"
          className="absolute inset-0 w-full h-screen object-cover"
          loading="lazy"
        />
        <img
          ref={thirdMapImageRef}
          src="/images/landing/map-3.webp"
          className="absolute inset-0 w-full h-screen object-cover"
          loading="lazy"
        />
        <img
          ref={fourthMapImageRef}
          src="/images/landing/map-4.webp"
          className="absolute inset-0 w-full h-screen object-cover"
          loading="lazy"
        />
        <div className="flex items-center justify-center w-full h-full text-[15vw] text-purple04 z-30">
          <div ref={mapTextRef} className="custom-font">
            OUR <span className="custom-font">LOCATION</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
