import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';
import { useResponsive } from '../../../hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger, SplitText);

const MapSection = () => {
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const firstMapImageRef = useRef<HTMLImageElement>(null);
  const secondMapImageRef = useRef<HTMLImageElement>(null);
  const thirdMapImageRef = useRef<HTMLImageElement>(null);
  const fourthMapImageRef = useRef<HTMLImageElement>(null);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const { isMobile, isTablet } = useResponsive();

  // 반응형을 고려한 세 번째 이미지 x축 이동
  const xDistance = isMobile ? 100 : isTablet ? 200 : 400;
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
        end: '+=3200',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
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
          filter: 'blur(10px)',
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
      .to(
        secondMapImageRef.current,
        {
          scale: 2,
          x: 80,
          opacity: 0,
          duration: 4,
          ease: 'none',
          filter: 'blur(10px)',
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
        '>-0.5'
      )
      .to(
        thirdMapImageRef.current,
        {
          scale: 2,
          x: xDistance,
          y: yDistance,
          opacity: 0,
          duration: 6,
          ease: 'none',
          filter: 'blur(10px)',
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

    // 이미지 축소 및 오른쪽으로 이동
    mapTl.to(
      fourthMapImageRef.current,
      {
        scale: isMobile || isTablet ? 0.8 : 0.46,
        x: isMobile || isTablet ? 0 : 400,
        duration: 6,
        ease: 'power1.Out',
      },
      '+=0.5'
    );

    // 텍스트 타이틀 애니메이션
    const titleSplit = new SplitText(titleRef.current, {
      type: 'chars',
      charsClass: 'char',
    });

    mapTl.from(
      titleSplit.chars,
      {
        xPercent: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power1.out',
        stagger: 0.035,
        force3D: true,
      },
      '+=0.2'
    );

    // 텍스트 설명 애니메이션
    const descSplit = new SplitText(descRef.current, {
      type: 'lines',
      linesClass: 'line',
    });

    mapTl.from(
      descSplit.lines,
      {
        yPercent: 100,
        opacity: 0,
        duration: 3,
        stagger: 0.1,
        ease: 'power3.out',
        force3D: true,
      },
      '+=0.2'
    );

    // 더미 시간
    mapTl.to({}, { duration: 1 });

    return () => {
      mapTl.kill();
      titleSplit.revert();
      descSplit.revert();
    };
  }, [mapSectionRef]);

  return (
    <section
      data-theme="light"
      ref={mapSectionRef}
      className="relative w-full h-screen flex items-center overflow-hidden bg-white"
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
      />
      <div>
        <img
          ref={firstMapImageRef}
          src="/images/landing/map-1.webp"
          alt="지도"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          ref={secondMapImageRef}
          src="/images/landing/map-2.webp"
          alt="지도2"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          ref={thirdMapImageRef}
          src="/images/landing/map-3.webp"
          alt="지도3"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          ref={fourthMapImageRef}
          src="/images/landing/map-4.webp"
          alt="지도4"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="relative w-[40%] text-white flex flex-col ml-20 gap-20">
        <h1 ref={titleRef} className="text-5xl font-bold">
          제휴처 멤버십을 지도에서 한눈에!
        </h1>
        <h4 ref={descRef} className="text-3xl leading-loose">
          내 주변 제휴처를 지도에서 한눈에 확인하고, 다양한 혜택 정보를 바로 비교할 수 있어요.
          원하는 조건으로 필터링하고, 클릭 한 번으로 제휴처 상세 페이지로 이동할 수 있어요. 즐겨찾기
          기능과 맞춤 추천으로 나에게 꼭 맞는 혜택을 더 쉽게 찾을 수 있어요.
        </h4>
      </div>
    </section>
  );
};

export default MapSection;
