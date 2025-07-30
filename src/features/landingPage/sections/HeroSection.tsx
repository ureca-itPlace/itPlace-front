import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const imageRef = useRef(null);
  const sectionRef = useRef(null);
  const planetRef = useRef(null);
  const groundRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3200',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          markers: true,
        },
      });

      // 초기 상태
      gsap.set(imageRef.current, {
        scale: 1,
        transformOrigin: 'center center',
      });
      gsap.set(planetRef.current, {
        y: 500,
        opacity: 0,
        scale: 1,
        transformOrigin: 'center center',
      });
      gsap.set(groundRef.current, { y: 300 });
      gsap.set(subtitleRef.current, { y: 100, opacity: 0 });
      gsap.set(titleRef.current, { y: 100, opacity: 0 });

      // 1. 지구 올라오기
      tl.to(planetRef.current, {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
      });

      // 2. 배경 이미지 확대
      tl.to(imageRef.current, {
        scale: 3.55,
        ease: 'none',
      });

      // 3. 땅 올라오기
      tl.to(groundRef.current, {
        y: 0,
        ease: 'power2.out',
      });

      // 4. 지구 확대 + 이동
      tl.to(
        planetRef.current,
        {
          x: '20vw',
          y: '2vh',
          scale: 1.6,
          ease: 'power2.out',
        },
        '<'
      );

      // 5. subtitle 올라오기
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      });

      // 6. title 올라오기
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-[url('/images/landing/hero-bg.jpg')] bg-cover bg-no-repeat"
    >
      <img
        ref={imageRef}
        src="/images/landing/hero-window-1.png"
        alt="우주를바라보는토끼"
        className="absolute inset-0 w-full h-full object-cover z-40"
      />
      <img
        ref={planetRef}
        src="/images/landing/hero-planet.webp"
        alt="보라색행성"
        className="absolute top-[23vw] left-[49.5%] -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[70vh] object-contain z-20"
      />
      <img
        ref={groundRef}
        src="/images/landing/hero-ground.png"
        alt="땅"
        className="absolute bottom-0 z-30 w-full"
      />
      <div className="flex flex-col flex-1 px-24 pb-8">
        <div ref={subtitleRef} className="custom-font text-[5vw] text-white leading-none">
          EXPLORE THE
        </div>
        <div ref={titleRef} className="custom-font text-[12vw] text-white leading-none">
          ITPLACE
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
