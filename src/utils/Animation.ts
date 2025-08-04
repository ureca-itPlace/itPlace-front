import gsap from 'gsap';

export const actionAnimations = {
  // AI 탭 통통 튀기는 애니메이션
  bounceAnimation: (element: HTMLElement): gsap.core.Tween => {
    return gsap.to(element, {
      y: -8,
      duration: 0.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  },

  scaleAnimation: (element: HTMLElement): gsap.core.Tween => {
    return gsap.to(element, {
      scale: 1.1,
      duration: 0.7,
      yoyo: true,
      repeat: -1,
      ease: 'power1.out',
    });
  },

  // 호버 시 원위치로 돌아가는 애니메이션
  returnToPosition: (element: HTMLElement): gsap.core.Tween => {
    return gsap.to(element, {
      y: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  },

  // 클릭 시 스케일 애니메이션
  clickScale: (element: HTMLElement): gsap.core.Tween => {
    return gsap.fromTo(
      element,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'back.inOut(1.7)',
      }
    );
  },

  // 요소를 원위치로 리셋
  resetPosition: (element: HTMLElement): void => {
    gsap.set(element, { y: 0 });
  },

  // 애니메이션 정리
  killAnimation: (animation: gsap.core.Tween | null): void => {
    if (animation) {
      animation.kill();
    }
  },
};

export const entranceAnimation = {
  bounceIn: (element: HTMLElement): gsap.core.Tween => {
    return gsap.fromTo(
      element,
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'back.out(2.5)',
      }
    );
  },

  strongBounceIn: (element: HTMLElement): gsap.core.Tween => {
    return gsap.fromTo(
      element,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'back.out(1.7)',
      }
    );
  },

  slideFromLeft: (element: HTMLElement): gsap.core.Tween => {
    return gsap.fromTo(
      element,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }
    );
  },

  dropFromTop: (element: HTMLElement): gsap.core.Tween => {
    return gsap.fromTo(
      element,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }
    );
  },

  bounceToFront: (element: HTMLElement): gsap.core.Tween => {
    return gsap.fromTo(
      element,
      { scale: 0.8, opacity: 1 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'bounce.out(1)',
      }
    );
  },

  // 애니메이션 정리
  killAnimation: (animation: gsap.core.Tween | null): void => {
    if (animation) {
      animation.kill();
    }
  },
};
