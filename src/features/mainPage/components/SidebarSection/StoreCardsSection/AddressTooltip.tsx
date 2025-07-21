import React from 'react';
import { TbX } from 'react-icons/tb';

interface AddressTooltipProps {
  roadAddress: string;
  lotAddress: string;
  onCopy: (text: string) => void;
  onClose: () => void;
}

const AddressTooltip: React.FC<AddressTooltipProps> = ({
  roadAddress,
  lotAddress,
  onCopy,
  onClose,
}) => {
  return (
    <div className="bg-white border border-grey02 rounded-lg shadow-lg p-3 w-max relative">
      {/* X 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-grey04 hover:text-grey05 transition-colors"
      >
        <TbX size={14} />
      </button>

      <div className="flex flex-col gap-1 pr-4">
        {/* 도로명 주소 */}
        <div className="flex items-center gap-2">
          <span className="text-body-5  border border-grey03 p-[2px] text-grey04 whitespace-nowrap">
            도로명
          </span>
          <span className="text-body-4 text-grey05 whitespace-nowrap">{roadAddress}</span>

          <span
            className="text-body-4 text-purple04 cursor-pointer"
            onClick={() => onCopy(roadAddress)}
          >
            복사
          </span>
        </div>

        {/* 지번 주소 */}
        <div className="flex items-center gap-2">
          <span className="text-body-5  border border-grey03 p-[2px] text-grey04 whitespace-nowrap">
            지번
          </span>
          <span className="text-body-4 text-grey05 whitespace-nowrap">{lotAddress}</span>

          <span
            className="text-body-4 text-purple04 cursor-pointer"
            onClick={() => onCopy(lotAddress)}
          >
            복사
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddressTooltip;
