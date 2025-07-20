import React, { useState, useCallback } from 'react';
import { SearchBar } from '../../../../components/common';
import CategoryTags from '../CategoryTags';
import KakaoMap from '../KakaoMap';
import SidebarList from '../SidebarList';
import { Platform, Category, MapLocation } from '../../types';
import { useStoreData } from '../../hooks/useStoreData';

const MainPageLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);

  // 실제 카테고리 정의
  const categories: Category[] = [
    { id: 'all', name: '전체' },
    { id: 'entertainment', name: '🎬 엔터테인먼트' },
    { id: 'beauty', name: '💄 뷰티/건강' },
    { id: 'shopping', name: '🛍️ 쇼핑' },
    { id: 'convenience', name: '🏪 편의점' },
    { id: 'food', name: '🍽️ 음식점' },
    { id: 'culture', name: '🎨 문화/여가' },
    { id: 'education', name: '📚 교육' },
    { id: 'travel', name: '✈️ 여행/숙박' },
  ];

  // API에서 실제 가맹점 데이터 가져오기
  const {
    platforms: apiPlatforms,
    currentLocation,
    userCoords,
    isLoading,
    error,
    updateLocationFromMap,
  } = useStoreData();

  // 카테고리 선택 핸들러
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      setSelectedPlatform(null);

      // API 데이터만 사용
      const sourcePlatforms = apiPlatforms;

      let platforms: Platform[];
      if (searchQuery.trim()) {
        platforms = sourcePlatforms.filter(
          (platform) =>
            platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            platform.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (categoryId !== 'all') {
          platforms = platforms.filter((platform) => platform.category === categoryId);
        }
      } else {
        if (categoryId === 'all') {
          platforms = sourcePlatforms;
        } else {
          platforms = sourcePlatforms.filter((platform) => platform.category === categoryId);
        }
      }

      setFilteredPlatforms(platforms);
    },
    [searchQuery, apiPlatforms]
  );

  // 검색 핸들러
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setSelectedPlatform(null);

      // API 데이터만 사용
      const sourcePlatforms = apiPlatforms;

      let platforms: Platform[];
      if (query.trim()) {
        platforms = sourcePlatforms.filter(
          (platform) =>
            platform.name.toLowerCase().includes(query.toLowerCase()) ||
            platform.category.toLowerCase().includes(query.toLowerCase())
        );
        if (selectedCategory !== 'all') {
          platforms = platforms.filter((platform) => platform.category === selectedCategory);
        }
      } else {
        if (selectedCategory === 'all') {
          platforms = sourcePlatforms;
        } else {
          platforms = sourcePlatforms.filter((platform) => platform.category === selectedCategory);
        }
      }

      setFilteredPlatforms(platforms);
    },
    [selectedCategory, apiPlatforms]
  );

  // 검색어 초기화 핸들러
  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setSelectedPlatform(null);
    setFilteredPlatforms([]);
  }, []);

  // 플랫폼 선택 핸들러
  const handlePlatformSelect = useCallback((platform: Platform) => {
    setSelectedPlatform(platform);
  }, []);

  // 사용자 위치 변경 핸들러 (초기 위치)
  const handleLocationChange = useCallback((location: MapLocation) => {
    setUserLocation(location);
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
