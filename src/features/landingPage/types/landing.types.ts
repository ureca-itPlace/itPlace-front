// 인트로 타입 정의
export interface IntroProps {
  onFinish: () => void;
}

// 기능 설명 섹션 타입 정의
export interface FeatureItemProps {
  reverse?: boolean;
  imageSrc: string;
  alt: string;
  title: React.ReactNode;
  description: string;
  imageRef?: React.RefObject<HTMLImageElement>;
  number?: number;
}

// 비디오 섹션 타입 정의
export interface VideoProps {
  onVideoEnd: () => void;
  videoBoxRef: React.RefObject<HTMLDivElement | null>;
}

export interface VideoSectionProps {
  videoEnded: boolean;
  setVideoEnded: (ended: boolean) => void;
}

// 버튼 컴포넌트 타입 정의
export interface ButtonProps {
  children: string;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
}
