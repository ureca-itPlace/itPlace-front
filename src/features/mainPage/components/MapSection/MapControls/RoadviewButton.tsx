import React from 'react';
import { TbCameraUp } from 'react-icons/tb';

interface RoadviewButtonProps {
  isRoadviewMode: boolean;
  onToggle: () => void;
}

const RoadviewButton: React.FC<RoadviewButtonProps> = ({ isRoadviewMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center justify-center w-12 h-12 max-md:w-10 max-md:h-10 rounded-lg transition-colors duration-200 shadow-lg
        ${
          isRoadviewMode
            ? 'bg-purple03 text-white hover:bg-purple04'
            : 'bg-white text-grey04 hover:bg-grey01 border-2 border-grey02'
        }
      `}
      aria-label={isRoadviewMode ? '로드뷰 끄기' : '로드뷰 켜기'}
    >
      <TbCameraUp size={24} className="max-md:w-5 max-md:h-5" />
    </button>
  );
};

export default RoadviewButton;
