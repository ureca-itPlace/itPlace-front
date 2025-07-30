import { Platform } from '../types';
import { StoreData } from '../types/api';
import { convertStoreDataToPlatform, createPlatformWithoutCoords } from './storeUtils';

/**
 * 데이터 변환 관련 유틸리티 함수들
 */

/**
 * API 응답 데이터를 Platform 배열로 변환
 * 좌표가 있는 데이터와 없는 데이터 모두 처리
 * API에서 제공하는 거리 정보를 사용
 * @param storeDataList API에서 받은 스토어 데이터 배열
 * @returns Platform 배열
 */
export const transformStoreDataToPlatforms = (storeDataList: StoreData[]): Platform[] => {
  return storeDataList.map((storeData) => {
    const platform = convertStoreDataToPlatform(storeData);
    return platform ?? createPlatformWithoutCoords(storeData);
  });
};
