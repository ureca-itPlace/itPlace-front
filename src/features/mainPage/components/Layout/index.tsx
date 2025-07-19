import React, { useState, useCallback } from 'react';
import { SearchBar } from '../../../../components/common';
import CategoryTags from '../CategoryTags';
import KakaoMap from '../KakaoMap';
import SidebarList from '../SidebarList';
import { Platform, Category, MapLocation } from '../../types';
import { mockCategories, getPlatformsByCategory, searchPlatforms } from '../../data/mockData';

const MainPageLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      setSelectedPlatform(null);

      let platforms: Platform[];
      if (searchQuery.trim()) {
        platforms = searchPlatforms(searchQuery);
        if (categoryId !== 'all') {
          platforms = platforms.filter((platform) => platform.category === categoryId);
        }
      } else {
        platforms = getPlatformsByCategory(categoryId);
      }

      setFilteredPlatforms(platforms);
    },
    [searchQuery]
  );

  // 검색 핸들러
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setSelectedPlatform(null);

      let platforms: Platform[];
      if (query.trim()) {
        platforms = searchPlatforms(query);
        if (selectedCategory !== 'all') {
          platforms = platforms.filter((platform) => platform.category === selectedCategory);
        }
      } else {
        platforms = getPlatformsByCategory(selectedCategory);
      }

      setFilteredPlatforms(platforms);
    },
    [selectedCategory]
  );

  // 검색어 초기화 핸들러
  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setSelectedPlatform(null);
    setFilteredPlatforms(getPlatformsByCategory(selectedCategory));
  }, [selectedCategory]);

  // 플랫폼 선택 핸들러
  const handlePlatformSelect = useCallback((platform: Platform) => {
    setSelectedPlatform(platform);
  }, []);

  // 사용자 위치 변경 핸들러
  const handleLocationChange = useCallback((location: MapLocation) => {
    setUserLocation(location);
    // 초기 플랫폼 목록 설정
    setFilteredPlatforms(getPlatformsByCategory('all'));
  }, []);

  return (
    <div className="h-screen flex items-center justify-center gap-6 bg-grey01 p-6">
      {/* 사이드바 */}
      <div
        className="bg-white flex flex-col overflow-hidden"
        style={{
          width: '370px',
          height: '891px',
          borderRadius: '18px',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <SidebarList
          platforms={filteredPlatforms}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
        />
      </div>

      {/* 지도 영역 */}
      <div className="relative">
        {/* 카테고리 태그 - 지도 위 오버레이 */}
        <div className="absolute top-4 left-5 z-10">
          <CategoryTags
            categories={mockCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        <KakaoMap
          platforms={filteredPlatforms}
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformSelect}
          onLocationChange={handleLocationChange}
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
