import React from 'react';
import { TbCurrentLocation } from 'react-icons/tb';

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
      className="bg-white border-2 border-gray-200 w-12 h-12 rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center max-md:w-10 max-md:h-10"
    >
      <TbCurrentLocation size={24} className="text-gray-600 max-md:w-5 max-md:h-5" />
    </button>
  );
};

export default CurrentLocationButton;
