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
 * 150개 이상일 때 랜덤 샘플링으로 성능 최적화
 * @param storeDataList API에서 받은 스토어 데이터 배열
 * @returns Platform 배열
 */
export const transformStoreDataToPlatforms = (storeDataList: StoreData[]): Platform[] => {
  // 150개 이상일 때 랜덤 샘플링 적용
  const maxItems = 150;
  let dataToProcess = storeDataList;

  if (storeDataList.length > maxItems) {
    // Fisher-Yates 셔플 알고리즘으로 랜덤 샘플링
    const shuffled = [...storeDataList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    dataToProcess = shuffled.slice(0, maxItems);

    console.log(`데이터가 ${storeDataList.length}개로 많아 ${maxItems}개로 랜덤 샘플링했습니다.`);
  }

  return dataToProcess.map((storeData) => {
    const platform = convertStoreDataToPlatform(storeData);
    return platform ?? createPlatformWithoutCoords(storeData);
  });
};
