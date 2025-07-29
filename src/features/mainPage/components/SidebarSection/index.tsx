import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from '../../types';
import { FavoriteBenefit, RecommendationItem } from '../../types/api';
import { CATEGORIES } from '../../constants';
import SearchSection from './SearchSection';
import InfoBannerSection from './InfoBannerSection';
import NavigationTabsSection from './NavigationTabsSection';
import StoreCardsSection from './AllBenefit';
import FavoriteStoreList from './FavoriteStoreList';
import RecommendStoreList from './RecommendStoreList';
import StoreDetailCard from './StoreDetail';
import CategoryTabsSection from './CategoryTabsSection';
import { useFavoritesList } from '../../hooks/useFavoritesList';
import { getRecommendations } from '../../api/recommendationApi';

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
  onKeywordSearch?: (keyword: string, reason?: string) => void;
  searchQuery?: string;
  onMapCenterMove?: (latitude: number, longitude: number) => void;
  onBenefitDetailRequest?: (benefitIds: number[]) => void;
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
  onMapCenterMove,
  onBenefitDetailRequest,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // AI 추천 상태
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

  // 즐겨찾기 데이터 관리 (관심 혜택 탭일 때만 로드)
  const { favorites, isLoading: isFavoritesLoading } = useFavoritesList(
    activeTab === 'favorites' ? selectedCategory : undefined
  );

  // AI 추천 초기 로드 상태 관리 (nearby 방식과 완전히 동일)
  const [isInitialRecommendationsLoad, setIsInitialRecommendationsLoad] = useState(true);
  const isInitialRecommendationsLoadRef = useRef(isInitialRecommendationsLoad);
  isInitialRecommendationsLoadRef.current = isInitialRecommendationsLoad;

  const fetchRecommendations = useCallback(async () => {
    setIsRecommendationsLoading(true);
    setRecommendationsError(null);
    try {
      const response = await getRecommendations();
      setRecommendations(response.data);
    } catch (error) {
      console.error('AI 추천 데이터 로드 실패:', error);
      // API 에러 메시지를 그대로 전달
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        'AI 추천을 불러오는데 실패했습니다.';
      setRecommendationsError(errorMessage);
    } finally {
      setIsRecommendationsLoading(false);
    }
  }, []);

  // fetchRecommendations 참조를 ref로 저장 (의존성 배열 최적화)
  const fetchRecommendationsRef = useRef(fetchRecommendations);
  fetchRecommendationsRef.current = fetchRecommendations;

  // activeTab 참조를 ref로 저장 (의존성 배열 최적화)
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // AI 추천 초기 로드만 (nearby 패턴과 동일)
  useEffect(() => {
    const initializeRecommendations = () => {
      if (activeTabRef.current === 'ai') {
        fetchRecommendationsRef.current();
      }
    };

    initializeRecommendations();
  }, []); // 빈 의존성 배열로 초기 로드만

  // 초기 로드 완료 감지 (nearby 패턴과 동일 - recommendations 데이터가 로드된 후에 완료 처리)
  useEffect(() => {
    if (recommendations && recommendations.length >= 0 && isInitialRecommendationsLoad) {
      setIsInitialRecommendationsLoad(false);
    }
  }, [recommendations, isInitialRecommendationsLoad]);

  // activeTab 변경 시에만 실행 (초기 로드 제외)
  useEffect(() => {
    if (isInitialRecommendationsLoadRef.current || activeTabRef.current !== 'ai') {
      return;
    }
    fetchRecommendationsRef.current();
  }, [activeTab]);

  // 카드 클릭 시 상세보기로 전환 + 지도 중심 이동
  const handleCardClick = (platform: Platform) => {
    onPlatformSelect(platform);
    setViewMode('detail');
    // 해당 가맹점 위치로 지도 중심 이동
    onMapCenterMove?.(platform.latitude, platform.longitude);
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
  }, [selectedPlatform, viewMode, activeTab]);

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
    // 파트너명으로 검색 실행
    onKeywordSearch?.(favorite.partnerName);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // 카테고리 변경은 useFavoritesList 내부의 useEffect에서 자동 처리됨
  };

  // 탭별 다른 InfoBanner 메시지와 강조 텍스트
  const getBannerConfig = () => {
    switch (activeTab) {
      case 'nearby':
        return {
          message: '근처 제휴처를 안내해드릴게요 !',
          highlightText: '근처 제휴처',
        };
      case 'favorites':
        return {
          message: '잇플님의 관심 혜택을 보여드릴게요!',
          highlightText: '관심 혜택',
        };
      case 'ai':
        return {
          message: '잇플님의 맞춤 잇플AI 추천을 보여드릴게요!',
          highlightText: '맞춤 잇플AI 추천',
        };
      default:
        return {
          message: '근처 제휴처를 안내해드릴게요 !',
          highlightText: '근처 제휴처',
        };
    }
  };

  return (
    <div className="bg-white flex flex-col overflow-hidden w-full h-full rounded-[18px] drop-shadow-basic max-md:bg-transparent max-md:rounded-none max-md:drop-shadow-none max-md:overflow-visible">
      {viewMode === 'list' ? (
        // 리스트 모드: 기존 UI
        <div className="flex flex-col mx-5 mt-[15px] mb-[18px] w-[330px] max-md:mx-0 max-md:w-full flex-1 min-h-0">
          {/* 검색 영역 - 데스크톱에서만 표시 */}
          <div className="pb-8 flex-shrink-0">
            <div className="hidden md:block">
              <SearchSection
                onSearchChange={handleSearchChange}
                onKeywordSearch={onKeywordSearch}
                defaultValue={searchQuery}
              />
            </div>

            <div className={`mb-4 ${searchQuery ? 'md:mt-0 mt-0' : 'md:mt-0 mt-0'} max-md:mx-0`}>
              <NavigationTabsSection
                tabs={mainTabs}
                activeTab={activeTab}
                onTabChange={onActiveTabChange}
              />
            </div>

            <InfoBannerSection
              message={getBannerConfig().message}
              highlightText={getBannerConfig().highlightText}
              variant="primary"
            />
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
              <div className="mb-3 max-md:mx-0">
                <CategoryTabsSection
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  mode="sidebar"
                  showNavigationButtons={true}
                />
              </div>

              {/* 즐겨찾기 스토어 리스트 */}
              <div
                className="-mx-5 overflow-y-auto overflow-x-hidden flex flex-col max-md:mx-0"
                style={{ height: 'calc(100vh - 360px)' }}
              >
                <FavoriteStoreList
                  favorites={favorites}
                  onItemClick={handleFavoriteClick}
                  isLoading={isFavoritesLoading}
                />
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <div
              className="-mx-5 overflow-y-auto overflow-x-hidden flex flex-col max-md:mx-0 max-md:mb-2"
              style={{ height: 'calc(100vh - 48px)' }}
            >
              <RecommendStoreList
                stores={recommendations}
                onItemClick={(store) => {
                  onKeywordSearch?.(store.partnerName, store.reason);
                }}
                isLoading={isRecommendationsLoading}
                error={recommendationsError}
                onBenefitDetailRequest={onBenefitDetailRequest}
              />
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
