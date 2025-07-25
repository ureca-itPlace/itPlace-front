import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface MainContentWrapperProps {
  children: ReactNode;
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { pathname } = useLocation();

  const isSimpleLayout =
    pathname.startsWith('/mypage/favorites') || pathname.startsWith('/mypage/history');

  const className =
    'flex flex-1 flex-col h-full bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] pl-[56px] pr-[56px] max-xl:pt-[56px] max-xl:pb-[40px] ' +
    (isSimpleLayout
      ? // ✨ favorites / history 전용: 그림자, radius 제거 + 패딩 제거
        'max-md:rounded-none max-md:drop-shadow-none max-md:px-6 max-md:pb-6'
      : // ✨ 나머지 (회원정보): radius, 그림자 유지 + 모바일 패딩
        'max-md:p-6');

  return <main className={className}>{children}</main>;
}
