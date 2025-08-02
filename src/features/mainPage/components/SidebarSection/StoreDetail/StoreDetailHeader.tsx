import React from 'react';
import { TbX } from 'react-icons/tb';
import { Platform } from '../../../types';

interface StoreDetailHeaderProps {
  platform: Platform;
  onClose: () => void;
}

const StoreDetailHeader: React.FC<StoreDetailHeaderProps> = ({ platform, onClose }) => {
  return (
    <>
      <div className="flex justify-end mb-3 max-md:mb-2">
        <button
          onClick={onClose}
          className="text-grey04 hover:text-grey06 p-2 -m-2 relative z-10 transition-colors"
        >
          <TbX size={24} className="max-md:w-5 max-md:h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center mb-4 bg-grey01 py-3 rounded-[10px] max-md:mb-3 max-md:py-2">
        <div className="w-[100px] h-[100px] mb-2 bg-white rounded-[10px] flex items-center justify-center overflow-hidden max-xl:w-[60px] max-xl:h-[60px] max-md:w-[80px] max-md:h-[80px] max-xl:mb-1.5">
          {platform.imageUrl ? (
            <img src={platform.imageUrl} alt="로고" className="w-full h-full object-contain " />
          ) : (
            <span className="text-purple04 text-title-5 max-md:text-title-6">
              {platform.name.charAt(0)}
            </span>
          )}
        </div>
        <h2 className="text-title-5 text-grey06 mt-3 max-xl:text-title-6 max-md:mt-2">
          {platform.name}
        </h2>
      </div>
    </>
  );
};

export default StoreDetailHeader;
