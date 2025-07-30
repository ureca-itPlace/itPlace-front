import { StoreData } from '../types/api';
import { Platform } from '../types';
import { GRADE_ORDER } from '../constants';

/**
 * API 응답 데이터를 Platform 타입으로 변환
 * 좌표가 없는 경우 null 반환 (필터링됨)
 */
export const convertStoreDataToPlatform = (storeData: StoreData): Platform | null => {
  const { store, partner, tierBenefit, distance } = storeData;

  // 좌표가 없으면 null 반환 (마커 표시 안함)
  if (!store.latitude || !store.longitude) {
    console.warn(`좌표 정보 없음 - ${store.storeName} 제외`);
    return null;
  }

  // 모든 등급에 대해 혜택 정보 생성 (없으면 '-')
  const benefits = GRADE_ORDER.map((grade) => {
    const benefit = tierBenefit.find((b) => b.grade === grade);
    return benefit ? `${grade}: ${benefit.context}` : `${grade}: -`;
  });

  return {
    id: store.storeId.toString(),
    storeId: store.storeId,
    partnerId: partner.partnerId,
    name: store.storeName,
    category: partner.category,
    business: store.business,
    city: store.city,
    town: store.town,
    legalDong: store.legalDong,
    address: store.address,
    roadName: store.roadName,
    roadAddress: store.roadAddress,
    postCode: store.postCode,
    latitude: store.latitude,
    longitude: store.longitude,
    benefits: benefits,
    rating: 4.5,
    distance: distance, // API에서 제공하는 거리 값 사용
    imageUrl: partner.image,
  };
};

/**
 * 좌표가 없는 경우를 위한 기본 Platform 객체 생성
 */
export const createPlatformWithoutCoords = (storeData: StoreData): Platform => {
  const { store, partner, tierBenefit, distance } = storeData;

  const benefits = GRADE_ORDER.map((grade) => {
    const benefit = tierBenefit.find((b) => b.grade === grade);
    return benefit ? `${grade}: ${benefit.context}` : `${grade}: -`;
  });

  return {
    id: store.storeId.toString(),
    storeId: store.storeId,
    partnerId: partner.partnerId,
    name: store.storeName,
    category: partner.category,
    business: store.business,
    city: store.city,
    town: store.town,
    legalDong: store.legalDong,
    address: store.address,
    roadName: store.roadName,
    roadAddress: store.roadAddress,
    postCode: store.postCode,
    latitude: 0, // 마커 표시 안됨을 나타내는 값
    longitude: 0,
    benefits: benefits,
    rating: 4.5,
    distance: distance, // API에서 제공하는 거리 값 사용
    imageUrl: partner.image,
  };
};
