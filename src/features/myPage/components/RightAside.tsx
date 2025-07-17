import { ReactNode, useState } from 'react';

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

  return (
    <aside className="w-[476px] bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] px-[40px] flex flex-col">
      {/* 위쪽 내용 */}
      <div className="flex-1">{children}</div>

      {/* 아래쪽 토끼 이미지 영역 */}
      {imgSrc && (
        <div className="mt-auto flex justify-center mb-[-30px]">
          <img
            src={imgSrc}
            alt={bottomImageAlt ?? '하단 이미지'}
            className="w-[310px] h-auto object-contain"
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
