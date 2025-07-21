import React from 'react';
import { Platform, Category, MapLocation } from '../../types';
import CategoryTabsSection from '../CategoryTabsSection';
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
}) => {
  return (
    <div className="relative">
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
        onMapCenterChange={onMapCenterChange}
        centerLocation={centerLocation}
      />

      <MapControls onLocationMove={onLocationMove} onSearchInMap={onSearchInMap} />
    </div>
  );
};

export default MapSection;
