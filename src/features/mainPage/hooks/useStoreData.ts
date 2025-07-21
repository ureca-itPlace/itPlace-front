import { useState, useEffect } from 'react';
import { Platform } from '../types';
import {
  getStoreList,
  getStoreListByCategory,
  getCurrentLocation,
  getAddressFromCoordinates,
} from '../api/storeApi';
import { convertStoreDataToPlatform } from '../utils/storeUtils';

// 맵 레벨에 따른 반경 계산 함수
const getRadiusByMapLevel = (mapLevel: number): number => {
  // 맵 레벨이 작을수록(확대) 작은 반경, 클수록(축소) 큰 반경
  const radiusMap: { [key: number]: number } = {
    1: 500, // 최대 확대 - 500m
    2: 1000, // 1km (기본값)
    3: 2000, // 2km
    4: 3000, // 3km
    5: 5000, // 5km
    6: 7000, // 7km
    7: 10000, // 10km
    8: 15000, // 15km
    9: 20000, // 20km
    10: 30000, // 30km
    11: 50000, // 50km
    12: 70000, // 70km
    13: 100000, // 100km
    14: 150000, // 150km - 최대 축소
  };

  return radiusMap[mapLevel] || 1000; // 기본값 5km
};

export const useStoreData = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('위치 정보 로딩 중...');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. 현재 위치 가져오기
        const coords = await getCurrentLocation();
        setUserCoords(coords);

        // 2. 좌표를 주소로 변환
        const address = await getAddressFromCoordinates(coords.lat, coords.lng);
        setCurrentLocation(address);

        // 3. 주변 가맹점 데이터 가져오기 (초기 로드 - 기본 반경 1km)
        const storeResponse = selectedCategory
          ? await getStoreListByCategory({
              lat: coords.lat,
              lng: coords.lng,
              radiusMeters: 1000, // 초기 로드는 1km 고정
              category: selectedCategory,
            })
          : await getStoreList({
              lat: coords.lat,
              lng: coords.lng,
              radiusMeters: 1000, // 초기 로드는 1km 고정
            });

        // 4. API 데이터를 Platform 타입으로 변환

        // 모든 가맹점 (좌표 없는 것도 포함) - 리스트용
        const allPlatforms = storeResponse.data.map((storeData) => {
          const platform = convertStoreDataToPlatform(storeData, coords.lat, coords.lng);
          if (platform === null) {
            // 좌표 없는 경우 기본값으로 처리 (리스트에는 표시, 마커는 제외)
            const { store, partner, tierBenefit } = storeData;
            const gradeOrder = ['VIP콕', 'BASIC', 'VIP', 'VVIP'];
            const benefits = gradeOrder.map((grade) => {
              const benefit = tierBenefit.find((b) => b.grade === grade);
              return benefit ? `${grade}: ${benefit.context}` : `${grade}: -`;
            });
            return {
              id: store.storeId.toString(),
              name: store.storeName,
              category: partner.category,
              address: store.roadAddress || store.address,
              latitude: 0, // 마커 표시 안됨을 나타내는 값
              longitude: 0,
              benefits: benefits,
              rating: 4.5,
              distance: 0,
              imageUrl: partner.image,
            };
          }
          return platform;
        });

        setPlatforms(allPlatforms);
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setCurrentLocation('위치 정보 없음');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [selectedCategory]); // mapLevel 의존성 제거

  // 지도 중심 위치 변경 시 위치 정보만 업데이트 (API 재요청 제거)
  const updateLocationFromMap = async (lat: number, lng: number) => {
    try {
      // 새로운 좌표를 사용자 좌표로 설정
      setUserCoords({ lat, lng });

      // 주소 정보만 업데이트 (가맹점 데이터는 재요청하지 않음)
      const address = await getAddressFromCoordinates(lat, lng);
      setCurrentLocation(address);
    } catch {
      // 주소 업데이트 실패 시 무시 (지도는 정상 동작)
    }
  };

  // 카테고리 필터링 함수
  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  // 현 지도에서 검색 함수 (수동 검색)
  const searchInCurrentMap = async (centerLat: number, centerLng: number, mapLevel: number) => {
    try {
      setIsLoading(true);
      setError(null);

      // 맵 레벨에 따른 반경 계산
      const radius = getRadiusByMapLevel(mapLevel);

      // 현재 카테고리와 위치 기준으로 검색
      const storeResponse = selectedCategory
        ? await getStoreListByCategory({
            lat: centerLat,
            lng: centerLng,
            radiusMeters: radius,
            category: selectedCategory,
          })
        : await getStoreList({
            lat: centerLat,
            lng: centerLng,
            radiusMeters: radius,
          });

      // 모든 가맹점 (좌표 없는 것도 포함) - 리스트용
      const allPlatforms = storeResponse.data.map((storeData) => {
        const platform = convertStoreDataToPlatform(storeData, centerLat, centerLng);
        if (platform === null) {
          // 좌표 없는 경우 기본값으로 처리 (리스트에는 표시, 마커는 제외)
          const { store, partner, tierBenefit } = storeData;
          const gradeOrder = ['VIP콕', 'BASIC', 'VIP', 'VVIP'];
          const benefits = gradeOrder.map((grade) => {
            const benefit = tierBenefit.find((b) => b.grade === grade);
            return benefit ? `${grade}: ${benefit.context}` : `${grade}: -`;
          });
          return {
            id: store.storeId.toString(),
            name: store.storeName,
            category: partner.category,
            address: store.roadAddress || store.address,
            latitude: 0, // 마커 표시 안됨을 나타내는 값
            longitude: 0,
            benefits: benefits,
            rating: 4.5,
            distance: 0,
            imageUrl: partner.image,
          };
        }
        return platform;
      });

      setPlatforms(allPlatforms);

      // 검색한 위치의 주소 정보도 업데이트
      const address = await getAddressFromCoordinates(centerLat, centerLng);
      setCurrentLocation(address);
      setUserCoords({ lat: centerLat, lng: centerLng });
    } catch (error) {
      setError(error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    platforms,
    currentLocation,
    userCoords,
    isLoading,
    error,
    selectedCategory,
    updateLocationFromMap,
    filterByCategory,
    searchInCurrentMap, // 수동 검색 함수 추가
  };
};
