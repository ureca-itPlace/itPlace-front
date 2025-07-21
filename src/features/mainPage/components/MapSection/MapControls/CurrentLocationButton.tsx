import React from 'react';

interface CurrentLocationButtonProps {
  onLocationMove: (latitude: number, longitude: number) => void;
  onMapCenterMove?: (latitude: number, longitude: number) => void;
}

const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onLocationMove,
  onMapCenterMove,
}) => {
  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          onLocationMove(location.latitude, location.longitude);
          onMapCenterMove?.(location.latitude, location.longitude);
        },
        () => {
          alert('현재 위치를 가져올 수 없습니다.');
        }
      );
    } else {
      alert('브라우저에서 위치 서비스를 지원하지 않습니다.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white border-2 border-gray-200 w-12 h-12 rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-600" fill="currentColor">
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    </button>
  );
};

export default CurrentLocationButton;
