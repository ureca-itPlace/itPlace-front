import React, { useState, useCallback } from 'react';
import SidebarSection from '../SidebarSection';
import MapSection from '../MapSection';
import { Platform, MapLocation } from '../../types';
import { CATEGORIES, LAYOUT } from '../../constants';
import { useStoreData } from '../../hooks/useStoreData';

/**
 * 메인페이지 레이아웃 컴포넌트
 * 사이드바와 지도 영역을 관리하고 두 영역 간의 데이터 연동 처리
 */

const MainPageLayout: React.FC = () => {
  // UI 상태 관리
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null); // 선택된 가맹점
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]); // 검색 결과 가맹점 목록
  const [activeTab, setActiveTab] = useState<string>('nearby'); // 사이드바 활성 탭 ('주변 혜택', '관심 혜택', '잏AI 추천')

  // 지도 관련 상태
  const [currentMapLevel, setCurrentMapLevel] = useState<number>(2); // 지도 확대/축소 레벨
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number } | null>(
    null
  ); // 지도 중심 좌표

  // 가맹점 데이터 및 API 상태 관리
  const {
    platforms: apiPlatforms, // API에서 가져온 가맹점 목록
    currentLocation, // 현재 위치 주소 텍스트
    isLoading, // 로딩 상태
    error, // 에러 상태
    selectedCategory, // 선택된 카테고리 (useStoreData에서 관리)
    updateLocationFromMap, // 지도에서 위치 이동 시 주소 업데이트
    filterByCategory, // 카테고리 필터링
    searchInCurrentMap, // 현재 지도 영역에서 검색
  } = useStoreData();

  /**
   * 카테고리 선택 처리
   * 카테고리 변경 시 선택된 가맹점 및 검색 결과 초기화
   */
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedPlatform(null); // 선택된 가맹점 초기화
      setFilteredPlatforms([]); // 검색 결과 초기화

      // API 기반 카테고리 필터링 ('전체' -> null 변환)
      const categoryValue = categoryId === '전체' ? null : categoryId;
      filterByCategory(categoryValue);
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
      setCurrentMapCenter({ lat: latitude, lng: longitude });
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
      <div
        className="flex-shrink-0 h-full"
        style={{
          flexBasis: `${LAYOUT.SIDEBAR_WIDTH}px`,
          minWidth: `${LAYOUT.SIDEBAR_MIN_WIDTH}px`,
        }}
      >
        <SidebarSection
          platforms={filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
          currentLocation={currentLocation}
          isLoading={isLoading}
          error={error}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
        />
      </div>

      <div className="flex-1 h-full" style={{ minWidth: `${LAYOUT.MAP_MIN_WIDTH}px` }}>
        <MapSection
          platforms={filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
          onLocationChange={handleLocationChange}
          onMapCenterChange={handleMapCenterChange}
          onLocationMove={handleLocationMove}
          categories={CATEGORIES}
          selectedCategory={selectedCategory || '전체'}
          onCategorySelect={handleCategorySelect}
          onSearchInMap={handleSearchInMap}
          centerLocation={
            currentMapCenter
              ? { latitude: currentMapCenter.lat, longitude: currentMapCenter.lng }
              : null
          }
          onMapLevelChange={handleMapLevelChange}
          activeTab={activeTab}
        />
      </div>

      {/* 캐릭터 이미지 - 사이드바와 맵 사이 */}
      <div
        className="absolute bottom-0 pointer-events-none z-10 overflow-hidden"
        style={{
          left: '400px',
          transform: 'translateX(-20%)',
          width: '380px',
          height: '200px', // 허리까지만 보이도록 절반 높이
        }}
      >
        <img
          src="/images/main/mainCharacter.webp"
          alt="잇플 캐릭터"
          className="w-full h-auto object-contain object-bottom"
          style={{ width: '190px', height: '190px' }}
        />
      </div>
    </div>
  );
};

export default MainPageLayout;
