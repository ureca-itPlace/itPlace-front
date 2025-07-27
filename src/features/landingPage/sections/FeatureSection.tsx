import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useRef } from 'react';
import CustomCursor from '../components/CustomCursor';

gsap.registerPlugin(SplitText, ScrollSmoother);

const FeatureSection = () => {
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);
  const descRefs = useRef<HTMLParagraphElement[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const titleSplits: SplitText[] = [];
    const descSplits: SplitText[] = [];

    document.fonts.ready.then(() => {
      // ScrollTrigger 타임라인
      const featureTl = gsap.timeline({
        scrollTrigger: {
          trigger: featureSectionRef.current,
          start: 'top 150%',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      // 텍스트 애니메이션
      let currentTime = 0;

      titleRefs.current.forEach((titleEl, i) => {
        const descEl = descRefs.current[i];
        if (!titleEl || !descEl) return;

        const titleSplit = new SplitText(titleEl, {
          type: 'chars',
          charsClass: 'char',
        });
        titleSplits.push(titleSplit);

        const descSplit = new SplitText(descEl, {
          type: 'lines',
          linesClass: 'line',
        });
        descSplits.push(descSplit);

        // 타이틀 애니메이션
        featureTl.from(
          titleSplit.chars,
          {
            xPercent: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power1.out',
            stagger: 0.03,
            force3D: true,
          },
          currentTime
        );

        // 설명 애니메이션
        featureTl.from(
          descSplit.lines,
          {
            yPercent: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out',
            stagger: 0.1,
            force3D: true,
          },
          currentTime + 0.3
        );

        currentTime += 0.7;
      });
    });

    return () => {
      titleSplits.forEach((split) => split.revert());
      descSplits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div data-theme="dark" ref={featureSectionRef} className="h-[270vh] bg-[#000000]">
      <div className="h-[90vh] flex justify-center items-center">
        <div className="w-1/2 h-full flex justify-center items-center pr-3">
          <img
            ref={imgRef}
            src="/images/landing/map-4.webp"
            alt="기능설명1"
            className="h-[95%] w-auto object-contain"
          />
        </div>
        <div className="relative w-[40%] text-white flex flex-col ml-12 gap-20">
          <h1
            ref={(el) => {
              if (el) titleRefs.current[0] = el;
            }}
            className="text-5xl font-bold [&_.char]:inline-block"
          >
            제휴처 멤버십을 지도에서 한눈에!
          </h1>
          <h4
            ref={(el) => {
              if (el) descRefs.current[0] = el;
            }}
            className="text-3xl leading-loose"
          >
            내 주변 제휴처를 지도에서 한눈에 확인하고, 다양한 혜택 정보를 바로 비교할 수 있어요.
            원하는 조건으로 필터링하고, 클릭 한 번으로 제휴처 상세 페이지로 이동할 수 있어요.
            즐겨찾기 기능과 맞춤 추천으로 나에게 꼭 맞는 혜택을 더 쉽게 찾을 수 있어요.
          </h4>
        </div>
      </div>
      <div className="h-[90vh] flex justify-center items-center">
        <div className="relative w-[40%] text-white flex flex-col mr-12 gap-20">
          <h1
            ref={(el) => {
              if (el) titleRefs.current[1] = el;
            }}
            className="text-5xl font-bold [&_.char]:inline-block"
          >
            제휴처 멤버십을 지도에서 한눈에!
          </h1>
          <h4
            ref={(el) => {
              if (el) descRefs.current[1] = el;
            }}
            className="text-3xl leading-loose"
          >
            내 주변 제휴처를 지도에서 한눈에 확인하고, 다양한 혜택 정보를 바로 비교할 수 있어요.
            원하는 조건으로 필터링하고, 클릭 한 번으로 제휴처 상세 페이지로 이동할 수 있어요.
            즐겨찾기 기능과 맞춤 추천으로 나에게 꼭 맞는 혜택을 더 쉽게 찾을 수 있어요.
          </h4>
        </div>
        <div className="w-1/2 h-full flex justify-center items-center pl-3">
          <img
            src="/images/landing/map-4.webp"
            alt="기능설명2"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
      <div className="h-[90vh] flex justify-center items-center">
        <div className="w-1/2 h-full flex justify-center items-center pr-3">
          <img
            src="/images/landing/map-4.webp"
            alt="기능설명3"
            className="h-full w-auto object-contain "
          />
        </div>
        <div className="relative w-[40%] text-white flex flex-col ml-12 gap-20">
          <h1
            ref={(el) => {
              if (el) titleRefs.current[2] = el;
            }}
            className="text-5xl font-bold [&_.char]:inline-block"
          >
            제휴처 멤버십을 지도에서 한눈에!
          </h1>
          <h4
            ref={(el) => {
              if (el) descRefs.current[2] = el;
            }}
            className="text-3xl leading-loose"
          >
            내 주변 제휴처를 지도에서 한눈에 확인하고, 다양한 혜택 정보를 바로 비교할 수 있어요.
            원하는 조건으로 필터링하고, 클릭 한 번으로 제휴처 상세 페이지로 이동할 수 있어요.
            즐겨찾기 기능과 맞춤 추천으로 나에게 꼭 맞는 혜택을 더 쉽게 찾을 수 있어요.
          </h4>
        </div>
      </div>
      <CustomCursor />
    </div>
  );
};

export default FeatureSection;
