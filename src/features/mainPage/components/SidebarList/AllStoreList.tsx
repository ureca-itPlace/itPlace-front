import React from 'react';
import { Platform } from '../../types';
import { TbChevronDown, TbCheck } from 'react-icons/tb';

interface AllStoreListProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
}

const AllStoreList: React.FC<AllStoreListProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <h3 className="text-lg font-bold text-grey06 mb-4 px-4">구미시 도량동</h3>

      <div>
        {/* 첫 번째 항목 상단 구분선 */}
        <div className="border-b border-grey03" style={{ width: '330px', marginBottom: '16px' }} />

        {platforms.slice(0, 3).map((platform, index) => {
          const isSelected = selectedPlatform?.id === platform.id;

          return (
            <div key={platform.id}>
              <div
                className={`p-4 cursor-pointer transition-colors duration-200 ${
                  isSelected ? 'bg-grey01 rounded-lg' : 'bg-white'
                }`}
                onClick={() => onPlatformSelect(platform)}
              >
                {/* 상단 헤더 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-grey06">
                      투썸플레이스 대구도남위니드..
                    </div>
                    <div className="ml-2 text-xs text-grey04">베이커리</div>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">H</span>
                  </div>
                </div>

                {/* 거리 정보 */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">14km</span>
                  <span className="text-sm text-grey04">경북 구미시 도봉로 76-61</span>
                  <TbChevronDown size={16} className="text-grey04" />
                </div>

                {/* 혜택 내용 */}
                <div className={`space-y-2 rounded-lg p-3 ${isSelected ? 'bg-white' : ''}`}>
                  <div className="text-sm font-medium text-grey05 mb-2">혜택 내용</div>

                  <div className="flex items-center gap-2">
                    <TbCheck size={14} className="text-grey04" />
                    <span className="text-sm text-grey05">VIP콕</span>
                    <span className="text-sm text-grey04">-</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TbCheck size={14} className="text-grey04" />
                    <span className="text-sm text-grey05">VVIP</span>
                    <span className="text-sm text-grey04">1잔당 150원 할인</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TbCheck size={14} className="text-grey04" />
                    <span className="text-sm text-grey05">VIP</span>
                    <span className="text-sm text-grey04">1잔당 100원 할인</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TbCheck size={14} className="text-orange-400" />
                    <span className="text-sm text-orange-400 font-medium">우수</span>
                    <span className="text-sm text-orange-400 font-medium">1잔당 50원 할인</span>
                  </div>
                </div>
              </div>

              {/* 구분선 (마지막 항목 제외) */}
              {index < platforms.slice(0, 3).length - 1 && (
                <div
                  className="border-b border-grey03"
                  style={{
                    width: '330px',
                    marginTop: isSelected ? '16px' : '16px',
                    marginBottom: '16px',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllStoreList;
