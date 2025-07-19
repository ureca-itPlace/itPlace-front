export type IntroProps = {
  onComplete: () => void;
};

export type IntroAnimationProps = {
  logoRef: React.RefObject<HTMLElement | null>;
  descRef: React.RefObject<HTMLElement | null>;
  bgRef: React.RefObject<HTMLElement | null>;
  onComplete: () => void;
};
