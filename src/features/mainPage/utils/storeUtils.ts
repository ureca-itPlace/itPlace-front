import { StoreData } from '../types/api';
import { Platform } from '../types';

/**
 * API 응답 데이터를 Platform 타입으로 변환
 * 좌표가 없는 경우 null 반환 (필터링됨)
 */
export const convertStoreDataToPlatform = (
  storeData: StoreData,
  userLat: number,
  userLng: number
): Platform | null => {
  const { store, partner, tierBenefit } = storeData;

  // 좌표가 없으면 null 반환 (마커 표시 안함)
  if (!store.latitude || !store.longitude) {
    console.warn(`좌표 정보 없음 - ${store.storeName} 제외`);
    return null;
  }

  // 거리 계산 (실제 가맹점 좌표 사용)
  const distance = calculateDistance(userLat, userLng, store.latitude, store.longitude);

  // 모든 등급에 대해 혜택 정보 생성 (없으면 '-')
  const gradeOrder = ['VIP콕', 'BASIC', 'VIP', 'VVIP'];
  const benefits = gradeOrder.map(grade => {
    const benefit = tierBenefit.find(b => b.grade === grade);
    return benefit ? `${grade}: ${benefit.context}` : `${grade}: -`;
  });

  return {
    id: store.storeId.toString(),
    name: store.storeName,
    category: partner.category,
    address: store.roadAddress || store.address,
    latitude: store.latitude,
    longitude: store.longitude,
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
