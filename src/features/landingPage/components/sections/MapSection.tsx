import { useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlackSquare from '../common/BlackSquare';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const MapSection = forwardRef<HTMLDivElement>((_, ref) => {
  const MapSectionRef = useRef<HTMLDivElement>(null);
  const BlackSquareRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => MapSectionRef.current as HTMLDivElement);

  useGSAP(() => {
    if (!MapSectionRef.current || !BlackSquareRef.current) return;

    gsap.set(BlackSquareRef.current, {
      x: '-100%',
    });

    const trigger = ScrollTrigger.create({
      trigger: MapSectionRef.current,
      start: 'top top',
      end: '+=800',
      pin: true,
      scrub: 0.1,
      anticipatePin: 1.5,
      markers: true, // 개발 후 삭제하기
      animation: gsap.to(BlackSquareRef.current, {
        x: '0%',
        ease: 'none',
        force3D: true,
      }),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={MapSectionRef}
      className="relative w-full h-screen flex justify-center items-center text-white text-8xl bg-gray-600"
    >
      지도 섹션입니다
      <BlackSquare ref={BlackSquareRef} />
    </div>
  );
});

export default MapSection;
