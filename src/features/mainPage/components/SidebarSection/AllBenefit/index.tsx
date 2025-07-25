import React from 'react';
import { Platform } from '../../../types';
import StoreCard from './StoreCard';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import NoResult from '../../../../../components/NoResult';

interface StoreCardsSectionProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  currentLocation: string;
  isLoading: boolean;
  error?: string | null;
}

const StoreCardsSection: React.FC<StoreCardsSectionProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  currentLocation,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="px-5 max-md:px-4 max-sm:px-3">
          <h3 className="text-lg font-bold text-grey06 mb-4 max-md:text-base max-md:mb-3 max-sm:text-sm max-sm:mb-2">
            주변 가맹점을 찾고 있습니다...
          </h3>
          <div className="border-b border-grey03 w-full mb-0" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <div className="mt-4 text-grey04 text-sm max-md:text-xs max-md:mt-3 max-sm:text-xs max-sm:mt-2">
            가맹점 데이터를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <NoResult
          message1="오류가 발생했어요!"
          message2="잠시 후 다시 시도해 주세요"
          message1FontSize="text-title-6"
          message2FontSize="text-body-3"
          isLoginRequired={false}
        />
      </div>
    );
  }

  // 검색 결과가 없을 경우
  if (!platforms || platforms.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="px-5 max-md:px-4 max-sm:px-3">
          <h3 className="text-lg font-bold text-grey06 mb-4 max-md:text-base max-md:mb-3 max-sm:text-sm max-sm:mb-2">
            {currentLocation}
          </h3>
          <div className="border-b border-grey03 w-full mb-0" />
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <NoResult
            message1="검색 결과가 없어요!"
            message2="다른 키워드나 지역에서 검색해보세요!"
            message1FontSize="text-title-6"
            message2FontSize="text-body-3"
            isLoginRequired={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 max-md:px-4 max-sm:px-3">
        <h3 className="text-lg font-bold text-grey06 mb-4 max-md:text-base max-md:mb-3 max-sm:text-sm max-sm:mb-2">
          {currentLocation}
        </h3>

        {/* 현재 위치 아래 구분선 */}
        <div className="border-b border-grey03 w-full mb-0" />
      </div>

      <div
        className="overflow-y-auto overflow-x-hidden max-md:px-4 max-sm:px-3"
        style={{ height: 'calc(100vh - 360px)' }}
      >
        {platforms.map((platform, index) => (
          <div key={platform.id}>
            <StoreCard
              platform={platform}
              isSelected={selectedPlatform?.id === platform.id}
              onSelect={onPlatformSelect}
            />

            {/* 구분선 (마지막 항목 제외) */}
            {index < platforms.length - 1 && (
              <div className="border-b border-grey03 mx-5 max-md:mx-4 max-sm:mx-3" />
            )}
          </div>
        ))}

        {/* 마지막 카드 아래 여백 */}
        <div className="h-2 max-md:h-1 max-sm:h-0.5"></div>
      </div>
    </div>
  );
};

export default StoreCardsSection;
