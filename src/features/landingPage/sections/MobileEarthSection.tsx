import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const MobileEarthSection = () => {
  const mobileEarthSectionRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!mobileEarthSectionRef.current || !earthRef.current) return;

    gsap.set(earthRef.current, { scale: 1, opacity: 1 });

    gsap.to(earthRef.current, {
      y: -20,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mobileEarthSectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
        pin: true,
      },
    });

    // 이미지 확대
    tl.to(earthRef.current, {
      scale: 5,
      duration: 2,
      ease: 'power1.out',
    });

    // 섹션 전체 사라짐
    tl.to(
      mobileEarthSectionRef.current,
      {
        opacity: 0,
        ease: 'power1.out',
      },
      '-=0.5'
    );

    tl.to({}, { duration: 1 });

    return () => {
      tl.kill();
      gsap.killTweensOf(earthRef.current);
    };
  }, []);

  return (
    <section
      data-theme="dark"
      ref={mobileEarthSectionRef}
      className="relative flex items-center justify-center min-h-[100dvh] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/images/landing/bg-earth.webp')" }}
    >
      <img
        ref={earthRef}
        src="/public/images/landing/mobile-earth.webp"
        alt="모바일지구"
        className="w-full h-auto object-contain"
      />
    </section>
  );
};

export default MobileEarthSection;
