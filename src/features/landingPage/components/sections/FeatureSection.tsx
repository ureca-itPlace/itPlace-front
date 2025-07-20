import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PurpleCircle from '../common/PurpleCircle';
import VideoSection from './VideoSection';

gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null); // 추가

  const [videoEnded, setVideoEnded] = useState(false);

  useGSAP(() => {
    if (!circleRef.current || !sectionRef.current || !videoBoxRef.current) return;

    gsap.fromTo(
      circleRef.current,
      { scale: 0.3 },
      {
        scale: 30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: '+=500',
          scrub: 0.5,
          pin: true,
          markers: true,
        },
        ease: 'none',
      }
    );

    gsap.to(videoBoxRef.current, {
      clipPath: 'circle(100% at 50% 50%)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'center center',
        end: '+=500',
        scrub: 0.5,
        pin: false,
        markers: true,
      },
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black overflow-hidden flex justify-center items-center text-white text-8xl"
    >
      기능 설명 섹션입니다
      <VideoSection
        onVideoEnd={() => {
          setVideoEnded(true);
        }}
        videoBoxRef={videoBoxRef}
      />
      <PurpleCircle ref={circleRef} />
    </section>
  );
};

export default FeatureSection;
