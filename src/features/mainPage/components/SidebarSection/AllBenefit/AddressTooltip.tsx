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
    <div
      className="bg-white border border-grey02 rounded-lg shadow-[0 2px 5px black 0.15] p-3 w-max relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* X 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-2 right-2 text-grey04 hover:text-grey05 transition-colors"
      >
        <TbX size={14} />
      </button>

      <div className="space-y-1 pr-4">
        {/* 도로명 주소 */}
        <div className="grid grid-cols-[50px_1fr_30px] gap-3 items-center">
          <span className="text-body-5 border border-grey03 px-1 py-[2px] text-grey04 text-center">
            도로명
          </span>
          <span className="text-body-4 text-grey05 truncate">{roadAddress}</span>
          <span
            className="text-body-4 text-purple04 cursor-pointer hover:text-purple05 transition-colors self-center"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(roadAddress);
            }}
          >
            복사
          </span>
        </div>

        {/* 지번 주소 */}
        <div className="grid grid-cols-[50px_1fr_30px] gap-3 items-center">
          <span className="text-body-5 border border-grey03 px-1 py-[2px] text-grey04 text-center">
            지번
          </span>
          <span className="text-body-4 text-grey05 truncate">{lotAddress}</span>
          <span
            className="text-body-4 text-purple04 cursor-pointer hover:text-purple05 transition-colors self-center"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(lotAddress);
            }}
          >
            복사
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddressTooltip;
