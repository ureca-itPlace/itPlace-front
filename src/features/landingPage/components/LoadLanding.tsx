import { useGSAP } from '@gsap/react';
import { LoadLandingAnimation } from '../animations/LoadLandingAnimation';
import { useRef } from 'react';

const LoadLanding = () => {
  const logoRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const bgRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!logoRef.current || !descRef.current || !bgRef.current) return;

      LoadLandingAnimation({ logoRef, descRef, bgRef });
    },
    { scope: bgRef }
  );

  return (
    <section
      ref={bgRef}
      className="w-full h-screen flex justify-center items-center bg-white flex-col overflow-hidden relative z-30"
    >
      <h1 ref={logoRef} className="custom-font text-[194px] max-sm:text-8xl text-black">
        IT:PLACE
      </h1>
      <p ref={descRef} className="text-5xl text-center max-sm:text-body-1">
        혜택을 지도에서, 빠르고 간편하게
      </p>
    </section>
  );
};

export default LoadLanding;
