import React from 'react';

interface CustomMarkerProps {
  imageUrl?: string;
  name?: string;
  isSelected?: boolean;
  distance?: number; // 거리 추가 (미터 단위)
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  imageUrl,
  name,
  isSelected = false,
  distance,
}) => {
  // 거리에 따른 크기 계산 (기본 68px에서 거리에 따라 조절)
  const getScaleByDistance = (dist?: number) => {
    if (!dist) return 1;
    // 0-0.1km: 1.2배, 0.1-0.2km: 1.0배, 0.2km+: 0.8배
    if (dist <= 0.1) return 1.2;
    if (dist <= 0.2) return 1.0;
    if (dist <= 0.3) return 0.8;
    if (dist <= 0.4) return 0.6;
    if (dist <= 0.5) return 0.4;
    return 0.8;
  };

  const scale = getScaleByDistance(distance);
  const baseWidth = 68;
  const baseHeight = 84;
  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;

  return (
    <div
      className="relative cursor-pointer"
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        zIndex: isSelected ? 1000 : 1,
        animation: isSelected ? 'bounceScale 2s ease-in-out infinite' : 'none',
        transformOrigin: 'center bottom',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* 인라인 스타일로 키프레임 정의 */}
      {isSelected && (
        <style>
          {`
            @keyframes bounceScale {
              0%, 100% { transform: scale(1.2) translateY(0px); }
              50% { transform: scale(1.2) translateY(-8px); }
            }
          `}
        </style>
      )}

      {/* ✅ filter 전용 래퍼 */}
      <div
        className="w-full h-full"
        style={{
          filter: isSelected
            ? 'drop-shadow(0px 0px 12px rgba(255, 160, 35, 0.9))'
            : 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.35))',
        }}
      >
        {/* 말풍선 SVG - 크기 조절됨 */}
        <svg width={scaledWidth} height={scaledHeight} viewBox="0 0 68 84">
          <rect x="0" y="0" width="68" height="68" rx="12" ry="12" fill="white" />
          <polygon points="27,68 34,78 41,68" fill="white" />
        </svg>

        {/* 로고 이미지 - 크기 조절됨 */}
        <div
          className="absolute top-0 left-0 flex items-center justify-center z-10"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledWidth}px`, // 정사각형 유지
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name || '가맹점'}
              className="object-contain rounded-lg"
              style={{
                width: `${50 * scale}px`,
                height: `${50 * scale}px`,
              }}
            />
          ) : (
            <div
              className="bg-grey02 rounded-lg flex items-center justify-center"
              style={{
                width: `${50 * scale}px`,
                height: `${50 * scale}px`,
              }}
            >
              <span className="text-grey04 font-bold" style={{ fontSize: `${14 * scale}px` }}>
                {name ? name.charAt(0) : '?'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ✅ 선택된 경우 별 이미지 (filter 적용 안됨) - 크기 조절됨 */}
      {isSelected && (
        <img
          src="/images/star.png"
          alt="맵 마커"
          className="absolute -left-2 -top-1 -translate-y-1/2"
          style={{
            width: `${56 * scale}px`,
          }}
        />
      )}
    </div>
  );
};

export default CustomMarker;
