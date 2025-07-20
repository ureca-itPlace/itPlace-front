import React, { useState } from 'react';
import { Platform } from '../../types';
import SearchSection from './SearchSection';
import InfoBanner from './InfoBanner';
import CategoryTabs from './CategoryTabs';
import FavoriteStoreList from './List/FavoriteStoreList';
import AllStoreList from './List/AllStoreList';
import { Tab, Store } from './types';

interface SidebarListProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  isLoading?: boolean;
  currentLocation?: string;
  error?: string | null;
}

const SidebarList: React.FC<SidebarListProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  isLoading = false,
  currentLocation = '위치 정보 없음',
  error = null,
}) => {
  const [activeTab, setActiveTab] = useState('nearby');

  const mainTabs: Tab[] = [
    { id: 'nearby', label: '주변 혜택' },
    { id: 'favorites', label: '찜한 혜택' },
    { id: 'ai', label: '잇플AI 추천' },
  ];

  const mockStores: Store[] = [
    { id: '1', name: '파리바게뜨', category: '베이커리' },
    { id: '2', name: '스카이라운지', category: '카페' },
    { id: '3', name: '오가네 파프리카의 점검', category: '음식점' },
    { id: '4', name: 'GS THE FRESH', category: '편의점' },
    { id: '5', name: 'GS25', category: '편의점' },
  ];

  const handleSearchChange = (query: string) => {
    console.log('Search query:', query);
  };

  const handleStoreClick = (store: Store) => {
    console.log('Store clicked:', store);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-grey03">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-[370px] h-full bg-white flex flex-col">
      {/* Content Wrapper - 330x860 with 15px top/bottom, 20px left/right margins */}
      <div className="flex flex-col mx-5 mt-[15px] mb-[18px] w-[330px] flex-1 min-h-0">
        {/* 검색 영역 */}
        <div className="pb-8 flex-shrink-0">
          <SearchSection onSearchChange={handleSearchChange} />

          <div className="mb-4">
            <CategoryTabs tabs={mainTabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {activeTab === 'nearby' && <InfoBanner message="근처 제휴처만 안내해드릴게요 !" />}

          {activeTab === 'favorites' && <InfoBanner message="잇플픽이 찜한 혜택을 보여드릴게요!" />}
        </div>

        {/* 컨텐츠 영역 - 탭에 따라 다른 컴포넌트 렌더링 */}
        {activeTab === 'nearby' && (
          <AllStoreList
            platforms={platforms}
            selectedPlatform={selectedPlatform}
            onPlatformSelect={onPlatformSelect}
            currentLocation={currentLocation}
            isLoading={isLoading}
            error={error}
          />
        )}

        {activeTab === 'favorites' && (
          <>
            {/* 카테고리 탭들 */}
            <div className="flex gap-2 py-4 border-b border-grey02">
              <CategoryTabs
                tabs={[
                  { id: 'all', label: '전체' },
                  { id: 'entertainment', label: '엔터테인먼트' },
                  { id: 'beauty', label: '뷰티/건강' },
                ]}
                activeTab="all"
                onTabChange={() => {}}
              />
            </div>

            {/* 즐겨찾기 스토어 리스트 */}
            <div className="flex-1 overflow-y-auto pt-4">
              <FavoriteStoreList stores={mockStores} onStoreClick={handleStoreClick} />
            </div>
          </>
        )}

        {activeTab === 'ai' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-grey04 text-center">
              <div className="text-lg mb-2">🤖</div>
              <div>AI 추천 기능 준비중입니다</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarList;
