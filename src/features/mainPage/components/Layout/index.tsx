import React, { useState, useCallback } from 'react';
import SidebarSection from '../SidebarSection';
import MapSection from '../MapSection';
import { Platform, Category, MapLocation } from '../../types';
import { useStoreData } from '../../hooks/useStoreData';

const MainPageLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);
  const [centerLocation, setCenterLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
      const categoryValue = categoryId === '전체' ? null : categoryId;
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

  // 현재 위치로 이동 핸들러
  const handleLocationMove = useCallback(
    (latitude: number, longitude: number) => {
      updateLocationFromMap(latitude, longitude);
      // 지도 중심도 해당 위치로 이동
      setCenterLocation({ latitude, longitude });
    },
    [updateLocationFromMap]
  );

  // 현 지도에서 검색 핸들러
  const handleSearchInMap = useCallback(() => {
    // 현 지도에서 검색 로직 (추후 구현)
    console.log('현 지도에서 검색 클릭됨');
  }, []);

  return (
    <div className="h-screen flex items-center justify-center gap-6 bg-grey01 p-6">
      <SidebarSection
        platforms={filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={handlePlatformSelect}
        currentLocation={currentLocation}
        isLoading={isLoading}
        error={error}
      />

      <MapSection
        platforms={filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={handlePlatformSelect}
        onLocationChange={handleLocationChange}
        onMapCenterChange={handleMapCenterChange}
        onLocationMove={handleLocationMove}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onSearchInMap={handleSearchInMap}
        centerLocation={centerLocation}
      />
    </div>
  );
};

export default MainPageLayout;
