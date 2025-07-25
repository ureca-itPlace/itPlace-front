import React, { useState } from 'react';
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
  activeTab: string;
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
  activeTab,
}) => {
  const [showSearchButton, setShowSearchButton] = useState(false);

  // 지도 중심 변경 핸들러 (드래그 감지)
  const handleMapCenterChange = (location: MapLocation) => {
    // 초기 검색이나 수동 검색을 한 후에만 드래그 시 버튼 표시
    setShowSearchButton(true);
    onMapCenterChange?.(location);
  };

  // 검색 실행 핸들러
  const handleSearchInMap = () => {
    setShowSearchButton(false); // 검색하면 버튼 숨김
    onSearchInMap?.();
  };

  return (
    <div className="relative w-full h-full">
      {/* 카테고리 태그 - 주변 혜택 탭일 때만 지도 위 오버레이 */}
      {activeTab === 'nearby' && (
        <div className="absolute top-4 left-5 right-5 z-10 pointer-events-none overflow-hidden">
          <div className="pointer-events-auto">
            <CategoryTabsSection
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={onCategorySelect}
              mode="map"
            />
          </div>
        </div>
      )}

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
