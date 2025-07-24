import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { LoadingScreenAnimation } from '../animations/LoadingScreenAnimation';

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(true);

  const logoRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

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
          },
        });
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  useGSAP(
    () => {
      if (!logoRef.current || !descRef.current || !bgRef.current) return;

      LoadingScreenAnimation({ logoRef, descRef, bgRef });
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
