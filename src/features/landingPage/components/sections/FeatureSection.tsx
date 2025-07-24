import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import { featureData } from '../../data/featuresData.ts';

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const featureListRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(() => {
    if (!sectionRef.current || !featureListRef.current) return;

    // 초기 상태 설정
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      gsap.set(el, { y: idx === 0 ? '0%' : '100%' });
    });

    // 애니메이션 전체 타임라인
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center',
        end: '+=2000',
        scrub: 0.3,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 2. 카드 등장 & 퇴장 애니메이션
    featureData.forEach((_, idx) => {
      if (idx > 0) {
        tl.to(
          cardRefs.current[idx],
          {
            y: '0%',
            duration: 1.2,
            ease: 'power1.inOut',
            onStart: () => setActiveIdx(idx),
          },
          '+=0.5'
        );
        tl.to(
          cardRefs.current[idx - 1],
          {
            y: '-100%',
            duration: 1.2,
            ease: 'power1.inOut',
          },
          '<'
        );
      }
    });

    featureData.forEach((_, idx) => {
      if (!cardRefs.current[idx]) return;

      ScrollTrigger.create({
        trigger: cardRefs.current[idx],
        start: 'top top',
        end: 'bottom top',
        onToggle: (self) => {
          if (self.isActive) {
            setActiveIdx(idx);
          }
        },
      });
    });
  }, [cardRefs, sectionRef]);

  const handleMenuClick = (idx: number) => {
    const targetCard = cardRefs.current[idx];
    if (targetCard) {
      // 카드 위치를 y:0%로 설정
      gsap.to(targetCard, {
        y: '0%',
        duration: 1.2,
        ease: 'power1.inOut',
      });

      // 해당 카드로 스크롤 이동
      gsap.to(window, {
        scrollTo: targetCard,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      setActiveIdx(idx);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="w-full h-full flex items-center justify-center max-sm:flex-col">
        <nav ref={featureListRef}>
          <ul className="flex flex-col gap-28 text-[64px] ml-36 whitespace-nowrap text-white">
            {featureData.map((feature, i) => (
              <li key={feature.title}>
                <button
                  onClick={() => handleMenuClick(i)}
                  className={`transition-colors ${activeIdx === i ? 'text-purple04' : 'text-white'}`}
                >
                  {feature.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="relative flex flex-col w-[57%] h-full ml-auto text-black">
          {featureData.map((feature, i) => (
            <li
              key={feature.title}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className={`${feature.color} absolute top-0 right-0 flex flex-col items-center justify-center h-screen w-full ml-auto`}
            >
              <div className="flex items-center justify-center mb-20 mt-24 w-[964px] h-[476px]">
                <img
                  src={feature.image}
                  alt={`기능-소개${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-14 ml-16 mr-20">
                <h1 className="text-title-1">{feature.title}</h1>
                <h4 className="text-2xl leading-loose font-light pb-20">{feature.description}</h4>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeatureSection;
