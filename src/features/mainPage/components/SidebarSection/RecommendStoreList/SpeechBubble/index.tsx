import React from 'react';

interface SpeechBubbleProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="relative">
      {/* 말풍선 본체 */}
      <div className="bg-white rounded-[20px] px-5 py-4 max-w-[320px] min-w-[240px] border-2 border-purple04 relative">
        {/* 닫기 버튼 (선택사항) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-grey04 hover:text-grey06 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* 메시지 텍스트 */}
        <p className="text-body-3 text-grey06 leading-relaxed pr-8">{message}</p>

        {/* 말풍선 꼬리 (아래쪽 왼쪽) */}
        <div className="absolute top-full left-8">
          {/* 테두리 꼬리 */}
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-purple04"></div>
          {/* 내부 흰색 꼬리 */}
          <div className="absolute top-[-10px] left-[2px] w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      </div>
    </div>
  );
};

export default SpeechBubble;
