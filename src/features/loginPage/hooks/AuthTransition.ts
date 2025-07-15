import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export const AuthTransition = () => {
  const formCardRef = useRef<HTMLDivElement>(null);
  const sideCardRef = useRef<HTMLDivElement>(null);
  const [formStep, setFormStep] = useState<'login' | 'phone-auth'>('login');

  // 카드 위치 차이만큼만 교차 (폼: 왼쪽, 사이드: 오른쪽)
  const DISTANCE = 481;

  // ✅ 초기 위치 설정 (x: 0)
  useEffect(() => {
    gsap.set(formCardRef.current, { x: 0 });
    gsap.set(sideCardRef.current, { x: 0 });
  }, []);

  // 👉 로그인 → 번호 인증
  const goToPhoneAuth = () => {
    const tl = gsap.timeline();

    tl.to(formCardRef.current, {
      x: DISTANCE,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        // 카드가 절반 넘게 밀렸을 때 폼 전환
        const x = gsap.getProperty(formCardRef.current, 'x') as number;
        if (x > DISTANCE / 2 && formStep !== 'phone-auth') {
          setFormStep('phone-auth');
        }
      },
    });

    tl.to(
      sideCardRef.current,
      {
        x: -DISTANCE,
        duration: 0.5,
        ease: 'power2.out',
      },
      '<'
    ); // 동시에 실행
  };

  // 👉 번호 인증 → 로그인
  const goToLogin = () => {
    const tl = gsap.timeline();

    tl.to(formCardRef.current, {
      x: 0,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        const x = gsap.getProperty(formCardRef.current, 'x') as number;
        if (x < DISTANCE / 2 && formStep !== 'login') {
          setFormStep('login');
        }
      },
    });

    tl.to(
      sideCardRef.current,
      {
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '<'
    );
  };

  return {
    formStep,
    formCardRef,
    sideCardRef,
    goToPhoneAuth,
    goToLogin,
  };
};
