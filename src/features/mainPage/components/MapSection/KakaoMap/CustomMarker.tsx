import React from 'react';

interface CustomMarkerProps {
  imageUrl?: string;
  name?: string;
  isSelected?: boolean;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ imageUrl, name, isSelected = false }) => {
  return (
    <div
      className="relative cursor-pointer"
      style={{
        width: '68px',
        height: '84px', // 68px + 삼각형 높이 16px
        filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.35))',
      }}
    >
      {/* 말풍선 SVG */}
      <svg
        width="68"
        height="84"
        viewBox="0 0 68 84"
        className={`${isSelected ? 'ring-2 ring-purple04 rounded-[12px]' : ''}`}
      >
        {/* 말풍선 몸체 (둥근 사각형) */}
        <rect x="0" y="0" width="68" height="68" rx="12" ry="12" fill="white" />
        {/* 말풍선 꼬리 (삼각형) */}
        <polygon points="27,68 34,78 41,68" fill="white" />
      </svg>

      {/* 로고 이미지 */}
      <div className="absolute top-0 left-0 w-[68px] h-[68px] flex items-center justify-center z-10">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || '가맹점'}
            className="w-[50px] h-[50px] object-contain rounded-lg"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-grey02 rounded-lg flex items-center justify-center">
            <span className="text-grey04 text-sm font-bold">{name ? name.charAt(0) : '?'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMarker;
