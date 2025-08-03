import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  // Hero Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollArrowRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLImageElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

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
  const isSmallScreen = isMobile || isTablet;
  const xDistance = isMobile ? 50 : isTablet ? 150 : isLaptop ? 100 : 300;
  const yDistance = isMobile ? -150 : 50;
  const bgImage = isSmallScreen
    ? '/images/landing/hero/hero-bg-mobile.webp'
    : '/images/landing/hero/hero-bg.webp';

  const logos = [
    { name: 'gs25', top: 'top-[-10%]', left: 'left-[10%]', width: 'w-[14vw]' },
    { name: 'baskin-robbins', top: 'top-[-20%]', left: 'left-[38%]', width: 'w-[8vw]' },
    { name: 'uplus-tv', top: 'top-[-67%]', left: 'left-[4%]', width: 'w-[10vw]' },
    { name: 'domino', top: 'top-[-10%]', left: 'left-[60%]', width: 'w-[20vw]' },
    { name: 'ever-land', top: 'top-[-25%]', left: 'left-[80%]', width: 'w-[14vw]' },
    { name: 'lotte-world', top: 'top-[-80%]', left: 'left-[50%]', width: 'w-[14vw]' },
    { name: 'trip-com', top: 'top-[-80%]', left: 'left-[20%]', width: 'w-[14vw]' },
    { name: 'shake-shack', top: 'top-[-80%]', left: 'left-[75%]', width: 'w-[20vw]' },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(wrapperRef.current, { opacity: 0 });
      gsap.to(wrapperRef.current, { opacity: 1, duration: 2, ease: 'sine.out' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=7200',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
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
        opacity: 1,
      });

      gsap.to(scrollArrowRef.current, {
        y: -5,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: 'sine.out',
      });

      // Hero 애니메이션 (max-lg이상일 경우만 적용)
      if (!isSmallScreen) {
        tl.to(windowRef.current, {
          scale: 6.5,
          duration: 7.5,
          ease: 'sine.out',
        });
        tl.to(scrollArrowRef.current, { opacity: 0, duration: 0.5, ease: 'sine.inOut' }, '<');
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 3,
          ease: 'power1.out',
        });
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 3,
          ease: 'power1.out',
        });
      } else {
        // lg 미만에서는 즉시 노출
        gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
        gsap.set(titleRef.current, { opacity: 1, y: 0 });
      }
      tl.to(whiteOverlayRef.current, { opacity: 1, duration: 2.5, ease: 'sine.inOut' }, '+=0.3');
      tl.to(
        heroRef.current,
        {
          opacity: 0,
          duration: 2.5,
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
          { scale: 1.4, opacity: 0, duration: 2, filter: 'blur(3px)', ease: 'sine.out' },
          '+=2'
        )
        .to(secondMapImageRef.current, { opacity: 1, filter: 'blur(0px)', duration: 1 }, '>-0.5')
        .to({}, { duration: 2.5 })
        .to(
          secondMapImageRef.current,
          { scale: 1.7, x: 80, opacity: 0, duration: 2, filter: 'blur(3px)' },
          '+=1.2'
        )
        .to(thirdMapImageRef.current, { opacity: 1, filter: 'blur(0px)', duration: 1 }, '+=0.5')
        .to({}, { duration: 2.5 })
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
            duration: 2,
            ease: 'power1.out',
            delay: 1,
          },
          '+=1.5'
        )
        .to(
          fourthMapImageRef.current, // 지도 사라짐
          {
            borderRadius: 6,
            scale: 0.6,
            opacity: 0,
            transformOrigin: 'center center',
            duration: 3,
            ease: 'power1.inOut',
          },
          '+=1.5'
        )
        .to(
          locationTextRef.current, // location 텍스트 사라짐
          {
            opacity: 0,
            y: -60,
            duration: 1.5,
            ease: 'sine.out',
          },
          '+=0.5'
        )
        .from(
          benefitTextRef.current,
          {
            opacity: 0,
            y: 60,
            duration: 1.5,
            ease: 'sine.out',
          },
          '+=0.5'
        )
        .addLabel('afterBenefits');
      const logoGroups = [
        [0, 3], // gs25, domino
        [1, 2], // cgv, baskin-robbins
        [6], // megabox
        [4], // ever-land
        [5, 7], // lotte-world, trip-com
      ];

      logoGroups.forEach((group, groupIndex) => {
        group.forEach((logoIndex) => {
          const el = benefitImagesRef.current[logoIndex];
          if (el) {
            tl.to(
              el,
              {
                y: '200vh',
                opacity: 0.8,
                ease: 'sine.inOut',
                duration: 10,
              },
              `<+${groupIndex * 0.4}`
            );
          }
        });
      });

      tl.to({}, { duration: 3 });
    }, wrapperRef);

    return () => ctx.revert();
  }, [xDistance, yDistance, isSmallScreen]);

  return (
    <section
      ref={wrapperRef}
      data-theme="light"
      className="relative w-full min-h-[100vh] overflow-hidden"
    >
      {/* 우주 토끼 섹션 */}
      <div ref={heroRef} className="relative w-full h-full pointer-events-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <img src={bgImage} alt="배경" className="w-full h-full object-cover" />
        </div>
        <img
          ref={windowRef}
          src="/images/landing/hero/spaceship-window.webp"
          alt="우주선 창문"
          className="absolute inset-0 w-full h-full object-fill z-40 max-lg:hidden bg-center pointer-events-none"
        />
        <img
          ref={scrollArrowRef}
          src="/images/landing/hero/scroll-arrow.svg"
          alt="스크롤 화살표"
          className="absolute bottom-[9%] left-1/2 -translate-x-1/2 z-50 w-[60px] h-auto pointer-events-none max-xl:w-[50px] max-lg:bottom-[150px]"
          loading="lazy"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-10 z-50 max-md:gap-6">
          <div ref={subtitleRef} className="custom-font text-[6vw] text-white leading-none">
            EXPLORE THE
          </div>
          <div ref={titleRef} className="custom-font text-[12vw] text-white leading-none">
            IT:PLACE
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
          src="/images/landing/hero/map-1.webp"
          className="absolute inset-0 w-full h-screen object-cover pointer-events-none"
          loading="lazy"
        />
        <img
          ref={secondMapImageRef}
          src="/images/landing/hero/map-2.webp"
          className="absolute inset-0 w-full h-screen object-cover pointer-events-none"
          loading="lazy"
        />
        <img
          ref={thirdMapImageRef}
          src="/images/landing/hero/map-3.webp"
          className="absolute inset-0 w-full h-screen object-cover pointer-events-none"
          loading="lazy"
        />
        <img
          ref={fourthMapImageRef}
          src="/images/landing/hero/map-4.webp"
          className="absolute inset-0 w-full h-screen object-cover pointer-events-none"
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
            src={`/images/landing/hero/${logo.name}.svg`}
            className={`absolute ${logo.top} ${logo.left} ${logo.width} h-auto min-w-16 pointer-events-none`}
            loading="lazy"
            alt={logo.name}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
