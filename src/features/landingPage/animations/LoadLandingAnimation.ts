import gsap from 'gsap';
import { LoadLandingProps } from '../types/landing.types';

export const LoadLandingAnimation = ({ logoRef, descRef, bgRef }: LoadLandingProps) => {
  const tl = gsap.timeline();

  if (logoRef.current && descRef.current && bgRef.current) {
    // 1. 로고 & 멘트 위로 이동하며 등장
    tl.to(
      logoRef.current,
      {
        y: -40,
        ease: 'power1.out',
        zIndex: 30,
        delay: 0.5,
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
          delay: 0.5,
        },
        'sync'
      )
      // 2. 텍스트 색상 하얀색, 배경 색상 검정색으로 변경
      .add(() => {
        gsap.to(logoRef.current, { color: 'white' });
        gsap.to(descRef.current, { color: 'white' });
        gsap.to(bgRef.current, { backgroundColor: 'black' });
      }, '+=0.1')

      // 3. 로고 & 멘트 fade out
      .add(() => {
        gsap.to(logoRef.current, {
          y: 0,
          opacity: 0,
          scale: 0.7,
          duration: 0.5,
          ease: 'power3.out',
        });
        gsap.to(descRef.current, {
          y: 0,
          opacity: 0,
          scale: 0.7,
          duration: 0.5,
          ease: 'power3.out',
        });
      }, '+=1');
  }
};
