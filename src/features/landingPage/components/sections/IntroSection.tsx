import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { introAnimation } from '../../animations/IntroAnimation';
import { IntroProps } from '../../types/animation';

const IntroSection = ({ onComplete }: IntroProps) => {
  const logoRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    introAnimation({ logoRef, descRef, bgRef, onComplete });
  }, [onComplete]);

  return (
    <div
      ref={bgRef}
      className="w-full h-screen flex justify-center items-center bg-white flex-col overflow-hidden relative z-30"
    >
      <h1 ref={logoRef} className="custom-font text-[194px] max-sm:text-8xl text-black">
        IT:PLACE
      </h1>
      <p ref={descRef} className="text-5xl text-center max-sm:text-body-1">
        혜택을 지도에서, 빠르고 간편하게
      </p>
    </div>
  );
};

export default IntroSection;
