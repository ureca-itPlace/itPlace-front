import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { useResponsive } from '../../../hooks/useResponsive';

interface LoadingScreenProps {
  onFinish: () => void;
}

const LoadingScreen = ({ onFinish }: LoadingScreenProps) => {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(true);

  const logoRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const { isMobile } = useResponsive();

  const descFadeOutDistance = isMobile ? '-20' : '0';

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isVisible]);

  useLayoutEffect(() => {
    if (!active && progress === 100 && bgRef.current) {
      const timeout = setTimeout(() => {
        gsap.to(bgRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            setIsVisible(false);
            if (bgRef.current) {
              bgRef.current.style.display = 'none';
            }
            onFinish(); // 로딩 종료
          },
        });
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [active, progress, onFinish]);

  useGSAP(
    () => {
      if (!logoRef.current || !descRef.current || !bgRef.current) return;

      const tl = gsap.timeline();

      if (logoRef.current && descRef.current && bgRef.current) {
        // 1. 로고 & 멘트 위로 이동하며 등장
        tl.to(
          logoRef.current,
          {
            y: -40,
            ease: 'power1.out',
            zIndex: 30,
            delay: 0.5,
          },
          'sync'
        )
          .fromTo(
            descRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: descFadeOutDistance,
              ease: 'power2.out',
              zIndex: 30,
              delay: 0.5,
            },
            'sync'
          )
          // 2. 텍스트 색상 하얀색, 배경 색상 검정색으로 변경
          .add(() => {
            gsap.to(logoRef.current, { color: 'white' });
            gsap.to(descRef.current, { color: 'white' });
            gsap.to(bgRef.current, { backgroundColor: 'black' });
          }, '+=0.1')

          // 3. 로고 & 멘트 fade out
          .add(() => {
            gsap.to(logoRef.current, {
              y: 0,
              opacity: 0,
              scale: 0.7,
              duration: 0.5,
              ease: 'power3.out',
            });
            gsap.to(descRef.current, {
              y: 0,
              opacity: 0,
              scale: 0.7,
              duration: 0.5,
              ease: 'power3.out',
            });
          }, '+=1');
      }
    },
    { scope: bgRef }
  );

  if (!isVisible) return null;

  return (
    <div
      ref={bgRef}
      className="fixed top-0 left-0 w-full h-screen bg-white text-[#000000] flex flex-col justify-center items-center z-[9999] overflow-hidden"
    >
      <h1 ref={logoRef} className="custom-font text-[194px] max-sm:text-8xl">
        IT:PLACE
      </h1>
      <p ref={descRef} className="text-5xl text-center max-sm:text-body-1">
        혜택을 지도에서, 빠르고 간편하게
      </p>
    </div>
  );
};

export default LoadingScreen;
