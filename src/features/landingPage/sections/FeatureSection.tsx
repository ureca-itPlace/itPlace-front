import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useRef, useState } from 'react';
import { featureData } from '../data/featuresData.ts';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const FeatureSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureCardRefs = useRef<HTMLLIElement[]>([]);
  const menuLinksRef = useRef<HTMLDivElement[]>([]); // `a` 태그 대신 div로 설정

  const [activeIdx, setActiveIdx] = useState(0);

  // 현재 카드 설정
  const setCardRef = (el: HTMLLIElement | null, index: number) => {
    if (el) featureCardRefs.current[index] = el;
  };

  // 현재 기능 메뉴 설정
  const setMenuLinkRef = (el: HTMLDivElement | null, index: number) => {
    if (el) menuLinksRef.current[index] = el;
  };

  useGSAP(() => {
    if (!sectionRef.current) return;

    // 기능 카드 초기 설정
    featureCardRefs.current.forEach((el, idx) => {
      if (!el) return;
      gsap.set(el, {
        y: idx === 0 ? '0%' : '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: featureData.length - idx,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'feature-scroll',
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${featureData.length * 600}`,
        scrub: 0.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const scroll = self.scroll();
          const step = (self.end - self.start) / (featureData.length - 1);
          const idx = Math.round((scroll - self.start) / step);
          setActiveMenu(idx);
        },
      },
    });

    featureData.forEach((_, idx) => {
      if (idx > 0) {
        tl.to(featureCardRefs.current[idx], { y: '0%', duration: 0.5, ease: 'none' }, idx * 1);
        tl.to(
          featureCardRefs.current[idx - 1],
          { y: '-100%', duration: 0.5, ease: 'none' },
          idx * 1
        );
      } else {
        tl.set({}, { onStart: () => setActiveMenu(0) });
      }

      // 카드가 화면의 중간에 올 때마다 메뉴 항목의 active 상태 변경
      ScrollTrigger.create({
        trigger: featureCardRefs.current[idx],
        start: 'top center', // 화면의 중간에 도달할 때
        end: 'bottom center', // 끝까지
        onEnter: () => setActiveMenu(idx),
        onLeaveBack: () => setActiveMenu(-1), // 카드가 다시 지나가면 active 상태를 리셋
      });
    });
  }, []);

  const setActiveMenu = (index: number) => {
    setActiveIdx(index);
    menuLinksRef.current.forEach((link, i) => {
      if (link) {
        link.classList.toggle('active', i === index);
      }
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] bg-[#000000] flex items-center overflow-hidden max-lg:flex-col max-lg:items-start"
    >
      <div className="z-30 h-full">
        <div className="relative h-full w-[43dvw] z-30 overflow-hidden pl-36 max-lg:px-5 max-lg:w-full max-lg:items-center">
          <ul className="h-full w-full flex flex-col text-[64px] justify-between py-24 whitespace-nowrap text-white max-lg:flex-row max-lg:pb-16 max-lg:gap-14 max-sm:gap-6 max-sm:pt-10 max-sm:pb-6 max-sm:text-title-4">
            {featureData.map((feature, idx) => (
              <li key={idx}>
                <div
                  ref={(el) => setMenuLinkRef(el, idx)}
                  className={`${
                    activeIdx === idx ? 'active text-purple04 font-bold' : 'text-white'
                  }`}
                >
                  {feature.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-[100dvh] flex-1 relative">
        <ul className="relative w-full h-full">
          {featureData.map((feature, idx) => (
            <li
              key={idx}
              id={`feature${idx + 1}`}
              ref={(el) => setCardRef(el, idx)}
              className={`w-full h-full flex flex-col justify-center items-center ${
                idx % 2 === 0 ? 'bg-gray-400' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-center mb-20 mt-24 w-[88%] h-[476px] max-sm:h-[158px] max-sm:mb-16">
                <img
                  src={feature.image || '/images/landing/landing-feature-1.png'}
                  alt={`기능소개${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-10 ml-16 mr-20 max-sm:mx-5 max-sm:gap-6 max-lg:items-center">
                <h1 className="text-title-1 max-sm:text-title-5 text-black">{feature.title}</h1>
                <h4 className="text-2xl leading-loose font-light pb-20 max-sm:text-body-0 max-sm:text-center text-black">
                  {feature.description}
                </h4>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeatureSection;
