import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface RightAsideProps {
  children: ReactNode;
  bottomImage?: string; // 기본 이미지 (webp)
  bottomImageAlt?: string;
  bottomImageFallback?: string; // 로드 실패 시 대체 이미지 (png)
}

export default function RightAside({
  children,
  bottomImage,
  bottomImageAlt,
  bottomImageFallback,
}: RightAsideProps) {
  const [imgSrc, setImgSrc] = useState(bottomImage); // 현재 이미지 소스

  const { pathname } = useLocation();

  // ✅ 모바일 레이아웃을 위한 조건분기
  const isSimpleLayout =
    pathname.startsWith('/mypage/favorites') || pathname.startsWith('/mypage/history');

  return (
    <aside
      className={
        'w-full max-w-[476px] min-w-[400px] bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] px-[40px] flex flex-col max-xl:max-w-[390px] max-xl:min-w-[320px] max-xl:pt-[56px] max-xlg:max-w-none max-xlg:w-full max-xlg:min-w-[240px] max-xlg:pt-[36px] max-xlg:pb-[32px] max-xlg:px-[28px] max-md:w-full max-md:p-6 ' +
        (isSimpleLayout ? ' max-md:hidden' : '')
      }
    >
      {/* 위쪽 내용 */}
      <div className="flex-1">{children}</div>

      {/* 아래쪽 토끼 이미지 영역 */}
      {imgSrc && (
        <div className="mt-auto flex justify-center mb-[-30px] max-xlg:hidden">
          <img
            src={imgSrc}
            alt={bottomImageAlt ?? '하단 이미지'}
            className="w-[310px] h-auto object-contain max-xl:w-[230px]"
            onError={() => {
              // webp 로드 실패 시 fallback으로 교체
              if (bottomImageFallback) {
                setImgSrc(bottomImageFallback);
              }
            }}
          />
        </div>
      )}
    </aside>
  );
}
