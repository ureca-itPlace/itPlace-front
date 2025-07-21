import React from 'react';

interface CustomMarkerProps {
  imageUrl?: string;
  name?: string;
  isSelected?: boolean;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ imageUrl, name, isSelected = false }) => {
  return (
    <div className="relative">
      {/* 상자 부분 */}
      <div
        className={`w-[68px] h-[68px] rounded-[12px] bg-white flex items-center justify-center relative z-10 ${
          isSelected ? 'ring-2 ring-purple04' : ''
        }`}
        style={{
          boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.35)',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || '가맹점'}
            className="w-[50px] h-[50px] object-contain rounded-lg"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-grey02 rounded-lg flex items-center justify-center">
            <span className="text-grey04 text-xs font-bold">{name ? name.charAt(0) : '?'}</span>
          </div>
        )}
      </div>

      {/* 삼각형 부분 */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 z-0"
        style={{
          top: '60px',
          width: 0,
          height: 0,
          borderLeft: '8.5px solid transparent',
          borderRight: '8.5px solid transparent',
          borderTop: '15px solid white',
          filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.35))',
        }}
      />
    </div>
  );
};

export default CustomMarker;
