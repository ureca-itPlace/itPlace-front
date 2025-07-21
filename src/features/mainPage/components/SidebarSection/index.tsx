import React, { useState, useEffect } from 'react';
import { Platform } from '../../types';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import SearchSection from '../SidebarSection/AllBenefit/SearchSection';
import InfoBannerSection from '../SidebarSection/AllBenefit/InfoBannerSection';
import NavigationTabsSection from '../SidebarSection/AllBenefit/NavigationTabsSection';
import StoreCardsSection from '../SidebarSection/AllBenefit/StoreCardsSection';
import FavoriteStoreList from '../SidebarSection/AllBenefit/FavoriteStoreList';
import StoreDetailCard from './StoreDetail';

interface Tab {
  id: string;
  label: string;
}

interface Store {
  id: string;
  name: string;
  category: string;
}

interface SidebarSectionProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform | null) => void;
  currentLocation: string;
  isLoading: boolean;
  error?: string | null;
  onSearchChange?: (query: string) => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  currentLocation,
  isLoading,
  error,
  onSearchChange,
}) => {
  const [activeTab, setActiveTab] = useState('nearby');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // 카드 클릭 시 상세보기로 전환
  const handleCardClick = (platform: Platform) => {
    onPlatformSelect(platform);
    setViewMode('detail');
  };

  // 상세보기에서 닫기
  const handleDetailClose = () => {
    setViewMode('list');
    onPlatformSelect(null); // selectedPlatform 초기화
  };

  // 외부에서 플랫폼 선택 시 (맵 마커 클릭 등) 상세보기로 전환
  useEffect(() => {
    if (selectedPlatform && viewMode === 'list') {
      setViewMode('detail');
    }
  }, [selectedPlatform, viewMode]);

  const mainTabs: Tab[] = [
    { id: 'nearby', label: '주변 혜택' },
    { id: 'favorites', label: '찜한 혜택' },
    { id: 'ai', label: '잇플AI 추천' },
  ];

  // Mock stores for favorites tab (기존 SidebarList에서 가져옴)
  const mockStores: Store[] = [
    { id: '1', name: '파리바게뜨', category: '베이커리' },
    { id: '2', name: '스카이라운지', category: '카페' },
    { id: '3', name: '오가네 파프리카의 점검', category: '음식점' },
    { id: '4', name: 'GS THE FRESH', category: '편의점' },
    { id: '5', name: 'GS25', category: '편의점' },
  ];

  const handleSearchChange = (query: string) => {
    onSearchChange?.(query);
  };

  const handleStoreClick = (store: Store) => {
    console.log('Store clicked:', store);
  };

  // 탭별 다른 InfoBanner 메시지
  const getInfoBannerMessage = () => {
    switch (activeTab) {
      case 'nearby':
        return '근처 제휴처만 안내해드릴게요 !';
      case 'favorites':
        return '잇플픽이 찜한 혜택을 보여드릴게요!';
      case 'ai':
        return 'AI가 추천하는 맞춤 혜택입니다!';
      default:
        return '근처 제휴처만 안내해드릴게요 !';
    }
  };

  if (isLoading && activeTab === 'nearby') {
    return (
      <div className="bg-white flex flex-col overflow-hidden w-full h-full rounded-[18px] drop-shadow-basic">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <LoadingSpinner />
          <div className="mt-4 text-grey04 text-sm">주변 가맹점을 찾는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col overflow-hidden w-full h-full rounded-[18px] drop-shadow-basic">
      {viewMode === 'list' ? (
        // 리스트 모드: 기존 UI
        <div className="flex flex-col mx-5 mt-[15px] mb-[18px] w-[330px] flex-1 min-h-0">
          {/* 검색 영역 */}
          <div className="pb-8 flex-shrink-0">
            <SearchSection onSearchChange={handleSearchChange} />

            <div className="mb-4">
              <NavigationTabsSection
                tabs={mainTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            <InfoBannerSection message={getInfoBannerMessage()} variant="primary" />
          </div>

          {/* 컨텐츠 영역 - 탭에 따라 다른 컴포넌트 렌더링 */}
          {activeTab === 'nearby' && (
            <StoreCardsSection
              platforms={platforms}
              selectedPlatform={selectedPlatform}
              onPlatformSelect={handleCardClick}
              currentLocation={currentLocation}
              isLoading={isLoading}
              error={error}
            />
          )}

          {activeTab === 'favorites' && (
            <>
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
      ) : (
        // 상세 모드: StoreDetailCard만 전체 화면으로
        <div className="h-full overflow-y-auto">
          {selectedPlatform && (
            <StoreDetailCard platform={selectedPlatform} onClose={handleDetailClose} />
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarSection;
