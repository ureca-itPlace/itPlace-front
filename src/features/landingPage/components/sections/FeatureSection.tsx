import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PurpleCircle from '../common/PurpleCircle';

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP 애니메이션
  useGSAP(() => {
    if (!circleRef.current || !sectionRef.current) return;

    gsap.fromTo(
      circleRef.current,
      { scale: 0.3 },
      {
        scale: 30,
        scrollTrigger: {
          trigger: sectionRef.current,
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
      ref={sectionRef}
      className="relative w-full h-screen flex justify-center items-center text-white text-8xl bg-black overflow-hidden"
    >
      기능 설명 섹션입니다
      <PurpleCircle ref={circleRef} />
    </div>
  );
};

export default FeatureSection;
