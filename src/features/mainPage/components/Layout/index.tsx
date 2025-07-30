import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import SidebarSection from '../SidebarSection';
import MapSection from '../MapSection';
import SearchSection from '../SidebarSection/SearchSection';
import SpeechBubble from '../SidebarSection/RecommendStoreList/SpeechBubble';
import BenefitDetailCard from '../SidebarSection/RecommendStoreList/BenefitDetailCard';
import MobileHeader from '../../../../components/MobileHeader';
import { Platform, MapLocation } from '../../types';
import { CATEGORIES, LAYOUT } from '../../constants';
import { useStoreData } from '../../hooks/useStoreData';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

/**
 * 메인페이지 레이아웃 컴포넌트
 * 사이드바와 지도 영역을 관리하고 두 영역 간의 데이터 연동 처리
 */

const MainPageLayout: React.FC = () => {
  // UI 상태 관리
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null); // 선택된 가맹점
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]); // 검색 결과 가맹점 목록
  const [activeTab, setActiveTab] = useState<string>('nearby'); // 사이드바 활성 탭 ('주변 혜택', '관심 혜택', '잏AI 추천')
  const [searchQuery, setSearchQuery] = useState<string>(''); // 검색어 상태
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false); // 사이드바 접힘 상태

  // 바텀시트 상태 관리
  const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(90); // 바텀시트 높이
  const [isDragging, setIsDragging] = useState<boolean>(false); // 드래그 상태
  const [startY, setStartY] = useState<number>(0); // 드래그 시작 Y 좌표
  const [startHeight, setStartHeight] = useState<number>(0); // 드래그 시작 시 높이

  // 말풍선 상태
  const [speechBubble, setSpeechBubble] = useState<{
    isVisible: boolean;
    message: string;
    partnerName: string;
  }>({
    isVisible: false,
    message: '',
    partnerName: '',
  });

  // 혜택 상세 카드 상태
  const [benefitDetailCard, setBenefitDetailCard] = useState<{
    isVisible: boolean;
    benefitIds: number[];
  }>({
    isVisible: false,
    benefitIds: [],
  });

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
    searchByKeyword, // 키워드 검색
    userCoords, // 사용자 초기 위치
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
      filterByCategory(categoryValue, currentMapLevel);
    },
    [filterByCategory, currentMapLevel]
  );

  // 플랫폼 선택 핸들러
  const handlePlatformSelect = useCallback(
    (platform: Platform | null) => {
      setSelectedPlatform(platform);

      // 마커 클릭 시 동작
      if (platform) {
        // 모바일에서 마커 클릭 시 바텀시트 자동으로 올리기
        if (window.innerWidth < 768) {
          animateTo(300); // 중간 높이로 올리기
        }
        // 데스크톱에서 마커 클릭 시 사이드바가 접혀있으면 펼치기
        else if (isSidebarCollapsed) {
          setIsSidebarCollapsed(false);
          // 지도 리사이즈를 위한 지연 처리
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 300);
        }
      }
    },
    [isSidebarCollapsed]
  );

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

  // 지도 중심 이동 핸들러 (사이드바에서 호출)
  const handleMapCenterMove = useCallback((latitude: number, longitude: number) => {
    setCurrentMapCenter({ lat: latitude, lng: longitude });
  }, []);

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

  // 마지막 검색어 추적 (중복 검색 방지용)
  const lastSearchedKeywordRef = useRef<string>('');

  // 키워드 검색 핸들러
  const handleKeywordSearch = useCallback(
    (keyword: string) => {
      // 동일한 검색어로 중복 검색 방지
      if (keyword === lastSearchedKeywordRef.current) {
        return;
      }

      lastSearchedKeywordRef.current = keyword;
      setSelectedPlatform(null); // 선택된 가맹점 초기화
      setFilteredPlatforms([]); // 검색 결과 초기화
      setSearchQuery(keyword); // 검색어 저장 (빈 문자열도 포함)
      setActiveTab('nearby'); // 주변 혜택 탭으로 전환

      // 현재 지도 중심이 있으면 사용, 없으면 사용자 초기 위치 사용
      if (currentMapCenter) {
        searchByKeyword(keyword, currentMapLevel, currentMapCenter.lat, currentMapCenter.lng);
      } else if (userCoords) {
        searchByKeyword(keyword, currentMapLevel, userCoords.lat, userCoords.lng);
      }
    },
    [searchByKeyword, currentMapLevel, currentMapCenter, userCoords]
  );

  // 말풍선 표시 핸들러 (검색 없이 말풍선만 표시)
  const handleShowSpeechBubble = useCallback((message: string, partnerName: string) => {
    setSpeechBubble({
      isVisible: true,
      message,
      partnerName,
    });
  }, []);

  // 말풍선 닫기 핸들러
  const handleSpeechBubbleClose = useCallback(() => {
    setSpeechBubble({
      isVisible: false,
      message: '',
      partnerName: '',
    });
  }, []);

  // 혜택 상세 카드 핸들러
  const handleBenefitDetailRequest = useCallback((benefitIds: number[]) => {
    setBenefitDetailCard({
      isVisible: true,
      benefitIds,
    });
  }, []);

  const handleBenefitDetailCardClose = useCallback(() => {
    setBenefitDetailCard({
      isVisible: false,
      benefitIds: [],
    });
  }, []);

  // 사이드바 토글 핸들러
  const handleSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);

    // 지도 리사이즈를 위한 지연 처리
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300); // 애니메이션 완료 후
  }, []);

  // 바텀시트 드래그 핸들러

  // 상태 추가
  const [isAnimating, setIsAnimating] = useState(false);

  // 스냅 포인트로 이동할 때 부드럽게 애니메이션
  const animateTo = (target: number) => {
    const clampedTarget = Math.min(target, window.innerHeight - 105);
    setIsAnimating(true);
    setBottomSheetHeight(clampedTarget);
    // transition이 끝난 뒤 끄기
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // transition duration과 동일
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setStartHeight(bottomSheetHeight);
    },
    [bottomSheetHeight]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY; // 위로 드래그하면 양수, 아래로 드래그하면 음수
      const newHeight = Math.max(90, Math.min(window.innerHeight - 105, startHeight + deltaY));

      setBottomSheetHeight(newHeight);
    },
    [isDragging, startY, startHeight]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    // 스냅 포인트 설정
    const windowHeight = window.innerHeight;
    const snapPoints = [90, 300, windowHeight - 120]; // 최소, 중간, 최대 높이

    // 가장 가까운 스냅 포인트로 이동
    const closestSnapPoint = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - bottomSheetHeight) < Math.abs(prev - bottomSheetHeight) ? curr : prev
    );

    animateTo(closestSnapPoint);
  }, [bottomSheetHeight]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setStartY(e.clientY);
      setStartHeight(bottomSheetHeight);
    },
    [bottomSheetHeight]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const currentY = e.clientY;
      const deltaY = startY - currentY;
      const newHeight = Math.max(20, Math.min(window.innerHeight - 120, startHeight + deltaY));

      setBottomSheetHeight(newHeight);
    },
    [isDragging, startY, startHeight]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

    const windowHeight = window.innerHeight;
    const snapPoints = [90, 300, windowHeight - 120];

    const closestSnapPoint = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - bottomSheetHeight) < Math.abs(prev - bottomSheetHeight) ? curr : prev
    );

    animateTo(closestSnapPoint);
  }, [bottomSheetHeight]);

  // 바텀시트가 항상 탭바까지만 보이게
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setBottomSheetHeight(90);
    }
  }, []);

  // platforms 배열 안정화
  const stablePlatforms = useMemo(() => {
    return filteredPlatforms.length > 0 ? filteredPlatforms : apiPlatforms;
  }, [filteredPlatforms, apiPlatforms]);

  // 모바일에서 body 스크롤 방지
  useEffect(() => {
    const isMobile = window.innerWidth < 767;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* 데스크톱 레이아웃 */}
      <div className="hidden md:flex h-screen bg-grey01 p-6 relative overflow-hidden">
        {/* 사이드바 컨테이너 */}
        <div
          className={`flex-shrink-0 h-full transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? '-ml-6' : ''
          }`}
          style={{
            width: isSidebarCollapsed ? '0px' : `${LAYOUT.SIDEBAR_WIDTH + 24}px`, // padding 포함
            minWidth: isSidebarCollapsed ? '0px' : `${LAYOUT.SIDEBAR_MIN_WIDTH + 24}px`,
          }}
        >
          <div
            className={`h-full transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              width: `${LAYOUT.SIDEBAR_WIDTH}px`,
              minWidth: `${LAYOUT.SIDEBAR_MIN_WIDTH}px`,
            }}
          >
            <SidebarSection
              platforms={stablePlatforms}
              selectedPlatform={selectedPlatform}
              onPlatformSelect={handlePlatformSelect}
              currentLocation={currentLocation}
              isLoading={isLoading}
              error={error}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
              onKeywordSearch={handleKeywordSearch}
              searchQuery={searchQuery}
              onMapCenterMove={handleMapCenterMove}
              onBenefitDetailRequest={handleBenefitDetailRequest}
              onShowSpeechBubble={handleShowSpeechBubble}
              userCoords={userCoords}
            />
          </div>
        </div>

        {/* 사이드바 토글 버튼 */}
        <button
          onClick={handleSidebarToggle}
          className={`absolute top-40 z-40 bg-white rounded-[18px] drop-shadow-basic px-1 py-3 hover:bg-grey01 transition-all duration-300 ease-in-out transform -translate-y-1/2 ${
            isSidebarCollapsed ? 'left-[0px]' : 'left-[395px]'
          }`}
          style={{ width: '24px', height: '60px' }}
        >
          {isSidebarCollapsed ? (
            <TbChevronRight size={14} className="text-grey05" />
          ) : (
            <TbChevronLeft size={14} className="text-grey05" />
          )}
        </button>

        {/* 맵 영역 */}
        <div
          className={`flex-1 h-full transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'pl-6' : ''
          }`}
        >
          <MapSection
            platforms={stablePlatforms}
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
          className={`absolute bottom-0 pointer-events-none z-30 overflow-hidden transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            left: isSidebarCollapsed ? '20px' : '400px',
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

        {/* 혜택 상세 카드 - 말풍선 위쪽에 위치 */}
        {benefitDetailCard.isVisible && !isSidebarCollapsed && (
          <div
            className="absolute z-30 transition-all duration-300 ease-in-out"
            style={{
              left: isSidebarCollapsed ? '120px' : '500px',
              bottom: '350px', // 말풍선보다 위쪽
              transform: 'translateX(-20%)',
              width: '410px',
            }}
          >
            <BenefitDetailCard
              benefitIds={benefitDetailCard.benefitIds}
              onClose={handleBenefitDetailCardClose}
            />
          </div>
        )}

        {/* 말풍선 - 캐릭터 위에 위치 */}
        {!isSidebarCollapsed && (
          <div
            className="absolute z-20 transition-all duration-300 ease-in-out"
            style={{
              left: isSidebarCollapsed ? '120px' : '500px',
              bottom: '200px', // 캐릭터 머리 위쪽
              transform: 'translateX(-20%)',
            }}
          >
            <SpeechBubble
              message={speechBubble.message}
              partnerName={speechBubble.partnerName}
              isVisible={speechBubble.isVisible}
              onClose={handleSpeechBubbleClose}
            />
          </div>
        )}
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex md:hidden flex-col h-screen bg-grey01 overflow-hidden">
        {/* 토스트 컨테이너 z-index 조정 */}
        <style>
          {`
            .Toastify__toast-container {
              z-index: 50000 !important;
            }
          `}
        </style>

        {/* 투명 MobileHeader with SearchSection */}
        <div className="absolute top-0 left-0 right-0 z-[10000]">
          <MobileHeader
            backgroundColor="bg-transparent"
            rightContent={
              <SearchSection
                onSearchChange={(query) => setSearchQuery(query)}
                onKeywordSearch={handleKeywordSearch}
                defaultValue={searchQuery}
              />
            }
          />
        </div>

        {/* 지도 - 전체 화면 */}
        <div className="absolute inset-0">
          <MapSection
            platforms={stablePlatforms}
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

          {/* 바텀시트 */}
          <div
            className={`absolute left-0 right-0 bg-white rounded-t-[18px] shadow-lg z-[9998] flex flex-col ${
              isAnimating ? 'transition-all duration-300 ease-out' : ''
            }`}
            style={{
              height: `${bottomSheetHeight}px`,
              bottom: 0,
              minHeight: '90px',
              maxHeight: 'calc(100dvh - 105px)',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* 드래그 핸들 */}
            <div
              className="w-full h-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
            >
              <div className="w-8 h-1 bg-grey03 rounded-full" />
            </div>

            {/* 사이드바 콘텐츠 */}
            <div className="flex-1 min-h-0">
              <SidebarSection
                platforms={stablePlatforms}
                selectedPlatform={selectedPlatform}
                onPlatformSelect={handlePlatformSelect}
                currentLocation={currentLocation}
                isLoading={isLoading}
                error={error}
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
                onKeywordSearch={handleKeywordSearch}
                searchQuery={searchQuery}
                onMapCenterMove={handleMapCenterMove}
                onBenefitDetailRequest={handleBenefitDetailRequest}
                userCoords={userCoords}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPageLayout;
