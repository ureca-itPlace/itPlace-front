import { gsap } from 'gsap';
import { useLayoutEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const loadingContainerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useLayoutEffect(() => {
    if (!active && progress === 100 && loadingContainerRef.current) {
      const timeout = setTimeout(() => {
        gsap.to(loadingContainerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            setIsVisible(false);
            if (loadingContainerRef.current) {
              loadingContainerRef.current.style.display = 'none';
            }
          },
        });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  if (!isVisible) return null;

  return (
    <div
      ref={loadingContainerRef}
      className="fixed top-0 left-0 w-full h-screen bg-black flex flex-col justify-center items-center z-[9999]"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        opacity: 1,
        willChange: 'opacity',
      }}
    >
      <h1 className="custom-font text-[194px] max-sm:text-8xl m-0 text-white select-none">
        IT:PLACE
      </h1>
      {progress > 0 && (
        <p className="text-body-0 my-4 text-white transition-opacity duration-300">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
};

export default LoadingScreen;
