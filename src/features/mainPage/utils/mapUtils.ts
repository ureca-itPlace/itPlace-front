/**
 * 지도 관련 유틸리티 함수들
 */

/**
 * 맵 레벨에 따른 검색 반경 계산
 * 지도 확대/축소 레벨에 따라 적절한 검색 반경을 반환
 * @param mapLevel 지도 레벨 (1: 최대확대 ~ 14: 최대축소)
 * @returns 검색 반경(미터)
 */
export const getRadiusByMapLevel = (mapLevel: number): number => {
  // 맵 레벨이 작을수록(확대) 작은 반경, 클수록(축소) 큰 반경
  const radiusMap: { [key: number]: number } = {
    1: 100, // 최대 확대 - 500m
    2: 300, // 0.1km (기본값)
    3: 500, // 0.2km
    4: 1000, // 0.3km
    5: 2000, // 0.5km
    6: 3000, // 0.7km
    7: 4000, // 1km
    8: 5000, // 1km
    9: 6000, // 2km
    10: 7000, // 3km
    11: 8000, // 5km
    12: 9000, // 7km
    13: 10000, // 10km
    14: 12000, // 15km - 최대 축소
  };

  return radiusMap[mapLevel] || 50; // 기본값 1km
};
