import { StoreData } from '../types/api';
import { Platform } from '../types';

/**
 * API 응답 데이터를 Platform 타입으로 변환
 */
export const convertStoreDataToPlatform = (
  storeData: StoreData,
  userLat: number,
  userLng: number
): Platform => {
  const { store, partner, tierBenefit } = storeData;

  // 거리 계산 (단순 계산 - 실제로는 더 정확한 계산 필요)
  const distance = calculateDistance(userLat, userLng, 37.5665, 126.978); // 임시 좌표

  // 혜택 정보를 문자열 배열로 변환
  const benefits = tierBenefit.map((benefit) => `${benefit.grade}: ${benefit.context}`);

  return {
    id: store.storeId.toString(),
    name: store.storeName,
    category: partner.category,
    address: store.roadAddress || store.address,
    latitude: 37.5665, // 실제로는 API에서 좌표 정보를 받아와야 함
    longitude: 126.978, // 실제로는 API에서 좌표 정보를 받아와야 함
    benefits: benefits,
    rating: 4.5, // 기본값 (API에 평점 정보가 있다면 사용)
    distance: Math.round(distance * 10) / 10, // 소수점 첫째 자리까지
    imageUrl: partner.image,
  };
};

/**
 * 두 좌표 사이의 거리 계산 (하버사인 공식)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
