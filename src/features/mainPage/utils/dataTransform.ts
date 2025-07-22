import { Platform } from '../types';
import { StoreData } from '../types/api';
import { convertStoreDataToPlatform, createPlatformWithoutCoords } from './storeUtils';

/**
 * 데이터 변환 관련 유틸리티 함수들
 */

/**
 * API 응답 데이터를 Platform 배열로 변환
 * 좌표가 있는 데이터와 없는 데이터 모두 처리
 * @param storeDataList API에서 받은 스토어 데이터 배열
 * @param centerLat 중심 위도 (거리 계산용)
 * @param centerLng 중심 경도 (거리 계산용)
 * @returns Platform 배열
 */
export const transformStoreDataToPlatforms = (
  storeDataList: StoreData[],
  centerLat: number,
  centerLng: number
): Platform[] => {
  return storeDataList.map((storeData) => {
    const platform = convertStoreDataToPlatform(storeData, centerLat, centerLng);
    return platform ?? createPlatformWithoutCoords(storeData);
  });
};