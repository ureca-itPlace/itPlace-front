import gsap from 'gsap';

export const tabAnimations = {
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
        ease: 'power2.inOut',
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
