export type IntroSectionProps = {
  onComplete: () => void;
};

export type IntroAnimationProps = {
  logoRef: React.RefObject<HTMLElement | null>;
  descRef: React.RefObject<HTMLElement | null>;
  bgRef: React.RefObject<HTMLElement | null>;
  onComplete: () => void;
};

export type VideoSectionProps = {
  onVideoEnd: () => void;
  videoBoxRef: React.RefObject<HTMLDivElement | null>;
};

export type FeatureSectionProps = {
  videoEnded: boolean;
  setVideoEnded: React.Dispatch<React.SetStateAction<boolean>>;
};
