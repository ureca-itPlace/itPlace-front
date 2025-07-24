import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export const AuthTransition = () => {
  const navigate = useNavigate();
  const formCardRef = useRef<HTMLDivElement>(null);
  const sideCardRef = useRef<HTMLDivElement>(null);

  // 현재 단계 상태
  const [formStep, setFormStep] = useState<
    | 'login'
    | 'phoneAuth'
    | 'verification'
    | 'signUp'
    | 'signUpFinal'
    | 'findEmail'
    | 'findPassword'
    | 'oauthIntegration'
  >('login');

  // 반응형 카드 이동 거리 계산
  const getDistance = () => {
    if (window.innerWidth <= 1023) {
      return 307; // max-lg: 태블릿 가로
    } else if (window.innerWidth <= 1536) {
      return 409; // max-xl: 노트북
    }
    return 481; // 기본 데스크톱
  };

  // 초기 위치 세팅 (로그인 상태)
  useEffect(() => {
    gsap.set(formCardRef.current, { x: 0 });
    gsap.set(sideCardRef.current, { x: 0 });
  }, []);

  // 윈도우 리사이즈 시 카드 위치 재조정
  useEffect(() => {
    const handleResize = () => {
      // 로그인 상태가 아닐 때만 위치 재조정
      if (formStep !== 'login') {
        const newDistance = getDistance();
        gsap.set(formCardRef.current, { x: newDistance });
        gsap.set(sideCardRef.current, { x: -newDistance });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [formStep]);

  // 오른쪽으로 슬라이드 → 인증/회원가입 진입용
  const animateToRight = (targetStep: typeof formStep) => {
    const distance = getDistance();
    const tl = gsap.timeline();

    tl.to(formCardRef.current, {
      x: distance,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        const x = gsap.getProperty(formCardRef.current, 'x') as number;
        if (x > distance / 2 && formStep !== targetStep) {
          setFormStep(targetStep);
        }
      },
    });

    tl.to(
      sideCardRef.current,
      {
        x: -distance,
        duration: 0.5,
        ease: 'power2.out',
      },
      '<'
    );
  };

  // 왼쪽으로 슬라이드 → 로그인 복귀용
  const goToLogin = () => {
    // URL 파라미터 정리
    navigate('/login', { replace: true });

    const distance = getDistance();
    const tl = gsap.timeline();

    tl.to(formCardRef.current, {
      x: 0,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        const x = gsap.getProperty(formCardRef.current, 'x') as number;
        if (x < distance / 2 && formStep !== 'login') {
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

  // 전화번호 인증 진입 (애니메이션 포함)
  const goToPhoneAuth = () => animateToRight('phoneAuth');

  // 인증번호 입력 단계 (같은 카드 내 내부 전환)
  const goToVerification = () => {
    console.log('🟡 AuthTransition: formStep을 verification으로 변경');
    setFormStep('verification');
  };

  // 회원가입 입력 단계 (같은 카드 내 내부 전환)
  const goToSignUp = () => setFormStep('signUp');

  // 회원가입 완료 단계 (같은 카드 내 내부 전환)
  const goToSignUpFinal = () => setFormStep('signUpFinal');

  // 이메일 찾기 결과 화면 (애니메이션 포함)
  const goToFindEmail = () => animateToRight('findEmail');

  const goToFindPassword = () => animateToRight('findPassword');

  return {
    formStep,
    setFormStep,
    formCardRef,
    sideCardRef,
    goToLogin,
    goToPhoneAuth,
    goToVerification,
    goToSignUp,
    goToSignUpFinal,
    goToFindEmail,
    goToFindPassword,
  };
};
