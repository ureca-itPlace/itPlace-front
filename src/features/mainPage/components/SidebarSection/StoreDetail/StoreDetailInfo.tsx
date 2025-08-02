import React from 'react';
import { TbMapPin, TbWorld } from 'react-icons/tb';

interface StoreDetailInfoProps {
  url?: string;
  roadAddress?: string;
  address?: string;
  postCode?: string;
}

const StoreDetailInfo: React.FC<StoreDetailInfoProps> = ({
  url,
  roadAddress,
  address,
  postCode,
}) => {
  return (
    <div className="flex flex-col gap-3 text-body-3 text-grey05 mb-5 max-xl:gap-2 max-xl:text-body-4 max-xl:mb-4">
      {roadAddress && (
        <div className="flex items-start gap-2 max-xl:gap-1.5">
          <TbMapPin size={16} className="mt-[2px] flex-shrink-0 max-md:w-4 max-md:h-4" />
          <div className="flex flex-col min-w-0">
            <span className="text-grey06 max-md:text-body-5">{roadAddress}</span>
            <div className="flex gap-14 mt-1 max-md:gap-8 max-md:mt-0.5 max-md:mb-1">
              {postCode && (
                <span className="text-grey05 text-body-4 max-md:text-body-6">(우) {postCode}</span>
              )}
              {address && (
                <span className="text-grey05 text-body-4 max-md:text-body-6">(지) {address}</span>
              )}
            </div>
          </div>
        </div>
      )}
      {url && (
        <div className="flex items-center gap-2 max-md:gap-1.5">
          <TbWorld size={16} className="max-md:w-4 max-md:h-4" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-grey05 hover:text-purple04 truncate w-[35ch] duration-300 max-md:w-[25ch] max-md:text-body-5"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
};

export default StoreDetailInfo;
