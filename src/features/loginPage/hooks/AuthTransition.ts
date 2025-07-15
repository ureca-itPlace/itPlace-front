import { useState, useRef } from 'react';
import gsap from 'gsap';

type FormStep = 'login' | 'phoneAuth';

export const AuthTransition = () => {
  const [formStep, setFormStep] = useState<FormStep>('login');

  const formCardRef = useRef<HTMLDivElement | null>(null);
  const sideCardRef = useRef<HTMLDivElement | null>(null);

  const goToPhoneAuth = () => {
    const formEl = formCardRef.current;
    const sideEl = sideCardRef.current;

    if (!formEl || !sideEl) return;

    // 두 카드 동시에 이동
    const tl = gsap.timeline({
      onComplete: () => {
        setFormStep('phoneAuth');
        // 카드 전환 후 다시 원위치로 슬라이드 인
        gsap.fromTo(
          formEl,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
        gsap.fromTo(
          sideEl,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      },
    });

    tl.to(formEl, {
      x: 583 + 61,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }).to(
      sideEl,
      {
        x: -(583 + 61),
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      },
      '<'
    );
  };

  return {
    formStep,
    goToPhoneAuth,
    formCardRef,
    sideCardRef,
  };
};
