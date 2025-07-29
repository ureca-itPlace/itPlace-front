import React from 'react';
import { TbX } from 'react-icons/tb';

interface SpeechBubbleProps {
  message: string;
  partnerName: string;
  isVisible: boolean;
  onClose?: () => void;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  partnerName,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="relative animate-floating ">
      {/* 말풍선 본체 */}
      <div className="bg-white drop-shadow-basic border-2 border-purple01 rounded-[12px] w-[420px] max-md:w-[280px] px-5 py-4 relative max-md:px-3 max-md:py-3 max-md:rounded-[15px]">
        {/* 제목과 닫기 버튼 */}
        <div className="flex justify-between items-start mb-2 max-md:mb-1.5">
          <p className="text-body-2 text-black font-semibold flex-1 pr-2 max-md:text-body-3 max-md:whitespace-normal max-md:pr-1">
            잇플AI가 회원님의 클릭, 검색, 혜택 사용 이력을 분석해 가장 알맞은{' '}
            <span className="text-purple04 font-bold">{partnerName}</span>를 추천드려요🐰
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="text-grey04 hover:text-grey06 transition-colors flex-shrink-0"
            >
              <TbX size={16} className="max-md:w-4 max-md:h-4" />
            </button>
          )}
        </div>

        {/* 메시지 텍스트 */}
        <p className="text-body-3 text-black pr-2 font-light max-md:text-body-4 max-md:pr-1">
          {message}
        </p>
      </div>

      {/* 말풍선 꼬리 - 회전된 사각형 */}
      <div className="absolute bottom-[-6px] left-5 max-md:left-3">
        <div
          className="w-3 h-3 bg-white border-l-2 border-b-2 border-purple01"
          style={{
            transform: 'rotate(-45deg)',
            transformOrigin: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default SpeechBubble;
