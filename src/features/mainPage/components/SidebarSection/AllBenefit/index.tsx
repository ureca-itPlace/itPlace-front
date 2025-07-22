import React from 'react';
import { Platform } from '../../../types';
import StoreCard from './StoreCard';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

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
        <h3 className="text-lg font-bold text-grey06 mb-4">주변 가맹점을 찾고 있습니다...</h3>
        <div className="border-b border-grey03 w-[330px] mb-0" />

        <div className="flex-1 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <div className="mt-4 text-grey04 text-sm">가맹점 데이터를 불러오는 중...</div>
        </div>
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
        {platforms.map((platform, index) => (
          <div key={platform.id}>
            <StoreCard
              platform={platform}
              isSelected={selectedPlatform?.id === platform.id}
              onSelect={onPlatformSelect}
            />

            {/* 구분선 (마지막 항목 제외) */}
            {index < platforms.length - 1 && (
              <div className="border-b border-grey03 mx-5 w-[330px]" />
            )}
          </div>
        ))}

        {/* 마지막 카드 아래 여백 */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default StoreCardsSection;
