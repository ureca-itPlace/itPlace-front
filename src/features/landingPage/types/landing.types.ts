// 로딩 애니메이션
export type LoadingScreenProps = {
  logoRef: React.RefObject<HTMLHeadingElement | null>;
  descRef: React.RefObject<HTMLParagraphElement | null>;
  bgRef: React.RefObject<HTMLElement | null>;
};

export type VideoProps = {
  onVideoEnd: () => void;
  videoBoxRef: React.RefObject<HTMLDivElement | null>;
};

export type VideoSectionProps = {
  setVideoEnded: React.Dispatch<React.SetStateAction<boolean>>;
};
