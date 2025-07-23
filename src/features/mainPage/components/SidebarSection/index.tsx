import React, { useState, useEffect } from 'react';
import { Platform } from '../../types';
import { FavoriteBenefit } from '../../types/api';
import { CATEGORIES } from '../../constants';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import SearchSection from './SearchSection';
import InfoBannerSection from './InfoBannerSection';
import NavigationTabsSection from './NavigationTabsSection';
import StoreCardsSection from './AllBenefit';
import FavoriteStoreList from './FavoriteStoreList';
import StoreDetailCard from './StoreDetail';
import CategoryTabsSection from './CategoryTabsSection';
import { useFavoritesList } from '../../hooks/useFavoritesList';

interface Tab {
  id: string;
  label: string;
}

interface SidebarSectionProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform | null) => void;
  currentLocation: string;
  isLoading: boolean;
  error?: string | null;
  onSearchChange?: (query: string) => void;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  onKeywordSearch?: (keyword: string) => void;
  searchQuery?: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  currentLocation,
  isLoading,
  error,
  onSearchChange,
  activeTab,
  onActiveTabChange,
  onKeywordSearch,
  searchQuery,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 즐겨찾기 데이터 관리 (관심 혜택 탭일 때만 로드)
  const { favorites, isLoading: isFavoritesLoading } = useFavoritesList(
    activeTab === 'favorites' ? selectedCategory : undefined
  );

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

  // 플랫폼 선택이 해제되면 리스트 모드로 돌아가기
  useEffect(() => {
    if (!selectedPlatform && viewMode === 'detail') {
      setViewMode('list');
    }
  }, [selectedPlatform, viewMode]);

  const mainTabs: Tab[] = [
    { id: 'nearby', label: '주변 혜택' },
    { id: 'favorites', label: '관심 혜택' },
    { id: 'ai', label: '잇플AI 추천' },
  ];

  const handleSearchChange = (query: string) => {
    onSearchChange?.(query);
  };

  const handleFavoriteClick = (favorite: FavoriteBenefit) => {
    // TODO: 상세보기 모달 열기 또는 상세 페이지로 이동
    console.log('즐겨찾기 클릭:', favorite);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // 카테고리 변경은 useFavoritesList 내부의 useEffect에서 자동 처리됨
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
            <SearchSection
              onSearchChange={handleSearchChange}
              onKeywordSearch={onKeywordSearch}
              initialQuery={searchQuery}
            />

            <div className="mb-4">
              <NavigationTabsSection
                tabs={mainTabs}
                activeTab={activeTab}
                onTabChange={onActiveTabChange}
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
              {/* 카테고리 탭 (관심 혜택용 - 사이드바 모드) */}
              <div className="mb-6">
                <CategoryTabsSection
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  mode="sidebar"
                />
              </div>

              {/* 즐겨찾기 스토어 리스트 */}
              <div className="flex-1 overflow-y-auto w-[370px]">
                <FavoriteStoreList
                  favorites={favorites}
                  onItemClick={handleFavoriteClick}
                  isLoading={isFavoritesLoading}
                />
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <>
              {/* 카테고리 탭 (AI 추천용 - 사이드바 모드) */}
              <div className="mb-4">
                <CategoryTabsSection
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(categoryId) => {
                    // TODO: AI 추천 카테고리 기능 구현
                    console.log('AI 추천 카테고리 선택:', categoryId);
                  }}
                  mode="sidebar"
                />
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="text-grey04 text-center">
                  <div className="text-lg mb-2">🤖</div>
                  <div>AI 추천 기능 준비중입니다</div>
                </div>
              </div>
            </>
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
