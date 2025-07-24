// 로딩 타입 정의
export interface LoadingScreenProps {
  logoRef: React.RefObject<HTMLHeadingElement | null>;
  descRef: React.RefObject<HTMLParagraphElement | null>;
  bgRef: React.RefObject<HTMLElement | null>;
}

// 비디오 섹션 타입 정의
export interface VideoProps {
  onVideoEnd: () => void;
  videoBoxRef: React.RefObject<HTMLDivElement | null>;
}

export interface VideoSectionProps {
  setVideoEnded: React.Dispatch<React.SetStateAction<boolean>>;
}

// 지구 섹션 타입 정의
export interface EarthModelProps {
  trigger: HTMLElement | null;
  canvasWrapperRef: React.RefObject<HTMLDivElement | null>;
}

export type EarthSceneProps = {
  earthAnimationTrigger: React.RefObject<HTMLElement | null>;
};

// 버튼 컴포넌트 타입 정의
export type ButtonProps = {
  children: string;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
};

// 구름 컴포넌트 타입 정의
export interface CloudProps {
  className?: string;
}
