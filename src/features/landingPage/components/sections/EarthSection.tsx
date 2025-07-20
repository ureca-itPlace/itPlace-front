import { useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PurpleCircle from '../common/PurpleCircle';
import bgImage from '/images/landing/bg-earth.webp';

gsap.registerPlugin(ScrollTrigger);

const EarthSection = forwardRef<HTMLDivElement>((_, ref) => {
  const earthSectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => earthSectionRef.current as HTMLDivElement);

  useGSAP(() => {
    if (!earthSectionRef.current || !circleRef.current) return;

    gsap.fromTo(
      circleRef.current,
      { scale: 0.3 },
      {
        scale: 30,
        scrollTrigger: {
          trigger: earthSectionRef.current,
          start: 'center center',
          end: '+=500',
          scrub: 0.5,
          pin: true,
          markers: true, // 개발 후 삭제하기
        },
        ease: 'none',
      }
    );
  }, []);
  return (
    <div
      ref={earthSectionRef}
      className=" relative w-full h-screen bg-cover bg-center flex items-center justify-center text-9xl text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <PurpleCircle ref={circleRef} />
    </div>
  );
});

export default EarthSection;
