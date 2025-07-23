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

  return radiusMap[mapLevel] || 1000; // 기본값 1km
};
