import React from 'react';
import { Platform } from '../../../types';
import { TbChevronDown, TbCheck } from 'react-icons/tb';

interface AllStoreListProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  currentLocation: string;
  isLoading: boolean;
  error?: string | null;
}

const AllStoreList: React.FC<AllStoreListProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  currentLocation,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-grey03">주변 가맹점을 찾고 있습니다...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-red-500 text-center mb-2">오류 발생</div>
        <div className="text-grey04 text-sm text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <h3 className="text-lg font-bold text-grey06 mb-4">{currentLocation}</h3>

      {/* 현재 위치 아래 구분선 */}
      <div className="border-b border-grey03 w-[330px] mb-0" />

      <div
        className="-mx-5 overflow-y-auto overflow-x-hidden"
        style={{ height: 'calc(100vh - 360px)' }}
      >
        {platforms.map((platform, index) => {
          const isSelected = selectedPlatform?.id === platform.id;

          return (
            <div key={platform.id}>
              <div
                className={`cursor-pointer transition-colors duration-200 w-[370px] px-5 ${
                  isSelected ? 'bg-grey01' : 'bg-white'
                }`}
                onClick={() => onPlatformSelect(platform)}
              >
                <div className="py-4">
                  {/* 상단부: 가맹점 정보 + 로고 */}
                  <div className="flex justify-between items-start mb-4">
                    {/* 왼쪽: 가맹점 정보 2줄 */}
                    <div className="flex flex-col">
                      {/* 1줄: 가맹점명 + 카테고리 */}
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-title-7 font-bold text-grey06">{platform.name}</span>
                        <span className="text-body-5 text-grey04">{platform.category}</span>
                      </div>
                      {/* 2줄: 거리 + 주소 */}
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-body-3-bold text-black">{platform.distance}km</span>
                        <span className="text-body-3 text-grey04 truncate w-[20ch]">
                          {platform.address}
                        </span>
                        <TbChevronDown size={16} className="text-grey04" />
                      </div>
                    </div>

                    {/* 오른쪽: 브랜드 로고 */}
                    <div className="w-[45px] h-[45px] flex items-center justify-center flex-shrink-0">
                      {platform.imageUrl ? (
                        <img
                          src={platform.imageUrl}
                          alt={`${platform.name} 로고`}
                          className="w-full h-full object-contain rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-red-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {platform.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 하단부: 혜택 내용 박스 */}
                  <div
                    className={`rounded-[10px] p-3 w-[330px] ${isSelected ? 'bg-white' : 'bg-grey01'}`}
                  >
                    <div className="text-body-3-bold text-grey05 mb-2">혜택 내용</div>

                    <div className="space-y-1">
                      {platform.benefits.length > 0 ? (
                        platform.benefits.map((benefit, benefitIndex) => {
                          const [grade, content] = benefit.split(': ');
                          return (
                            <div key={benefitIndex} className="grid grid-cols-[20px_60px_1fr] gap-2 items-center">
                              <TbCheck size={16} className="text-grey04" />
                              <span className="text-body-4 text-grey05">{grade}:</span>
                              <span className="text-body-4 text-grey05 truncate">{content}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="grid grid-cols-[20px_60px_1fr] gap-2 items-center">
                          <TbCheck size={16} className="text-grey04" />
                          <span className="text-body-4 text-grey05">혜택 정보가</span>
                          <span className="text-body-4 text-grey05">없습니다</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 구분선 (마지막 항목 제외) */}
              {index < platforms.length - 1 && (
                <div className="border-b border-grey03 mx-5 w-[330px]" />
              )}
            </div>
          );
        })}

        {/* 마지막 카드 아래 여백 */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default AllStoreList;
