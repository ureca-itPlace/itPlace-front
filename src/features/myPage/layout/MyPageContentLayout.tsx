// src/features/myPage/layout/MyPageContentLayout.tsx
import { ReactNode } from 'react';
import MainContentWrapper from '../components/MainContentWrapper';
import RightAside from '../components/RightAside';

interface MyPageContentLayoutProps {
  /** MainContentWrapper 안쪽에 렌더링할 메인 컨텐츠 */
  main: ReactNode;
  /** RightAside 안쪽에 렌더링할 우측 컨텐츠 */
  aside: ReactNode;
  /** RightAside의 하단 이미지들 */
  bottomImage?: string;
  bottomImageAlt?: string;
  bottomImageFallback?: string;
}

export default function MyPageContentLayout({
  main,
  aside,
  bottomImage,
  bottomImageAlt,
  bottomImageFallback,
}: MyPageContentLayoutProps) {
  return (
    <>
      <MainContentWrapper>{main}</MainContentWrapper>
      <RightAside
        bottomImage={bottomImage}
        bottomImageAlt={bottomImageAlt}
        bottomImageFallback={bottomImageFallback}
      >
        {aside}
      </RightAside>
    </>
  );
}
