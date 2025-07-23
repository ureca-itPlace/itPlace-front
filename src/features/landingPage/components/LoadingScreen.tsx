import { gsap } from 'gsap';
import { useLayoutEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import { LoadLandingAnimation } from '../animations/LoadLandingAnimation';

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(true);

  const logoRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

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
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  useGSAP(
    () => {
      if (!logoRef.current || !descRef.current || !bgRef.current) return;

      LoadLandingAnimation({ logoRef, descRef, bgRef });
    },
    { scope: bgRef }
  );

  if (!isVisible) return null;

  return (
    <div
      ref={bgRef}
      className="fixed top-0 left-0 w-full h-screen bg-white flex flex-col justify-center items-center z-[9999]"
    >
      <h1 ref={logoRef} className="custom-font text-[194px] max-sm:text-8xl text-black">
        IT:PLACE
      </h1>
      <p ref={descRef} className="text-5xl text-center max-sm:text-body-1 text-black">
        혜택을 지도에서, 빠르고 간편하게
      </p>
    </div>
  );
};

export default LoadingScreen;
