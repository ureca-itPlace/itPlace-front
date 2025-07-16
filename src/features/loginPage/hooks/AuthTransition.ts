import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export const AuthTransition = () => {
  const formCardRef = useRef<HTMLDivElement>(null);
  const sideCardRef = useRef<HTMLDivElement>(null);
  const [formStep, setFormStep] = useState<
    'login' | 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal'
  >('login');

  const DISTANCE = 481;

  // 초기 위치 설정
  useEffect(() => {
    gsap.set(formCardRef.current, { x: 0 });
    gsap.set(sideCardRef.current, { x: 0 });
  }, []);

  const goToPhoneAuth = () => {
    const tl = gsap.timeline();
    tl.to(formCardRef.current, {
      x: DISTANCE,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        const x = gsap.getProperty(formCardRef.current, 'x') as number;
        if (x > DISTANCE / 2 && formStep !== 'phoneAuth') {
          setFormStep('phoneAuth');
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
    );
  };

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

  const goToVerification = () => {
    setFormStep('verification'); // 내부 교체만
  };

  const goToSignUp = () => {
    setFormStep('signUp'); // 내부 교체만
  };

  const goToSignUpFinal = () => setFormStep('signUpFinal');

  return {
    formStep,
    formCardRef,
    sideCardRef,
    goToLogin,
    goToPhoneAuth,
    goToVerification,
    goToSignUp,
    goToSignUpFinal,
  };
};
