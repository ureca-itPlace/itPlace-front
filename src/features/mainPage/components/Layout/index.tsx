import React, { useState, useCallback } from 'react';
import CategoryTags from '../CategoryTags';
import KakaoMap from '../KakaoMap';
import SidebarList from '../SidebarList';
import { Platform, Category, MapLocation } from '../../types';
import { useStoreData } from '../../hooks/useStoreData';

const MainPageLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);

  // 실제 카테고리 정의
  const categories: Category[] = [
    { id: '전체', name: '전체' },
    { id: '엔터테인먼트', name: '엔터테인먼트' },
    { id: '뷰티/건강', name: '뷰티/건강' },
    { id: '쇼핑', name: '쇼핑' },
    { id: '생활/편의', name: '생활/편의' },
    { id: '푸드', name: '푸드' },
    { id: '문화/여가', name: '문화/여가' },
    { id: '교육', name: '교육' },
    { id: '여행/교통', name: '여행/교통' },
  ];

  // API에서 실제 가맹점 데이터 가져오기
  const {
    platforms: apiPlatforms,
    currentLocation,
    isLoading,
    error,
    updateLocationFromMap,
    filterByCategory,
  } = useStoreData();

  // 카테고리 선택 핸들러
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      console.log('🔍 카테고리 선택됨:', categoryId);
      setSelectedCategory(categoryId);
      setSelectedPlatform(null);

      // API 기반 카테고리 필터링
      const categoryValue = categoryId === 'all' ? null : categoryId;
      console.log('📡 API로 전달될 카테고리 값:', categoryValue);
      filterByCategory(categoryValue);

      // 검색 결과 초기화
      setFilteredPlatforms([]);
    },
    [filterByCategory]
  );

  // 플랫폼 선택 핸들러
  const handlePlatformSelect = useCallback((platform: Platform) => {
    setSelectedPlatform(platform);
  }, []);

  // 사용자 위치 변경 핸들러 (초기 위치)
  const handleLocationChange = useCallback(() => {
    // 초기 플랫폼 목록은 API에서 로드됨
    setFilteredPlatforms([]);
  }, []);

  // 지도 중심 변경 핸들러 (지도 드래그 시)
  const handleMapCenterChange = useCallback(
    (location: MapLocation) => {
      updateLocationFromMap(location.latitude, location.longitude);
    },
    [updateLocationFromMap]
  );

  return (
    <div className="h-screen flex items-center justify-center gap-6 bg-grey01 p-6">
      {/* 사이드바 */}
      <div className="bg-white flex flex-col overflow-hidden w-[370px] h-[891px] rounded-[18px] drop-shadow-basic">
        <SidebarList
          platforms={filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
          isLoading={isLoading}
          currentLocation={currentLocation}
          error={error}
        />
      </div>

      {/* 지도 영역 */}
      <div className="relative">
        {/* 카테고리 태그 - 지도 위 오버레이 */}
        <div className="absolute top-4 left-5 z-10">
          <CategoryTags
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        <KakaoMap
          platforms={filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
          onLocationChange={handleLocationChange}
          onMapCenterChange={handleMapCenterChange}
        />

        {/* 현재 지도에서 검색 버튼 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <button className="bg-purple04 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple05 transition-colors duration-200 flex items-center space-x-2">
            <span>🔍</span>
            <span>현 지도에서 검색</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPageLayout;
