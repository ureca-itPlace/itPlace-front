import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const loadingContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active && loadingContainerRef.current) {
      gsap.to(loadingContainerRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          if (loadingContainerRef.current) {
            loadingContainerRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [active]);

  return (
    <div
      ref={loadingContainerRef}
      className="custom-font fixed top-0 left-0 w-full h-screen bg-black flex flex-col justify-center items-center z-[999]"
    >
      <h1 className="text-title-1 m-0 text-white">IT:PLACE</h1>
      {progress > 0 && <p className="text-body-0 my-4 text-white">{Math.round(progress)}%</p>}
    </div>
  );
};

export default LoadingScreen;
