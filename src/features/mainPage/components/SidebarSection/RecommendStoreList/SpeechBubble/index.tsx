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
    <div className="relative">
      {/* 말풍선 본체 */}
      <div className="bg-white border-2 border-purple04 rounded-[20px] px-5 py-4 relative">
        {/* 제목과 닫기 버튼 */}
        <div className="flex justify-between items-start mb-2">
          <p className="text-body-3 text-black font-bold flex-1 pr-2 whitespace-nowrap">
            잇플AI는 다음과 같은 이유로{' '}
            <span className="text-purple04 font-bold">{partnerName}</span>를 추천드려요!
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="text-grey04 hover:text-grey06 transition-colors flex-shrink-0"
            >
              <TbX size={16} />
            </button>
          )}
        </div>

        {/* 메시지 텍스트 */}
        <p className="text-body-3 text-black pr-2 max-w-[330px]">{message}</p>
      </div>

      {/* 말풍선 꼬리 - 회전된 사각형 */}
      <div className="absolute bottom-[-6px] left-10">
        <div
          className="w-3 h-3 bg-white border-l-2 border-b-2 border-purple04"
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
