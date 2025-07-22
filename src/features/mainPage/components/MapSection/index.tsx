import React, { useState, useEffect } from 'react';
import { Platform, Category, MapLocation } from '../../types';
import CategoryTabsSection from '../SidebarSection/CategoryTabsSection';
import KakaoMap from './KakaoMap';
import MapControls from './MapControls';

interface MapSectionProps {
  platforms: Platform[];
  selectedPlatform?: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  onLocationChange?: (location: MapLocation) => void;
  onMapCenterChange?: (location: MapLocation) => void;
  onLocationMove: (latitude: number, longitude: number) => void;
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onSearchInMap?: () => void;
  centerLocation?: { latitude: number; longitude: number } | null;
  onMapLevelChange?: (mapLevel: number) => void;
  hasInitialSearched?: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({
  platforms,
  selectedPlatform,
  onPlatformSelect,
  onLocationChange,
  onMapCenterChange,
  onLocationMove,
  categories,
  selectedCategory,
  onCategorySelect,
  onSearchInMap,
  centerLocation,
  onMapLevelChange,
  hasInitialSearched = false,
}) => {
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 지도 중심 변경 핸들러 (드래그 감지)
  const handleMapCenterChange = (location: MapLocation) => {
    console.log('🗺️ 지도 드래그 감지:', { hasInitialSearched, hasSearched, showSearchButton });
    // 초기 검색이나 수동 검색을 한 후에만 드래그 시 버튼 표시
    setShowSearchButton(true);
    onMapCenterChange?.(location);
  };

  // 검색 실행 핸들러
  const handleSearchInMap = () => {
    setHasSearched(true);
    setShowSearchButton(false); // 검색하면 버튼 숨김
    onSearchInMap?.();
  };

  // 카테고리 변경시 검색 상태 리셋
  useEffect(() => {
    setHasSearched(false);

    setShowSearchButton(false);
  }, [selectedCategory]);
  return (
    <div className="relative w-full h-full">
      {/* 카테고리 태그 - 지도 위 오버레이 */}
      <div className="absolute top-4 left-5 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <CategoryTabsSection
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
        </div>
      </div>

      <KakaoMap
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={onPlatformSelect}
        onLocationChange={onLocationChange}
        onMapCenterChange={handleMapCenterChange}
        centerLocation={centerLocation}
        onMapLevelChange={onMapLevelChange}
      />

      <MapControls
        onLocationMove={onLocationMove}
        onSearchInMap={handleSearchInMap}
        showSearchButton={showSearchButton}
      />
    </div>
  );
};

export default MapSection;
