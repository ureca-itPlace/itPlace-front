import { useState, useEffect, useCallback } from 'react';
import { Platform } from '../types';
import {
  getStoreList,
  getStoreListByCategory,
  getCurrentLocation,
  getAddressFromCoordinates,
  searchStores,
} from '../api/storeApi';
import { transformStoreDataToPlatforms } from '../utils/dataTransform';
import { getRadiusByMapLevel } from '../utils/mapUtils';
import { useApiCall } from './useApiCall';
import { DEFAULT_RADIUS } from '../constants';

/**
 * 가맹점 데이터 관리 훅
 * 위치 기반 가맹점 검색, 카테고리 필터링, 지도 연동 기능 제공
 */
export const useStoreData = () => {
  // API 상태 관리
  const { data: platforms, isLoading, error, execute } = useApiCall<Platform[]>([]);

  // 위치 관련 상태
  const [currentLocation, setCurrentLocation] = useState<string>('위치 정보 로딩 중...');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // 카테고리 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentMapLevelInHook, setCurrentMapLevelInHook] = useState<number>(2); // 지도 레벨 상태 추가

  /**
   * 카테고리별 가맹점 데이터 로드
   * 카테고리가 '전체'이거나 null인 경우 전체 검색, 그 외에는 카테고리별 검색
   */
  const loadStoresByCategory = useCallback(
    async (lat: number, lng: number, radius: number, category: string | null) => {
      const shouldFilterByCategory = category && category !== '전체';

      const storeResponse = shouldFilterByCategory
        ? await getStoreListByCategory({ lat, lng, radiusMeters: radius, category })
        : await getStoreList({ lat, lng, radiusMeters: radius });

      return transformStoreDataToPlatforms(storeResponse.data, lat, lng);
    },
    []
  );

  /**
   * 좌표 업데이트 및 주소 변환 공통 함수
   */
  const updateLocationInfo = useCallback(async (lat: number, lng: number) => {
    setUserCoords({ lat, lng });
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      setCurrentLocation(address);
    } catch {
      // 주소 변환 실패 시 무시 (지도는 정상 동작)
    }
  }, []);

  // 초기 데이터 로드 (컴포넌트 마운트 시에만)
  useEffect(() => {
    const initializeData = async () => {
      // 1. 현재 위치 가져오기
      const coords = await getCurrentLocation();
      await updateLocationInfo(coords.lat, coords.lng);

      // 2. 주변 가맹점 데이터 로드 (초기에는 전체 카테고리)
      const platforms = await loadStoresByCategory(
        coords.lat,
        coords.lng,
        DEFAULT_RADIUS,
        null // 초기 로드는 전체 카테고리
      );

      return platforms; // 데이터 반환
    };

    execute(initializeData);
  }, []); // 빈 배열 - 초기 마운트에만 실행

  // 카테고리 변경 시 재로드 (현재 지도 위치 기준)
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!userCoords) return; // 위치 정보가 없으면 대기
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return; // 초기 로드는 위의 useEffect에서 처리
    }

    const reloadByCategory = async () => {
      // 현재 userCoords 값을 직접 가져와서 사용
      const currentCoords = userCoords;
      if (!currentCoords) return [];

      const platforms = await loadStoresByCategory(
        currentCoords.lat,
        currentCoords.lng,
        getRadiusByMapLevel(currentMapLevelInHook), // DEFAULT_RADIUS 대신 현재 맵 레벨 반경 사용
        selectedCategory
      );

      return platforms;
    };

    execute(reloadByCategory);
  }, [selectedCategory, execute, loadStoresByCategory, currentMapLevelInHook]);

  /**
   * 지도 중심 위치 변경 시 위치 정보만 업데이트 (API 재요청 없음)
   */
  const updateLocationFromMap = useCallback(
    async (lat: number, lng: number) => {
      await updateLocationInfo(lat, lng);
    },
    [updateLocationInfo]
  );

  /**
   * 카테고리 필터링
   * 카테고리 변경 시 useEffect가 자동으로 새 데이터를 로드함
   */
  const filterByCategory = useCallback((category: string | null, mapLevel: number) => {
    setSelectedCategory(category);
    setCurrentMapLevelInHook(mapLevel);
  }, []);

  /**
   * 현재 지도 영역에서 가맹점 검색 (수동 검색)
   * 지도 레벨에 따른 반경으로 검색하고 위치 정보도 업데이트
   */
  const searchInCurrentMap = useCallback(
    async (centerLat: number, centerLng: number, mapLevel: number) => {
      const searchInMap = async () => {
        // 맵 레벨에 따른 반경 계산
        const radius = getRadiusByMapLevel(mapLevel);

        // 가맹점 검색
        const platforms = await loadStoresByCategory(
          centerLat,
          centerLng,
          radius,
          selectedCategory
        );

        // 위치 정보 업데이트
        await updateLocationInfo(centerLat, centerLng);

        return platforms;
      };

      await execute(searchInMap);
    },
    [selectedCategory, execute, loadStoresByCategory, updateLocationInfo]
  );

  /**
   * 키워드 검색
   * 지정된 좌표와 맵레벨을 기준으로 검색
   */
  const searchByKeyword = useCallback(
    async (keyword: string, mapLevel: number, searchLat: number, searchLng: number) => {
      const keywordSearch = async () => {
        // 맵 레벨에 따른 반경 계산
        const radius = getRadiusByMapLevel(mapLevel);

        // 검색어가 비어있으면 전체 가맹점 조회
        if (!keyword.trim()) {
          const storeResponse =
            selectedCategory && selectedCategory !== '전체'
              ? await getStoreListByCategory({
                  lat: searchLat,
                  lng: searchLng,
                  radiusMeters: radius,
                  category: selectedCategory,
                })
              : await getStoreList({
                  lat: searchLat,
                  lng: searchLng,
                  radiusMeters: radius,
                });

          return transformStoreDataToPlatforms(storeResponse.data, searchLat, searchLng);
        }

        // 키워드 검색 API 호출
        const storeResponse = await searchStores({
          lat: searchLat,
          lng: searchLng,
          radiusMeters: radius,
          category: selectedCategory || undefined,
          keyword: keyword.trim(),
        });

        return transformStoreDataToPlatforms(storeResponse.data, searchLat, searchLng);
      };

      await execute(keywordSearch);
    },
    // userCoords 의존성 제거 - 지도 드래그 시 재검색 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCategory, execute]
  );

  return {
    platforms: platforms || [], // null 방어
    currentLocation,
    userCoords,
    isLoading,
    error,
    selectedCategory,
    updateLocationFromMap,
    filterByCategory,
    searchInCurrentMap,
    searchByKeyword,
    currentMapLevelInHook,
  };
};
