import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const LoadLanding = () => {
  const logoRef = useRef(null);
  const descRef = useRef(null);
  const bgRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. logo 등장 애니메이션
    tl.fromTo(
      logoRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: 'power4.out',
        zIndex: 30,
      }
    )

      // 2. 소개문 등장 애니메이션 (로고도 동시에 위로 이동)
      .to(
        logoRef.current,
        {
          y: -40,
          ease: 'power1.out',
          zIndex: 30,
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
        },
        'sync'
      )

      .add(() => {
        gsap.to(logoRef.current, { color: 'white' });
        gsap.to(descRef.current, { color: 'white' });

        // 배경 색상 검정색으로 변경
        gsap.to(bgRef.current, { backgroundColor: 'black' });
      }, '+=0.5')

      .add(() => {
        gsap.to(logoRef.current, {
          y: 10,
          opacity: 0,
          scale: 0.5,
          duration: 1,
          ease: 'power3.out',
        });
        gsap.to(descRef.current, {
          y: -50,
          opacity: 0,
          scale: 0.5,
          duration: 1,
          ease: 'power3.out',
        });
      }, '+=1'); // 0.5초 뒤에 1초 후 사라지는 애니메이션 시작
  }, []);

  return isLoading ? (
    <div className="w-full h-screen flex justify-center items-center bg-white flex-col overflow-hidden relative mt-[-24px]">
      <h1 className="custom-font text-[194px] max-sm:text-8xl text-black">IT:PLACE</h1>
    </div>
  ) : (
    <div
      ref={bgRef}
      className="w-full h-screen flex justify-center items-center bg-white flex-col overflow-hidden relative"
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

export default LoadLanding;
