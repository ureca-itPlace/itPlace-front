import { useState, useEffect, useCallback, useRef } from 'react';
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

  // userCoords의 최신 값을 참조하기 위한 ref
  const userCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

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

      return transformStoreDataToPlatforms(storeResponse.data);
    },
    []
  );

  /**
   * 좌표 업데이트 및 주소 변환 공통 함수
   */
  const updateLocationInfo = useCallback(async (lat: number, lng: number) => {
    const coords = { lat, lng };
    setUserCoords(coords);
    userCoordsRef.current = coords; // ref도 업데이트
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      setCurrentLocation(address);
    } catch {
      // 주소 변환 실패 시 무시 (지도는 정상 동작)
    }
  }, []);

  // 함수 참조를 ref로 저장 (의존성 배열 최적화)
  const executeRef = useRef(execute);
  executeRef.current = execute;
  const loadStoresByCategoryRef = useRef(loadStoresByCategory);
  loadStoresByCategoryRef.current = loadStoresByCategory;
  const updateLocationInfoRef = useRef(updateLocationInfo);
  updateLocationInfoRef.current = updateLocationInfo;

  // 초기 데이터 로드 (컴포넌트 마운트 시에만)
  useEffect(() => {
    const initializeData = async () => {
      // 1. 현재 위치 가져오기
      const coords = await getCurrentLocation();
      await updateLocationInfoRef.current(coords.lat, coords.lng);

      // 2. 근처 제휴처 데이터 로드 (초기에는 전체 카테고리)
      const platforms = await loadStoresByCategoryRef.current(
        coords.lat,
        coords.lng,
        DEFAULT_RADIUS,
        null // 초기 로드는 전체 카테고리
      );

      return platforms; // 데이터 반환
    };

    executeRef.current(initializeData);
  }, []); // 빈 의존성 배열로 초기 로드만 실행

  // 카테고리 변경 시에만 반응하는 useEffect (초기 로드 제외)
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 초기 로드 완료 감지
  useEffect(() => {
    if (userCoords && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [userCoords, isInitialLoad]);

  // isInitialLoad 참조를 ref로 저장 (의존성 배열 최적화)
  const isInitialLoadRef = useRef(isInitialLoad);
  isInitialLoadRef.current = isInitialLoad;

  // 카테고리나 맵레벨 변경 시에만 실행 (초기 로드 제외)
  useEffect(() => {
    if (isInitialLoadRef.current || !userCoordsRef.current) {
      return; // 초기 로드 중이거나 좌표가 없으면 스킵
    }

    // 카테고리 변경 시에만 실행되는 재로드
    const reloadByCategory = async () => {
      const coords = userCoordsRef.current!; // ref에서 최신 값 사용
      const platforms = await loadStoresByCategoryRef.current(
        coords.lat,
        coords.lng,
        getRadiusByMapLevel(currentMapLevelInHook),
        selectedCategory
      );
      return platforms;
    };

    executeRef.current(reloadByCategory);
  }, [selectedCategory, currentMapLevelInHook]);

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
        const platforms = await loadStoresByCategoryRef.current(
          centerLat,
          centerLng,
          radius,
          selectedCategory
        );

        // 위치 정보 업데이트
        await updateLocationInfoRef.current(centerLat, centerLng);

        return platforms;
      };

      await executeRef.current(searchInMap);
    },
    [selectedCategory]
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

          return transformStoreDataToPlatforms(storeResponse.data);
        }

        // 키워드 검색 API 호출
        const storeResponse = await searchStores({
          lat: searchLat,
          lng: searchLng,
          category: selectedCategory || undefined,
          keyword: keyword.trim(),
        });

        return transformStoreDataToPlatforms(storeResponse.data);
      };

      await executeRef.current(keywordSearch);
    },
    [selectedCategory]
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
