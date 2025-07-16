import { ReactNode } from 'react';

interface RightAsideProps {
  children: ReactNode;
  bottomImage?: string;
  bottomImageAlt?: string;
}

export default function RightAside({ children, bottomImage, bottomImageAlt }: RightAsideProps) {
  return (
    <aside className="w-[476px] bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] px-[40px] flex flex-col">
      {/* 위쪽 내용 */}
      <div className="flex-1">{children}</div>

      {/* 아래쪽 토끼 이미지 영역 */}
      {bottomImage && (
        <div className="mt-auto flex justify-center mb-[-30px]">
          <img
            src={bottomImage}
            alt={bottomImageAlt ?? '하단 이미지'}
            className="w-[310px] h-auto object-contain"
          />
        </div>
      )}
    </aside>
  );
}
