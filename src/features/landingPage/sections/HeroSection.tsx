import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  // Hero Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLImageElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef(null);

  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const firstMapImageRef = useRef<HTMLImageElement>(null);
  const secondMapImageRef = useRef<HTMLImageElement>(null);
  const thirdMapImageRef = useRef<HTMLImageElement>(null);
  const fourthMapImageRef = useRef<HTMLImageElement>(null);
  const locationTextRef = useRef<HTMLDivElement>(null);
  const benefitTextRef = useRef<HTMLDivElement>(null);
  const benefitImagesRef = useRef<HTMLImageElement[]>([]);

  const { isMobile, isTablet, isLaptop } = useResponsive();
  const xDistance = isMobile ? 50 : isTablet ? 150 : isLaptop ? 100 : 300;
  const yDistance = isMobile ? -150 : 50;

  const logos = [
    { name: 'gs25', left: 'left-[3%]', width: 'w-[12vw]' },
    { name: 'cgv', left: 'left-[35%]', width: 'w-[12vw]' },
    { name: 'baskin-robbins', left: 'left-[65%]', width: 'w-[5vw]' },
    { name: 'domino', left: 'left-[85%]', width: 'w-[12vw]' },
  ];

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

      gsap.set(benefitImagesRef.current, {
        y: '-150%',
        opacity: 0,
      });

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
        .to(fourthMapImageRef.current, { opacity: 1, filter: 'blur(0px)', duration: 1.5 }, '+=0.2') // 네 번째 지도 등장
        .from(
          locationTextRef.current, // location 텍스트 등장
          {
            opacity: 0,
            y: 60,
            duration: 1,
          },
          '+=0.5'
        )
        .to(
          fourthMapImageRef.current, // 지도 사라짐
          {
            borderRadius: 6,
            scale: 0.6,
            opacity: 0,
            transformOrigin: 'center center',
            duration: 1.5,
            ease: 'power2.in',
          },
          '+=1.5'
        )
        .to(
          locationTextRef.current, // location 텍스트 사라짐
          {
            opacity: 0,
            y: -60,
            duration: 1,
          },
          '+=0.5'
        )
        .fromTo(
          benefitTextRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            onComplete: () => {
              // 이미지 애니메이션 자동 실행
              benefitImagesRef.current.forEach((el, index) => {
                gsap.fromTo(
                  el,
                  { y: '-150%' },
                  {
                    y: '150vh',
                    opacity: 1,
                    duration: 2.5,
                    ease: 'power2.out',
                    delay: index * 0.1,
                  }
                );
              });
            },
          },
          '+=0.2'
        );

      tl.to({}, { duration: 4 });
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
        <div className="flex flex-col items-center justify-center w-full h-full text-[15vw] text-purple04 z-30">
          <div ref={locationTextRef} className="custom-font">
            OUR LOCATION
          </div>
          <div
            ref={benefitTextRef}
            className="custom-font absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-30"
          >
            OUR BENEFITS
          </div>
        </div>
        {logos.map((logo, index) => (
          <img
            key={logo.name}
            ref={(el) => {
              if (el) benefitImagesRef.current[index] = el;
            }}
            src={`/images/landing/${logo.name}.svg`}
            className={`absolute top-[-10%] ${logo.left} ${logo.width} h-auto`}
            loading="lazy"
            alt={logo.name}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
