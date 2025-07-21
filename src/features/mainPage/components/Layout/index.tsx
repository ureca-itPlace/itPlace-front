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
  const [currentMapLevel, setCurrentMapLevel] = useState<number>(2); // 맵 레벨 상태 추가
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number } | null>(
    null
  ); // 지도 중심 저장

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
    searchInCurrentMap,
  } = useStoreData();

  // 카테고리 선택 핸들러
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      setSelectedPlatform(null);

      // API 기반 카테고리 필터링
      const categoryValue = categoryId === '전체' ? null : categoryId;
      filterByCategory(categoryValue);

      // 검색 결과 초기화
      setFilteredPlatforms([]);
    },
    [filterByCategory]
  );

  // 플랫폼 선택 핸들러
  const handlePlatformSelect = useCallback((platform: Platform | null) => {
    setSelectedPlatform(platform);
  }, []);

  // 사용자 위치 변경 핸들러 (초기 위치)
  const handleLocationChange = useCallback((location: MapLocation) => {
    // 초기 지도 중심 설정
    setCurrentMapCenter({ lat: location.latitude, lng: location.longitude });
    setFilteredPlatforms([]);
  }, []);

  // 지도 중심 변경 핸들러 (지도 드래그 시)
  const handleMapCenterChange = useCallback(
    (location: MapLocation) => {
      // 현재 지도 중심 저장 (API 호출은 안 함)
      setCurrentMapCenter({ lat: location.latitude, lng: location.longitude });
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
    if (currentMapCenter && searchInCurrentMap) {
      searchInCurrentMap(currentMapCenter.lat, currentMapCenter.lng, currentMapLevel);
    }
  }, [currentMapCenter, currentMapLevel, searchInCurrentMap]);

  // 맵 레벨 변경 핸들러
  const handleMapLevelChange = useCallback((mapLevel: number) => {
    setCurrentMapLevel(mapLevel);
  }, []);

  return (
    <div className="h-screen flex gap-6 bg-grey01 p-6 relative">
      <div className="flex-shrink-0 h-full" style={{ flexBasis: '370px', minWidth: '300px' }}>
        <SidebarSection
          platforms={filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
          currentLocation={currentLocation}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="flex-1 h-full" style={{ minWidth: '800px' }}>
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
          onMapLevelChange={handleMapLevelChange}
          hasInitialSearched={apiPlatforms.length > 0}
        />
      </div>

      {/* 캐릭터 이미지 - 사이드바와 맵 사이 */}
      <div
        className="absolute bottom-0 pointer-events-none z-10 overflow-hidden"
        style={{
          left: '370px',
          transform: 'translateX(-20%)',
          width: '380px',
          height: '260px', // 허리까지만 보이도록 절반 높이
        }}
      >
        <img
          src="/images/main/mainCharacter.webp"
          alt="잇플 캐릭터"
          className="w-full h-auto object-contain object-bottom"
          style={{ width: '380px', height: '380px' }}
        />
      </div>
    </div>
  );
};

export default MainPageLayout;
