import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import LoadLanding from './components/LoadLanding';

gsap.registerPlugin(useGSAP);

const IntroSection = ({ onComplete }: { onComplete: () => void }) => {
  const logoRef = useRef(null);
  const descRef = useRef(null);
  const bgRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로딩 상태 감지
  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    window.onload = handleLoad;

    return () => {
      window.onload = null;
    };
  }, []);

  useGSAP(() => {
    // 로딩이 끝난 후에 애니메이션 실행
    if (!isLoading) {
      const tl = gsap.timeline();

      // 1. 소개 문구 등장 & 로고 이동 애니메이션
      tl.to(
        logoRef.current,
        {
          y: -40,
          ease: 'power1.out',
          zIndex: 30,
          delay: 1,
        },
        'sync'
      )

        .fromTo(
          descRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            zIndex: 30,
            delay: 1,
          },
          'sync'
        )
        // 2. 텍스트 색상 하얀색, 배경 색상 검정색으로 변경
        .add(() => {
          gsap.to(logoRef.current, { color: 'white' });
          gsap.to(descRef.current, { color: 'white' });

          gsap.to(bgRef.current, { backgroundColor: 'black' });
        }, '+=0.5')

        // 3. 로고 & 멘트 fade out
        .add(() => {
          gsap.to(logoRef.current, {
            y: 0,
            opacity: 0,
            scale: 0.7,
            duration: 1,
            ease: 'power3.out',
          });
          gsap.to(descRef.current, {
            y: 0,
            opacity: 0,
            scale: 0.7,
            duration: 1,
            ease: 'power3.out',
          });
        }, '+=1')

        .add(onComplete, '+=1');
    }
  }, [isLoading, onComplete]);

  return isLoading ? (
    <LoadLanding />
  ) : (
    <div
      ref={bgRef}
      className="w-full h-screen flex justify-center items-center bg-white flex-col overflow-hidden relative z-30"
    >
      <h1 ref={logoRef} className="custom-font text-[194px] max-sm:text-8xl text-black">
        IT:PLACE
      </h1>
      <p ref={descRef} className="text-5xl text-center max-sm:text-body-1">
        혜택을 지도에서, 빠르고 간편하게, 효율적으로
      </p>
    </div>
  );
};

export default IntroSection;
