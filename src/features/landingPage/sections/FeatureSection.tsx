import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import FeatureItem from '../components/FeatureItem';

gsap.registerPlugin(ScrollTrigger);
const FeatureSection = () => {
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const assets = gsap.utils.toArray('.floating-star') as HTMLElement[];

    assets.forEach((asset) => {
      gsap.to(asset, {
        y: -30,
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 1),
      });
    });
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray('.feature-image');
      const titles = gsap.utils.toArray('.feature-title');
      const descs = gsap.utils.toArray('.feature-desc');

      // 이미지 애니메이션
      images.forEach((image, index) => {
        gsap.from(image as HTMLImageElement, {
          opacity: 0,
          scale: 0.7,
          rotationY: index % 2 === 0 ? -180 : 180,
          duration: 8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: image as HTMLImageElement,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 1.2,
          },
        });
      });

      // 타이틀 애니메이션
      titles.forEach((title) => {
        gsap.from(title as HTMLHeadingElement, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: title as HTMLHeadingElement,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.6,
          },
        });
      });

      // 설명 문구 애니메이션
      descs.forEach((desc) => {
        gsap.from(desc as HTMLParagraphElement, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: desc as HTMLParagraphElement,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 0.6,
          },
        });
      });

      ScrollTrigger.refresh();
    }, featureSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={featureSectionRef}
      data-theme="dark"
      className="relative max-h-[400svh] px-5 py-12 bg-[#000000] flex flex-col justify-center gap-10 max-lg:px-8 overflow-x-hidden"
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
      <FeatureItem
        imageSrc="/images/landing/feature-2.webp"
        alt="기능설명-2"
        title={
          <>
            내가 자주 쓰는 혜택을 <span className="text-purple04">AI</span>가 알아서 추천해줘요!
          </>
        }
        description="사용 내역과 관심사를 AI가 분석하여 가장 적합한 혜택을 맞춤 추천해드립니다. 더 이상 어렵게 찾지 말고 나만을 위한 혜택을 빠르게 받아보세요."
      />
      <FeatureItem
        reverse
        imageSrc="/images/landing/feature-3.webp"
        alt="기능설명-3"
        title={
          <>
            <span className="text-purple04">관심 있는 혜택</span>만 따로 모아 관리하세요!
          </>
        }
        description="관심 있는 제휴처 혜택을 저장하고 나만의 리스트를 만들어 관리할 수 있어요. 중요한 혜택을 놓치지 않도록 스마트하게 관리해보세요."
      />
      <FeatureItem
        imageSrc="/images/landing/feature-4-web.webp"
        alt="기능 설명-4"
        title={
          <>
            <span className="text-purple04">금액 입력</span>만으로 내 혜택을 정리해드려요!
          </>
        }
        description="간단한 금액 입력만으로 제휴처에서 사용한 내역과 혜택 현황을 쉽게 조회할 수 있어요. 소비 패턴 분석과 맞춤형 혜택 관리까지 한 번에 가능합니다."
      />
      <div className="floating-star-layer z-0 pointer-events-none">
        <img
          ref={planeRef}
          src="/images/landing/plane.webp"
          alt="종이비행기"
          className="floating-star absolute top-[20%] left-[15%] w-[17vw] h-auto"
        />
        <img
          src="/images/landing/key.webp"
          alt="열쇠"
          className="floating-star absolute top-[42%] right-[15%] w-[20vw]"
        />
        <img
          src="/images/landing/feature-star.webp"
          alt="별"
          className="floating-star absolute bottom-[22%] left-[15%] w-[20vw]"
        />
        <img
          src="/images/landing/coin.webp"
          alt="동전"
          className="floating-star absolute bottom-[0%] right-[15%] w-[20vw]"
        />
      </div>
    </section>
  );
};

export default FeatureSection;
