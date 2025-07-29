import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';
import FeatureItem from '../components/FeatureItem';

gsap.registerPlugin(ScrollTrigger);

const MapSection = () => {
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const firstMapImageRef = useRef<HTMLImageElement>(null);
  const secondMapImageRef = useRef<HTMLImageElement>(null);
  const thirdMapImageRef = useRef<HTMLImageElement>(null);
  const fourthMapImageRef = useRef<HTMLImageElement>(null);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const featureItemRef = useRef<HTMLDivElement>(null);

  const { isMobile, isTablet, isLaptop } = useResponsive();

  console.log('width:', window.innerWidth);

  // 반응형을 고려한 세 번째 이미지 x축 이동
  const xDistance = isMobile ? 50 : isTablet ? 180 : isLaptop ? 100 : 400;
  const yDistance = isMobile ? -150 : 50;

  useGSAP(() => {
    if (
      !mapSectionRef.current ||
      !firstMapImageRef.current ||
      !secondMapImageRef.current ||
      !thirdMapImageRef.current ||
      !fourthMapImageRef.current
    )
      return;

    // 초기 설정
    gsap.set(
      [
        firstMapImageRef.current,
        secondMapImageRef.current,
        thirdMapImageRef.current,
        fourthMapImageRef.current,
      ],
      {
        scale: 1,
        opacity: 0,
        filter: 'blur(10px)',
        zIndex: 0,
      }
    );

    const mapTl = gsap.timeline({
      scrollTrigger: {
        trigger: mapSectionRef.current,
        start: 'top top',
        end: '+=2800',
        pin: true,
        pinSpacing: true,
        scrub: 1,
      },
    });

    // 첫 번째 이미지
    mapTl
      .to(
        firstMapImageRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power1.out',
        },
        0
      )
      .to(
        firstMapImageRef.current,
        {
          scale: 1.4,
          opacity: 0,
          duration: 4,
          filter: 'blur(3px)',
          ease: 'none',
        },
        '+=1.5'
      );

    // 두 번째 이미지
    mapTl
      .to(
        secondMapImageRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power1.out',
        },
        '>-0.5'
      )
      .to({}, { duration: 1.5 })
      .to(
        secondMapImageRef.current,
        {
          scale: 1.7,
          x: 80,
          opacity: 0,
          duration: 5,
          ease: 'none',
          filter: 'blur(3px)',
        },
        '+=1.2'
      );

    // 세 번째 이미지
    mapTl
      .to(
        thirdMapImageRef.current,
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power1.out',
        },
        '+=0.5'
      )
      .to({}, { duration: 1.5 })
      .to(
        thirdMapImageRef.current,
        {
          scale: 1.7,
          x: xDistance,
          y: yDistance,
          opacity: 0,
          duration: 6,
          ease: 'none',
          filter: 'blur(3px)',
        },
        '+=1.2'
      );

    // 네 번째 이미지
    mapTl.to(
      fourthMapImageRef.current,
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power1.out',
      },
      '+=0.2'
    );

    // 더미 시간
    mapTl.to({}, { duration: 1 });

    // 배경색 change
    mapTl.to(
      backgroundRef.current,
      {
        backgroundColor: 'black',
        opacity: 1,
      },
      '+=0.5'
    );

    mapTl
      .to(fourthMapImageRef.current, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power1.out',
      })
      .to(fourthMapImageRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 3,
        ease: 'power1.out',
      })
      .to(featureItemRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'power1.out',
        onStart: () => {
          featureItemRef.current?.classList.remove('pointer-events-none');
        },
      });

    // 더미 시간
    mapTl.to({}, { duration: 1 });

    return () => {
      mapTl.kill();
    };
  }, [mapSectionRef]);

  return (
    <section
      data-theme="light"
      ref={mapSectionRef}
      className="relative w-full min-h-[100svh] flex items-center overflow-hidden bg-white"
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
      />
      <div>
        <img
          ref={firstMapImageRef}
          src="/images/landing/map-1.webp"
          alt="지도-1"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          ref={secondMapImageRef}
          src="/images/landing/map-2.webp"
          alt="지도-2"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          ref={thirdMapImageRef}
          src="/images/landing/map-3.webp"
          alt="지도-3"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          ref={fourthMapImageRef}
          src="/images/landing/map-4.webp"
          alt="지도-4"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div
        ref={featureItemRef}
        className="absolute left-0 px-10 w-full opacity-0 pointer-events-none transition-opacity duration-500"
      >
        <FeatureItem
          reverse
          imageSrc="/images/landing/feature-1.webp"
          alt="기능설명-1"
          title={
            <>
              내 주변의 모든 멤버십 혜택을 <span className="text-purple04">지도</span> 위에서 한눈에
              확인하세요!
            </>
          }
          description="지도를 통해 주변에 있는 모든 제휴처의 멤버십 혜택을 간편하게 확인할 수 있어요. 원하는 혜택을 빠르게 찾고, 할인 정보와 제휴 내용을 쉽게 비교해보세요."
        />
      </div>
    </section>
  );
};

export default MapSection;
