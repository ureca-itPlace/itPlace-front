import { useState, useEffect } from 'react';
import { Platform } from '../types';
import {
  getStoreList,
  getStoreListByCategory,
  getCurrentLocation,
  getAddressFromCoordinates,
} from '../components/SidebarList/api/storeApi';
import { convertStoreDataToPlatform } from '../utils/storeUtils';

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

        // 3. 주변 가맹점 데이터 가져오기
        const storeResponse = selectedCategory
          ? await getStoreListByCategory({
              lat: coords.lat,
              lng: coords.lng,
              radiusMeters: 5000,
              category: selectedCategory,
            })
          : await getStoreList({
              lat: coords.lat,
              lng: coords.lng,
              radiusMeters: 5000, // 5km 반경
            });

        // 4. API 데이터를 Platform 타입으로 변환
        console.log('API 응답 데이터 개수:', storeResponse.data.length);
        console.log('API 응답 데이터:', storeResponse.data);

        const convertedPlatforms = storeResponse.data
          .map((storeData) => convertStoreDataToPlatform(storeData, coords.lat, coords.lng))
          .filter((platform): platform is Platform => platform !== null);

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

        console.log('마커용 플랫폼 개수:', convertedPlatforms.length);
        console.log('전체 플랫폼 개수:', allPlatforms.length);
        setPlatforms(allPlatforms);
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setCurrentLocation('위치 정보 없음');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [selectedCategory]);

  // 지도 중심 위치 변경 시 위치 정보 업데이트
  const updateLocationFromMap = async (lat: number, lng: number) => {
    try {
      const address = await getAddressFromCoordinates(lat, lng);
      setCurrentLocation(address);

      // 해당 위치 기준으로 가맹점 데이터도 새로 가져오기
      const storeResponse = selectedCategory
        ? await getStoreListByCategory({
            lat,
            lng,
            radiusMeters: 5000,
            category: selectedCategory,
          })
        : await getStoreList({
            lat,
            lng,
            radiusMeters: 5000,
          });

      console.log('지도 드래그 - API 응답 데이터 개수:', storeResponse.data.length);

      const convertedPlatforms = storeResponse.data
        .map((storeData) => convertStoreDataToPlatform(storeData, lat, lng))
        .filter((platform): platform is Platform => platform !== null);

      // 모든 가맹점 (좌표 없는 것도 포함) - 리스트용
      const allPlatforms = storeResponse.data.map((storeData) => {
        const platform = convertStoreDataToPlatform(storeData, lat, lng);
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

      console.log('지도 드래그 - 마커용 플랫폼 개수:', convertedPlatforms.length);
      console.log('지도 드래그 - 전체 플랫폼 개수:', allPlatforms.length);
      setPlatforms(allPlatforms);
    } catch (error) {
      console.error('지도 위치 업데이트 실패:', error);
    }
  };

  // 카테고리 필터링 함수
  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
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
  };
};
