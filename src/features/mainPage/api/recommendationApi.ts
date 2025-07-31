import api from '../../../apis/axiosInstance';
import { RecommendationResponse } from '../types/api';

// 전역 중복 호출 방지
let isGlobalRecommendationsLoading = false;
let recommendationsPromise: Promise<RecommendationResponse> | null = null;

/**
 * AI 추천 목록 조회
 */
export const getRecommendations = async (): Promise<RecommendationResponse> => {
  // 이미 진행 중인 요청이 있으면 그 결과를 반환
  if (recommendationsPromise) {
    return recommendationsPromise;
  }

  // 전역 중복 호출 방지 - 100ms 후 재시도
  if (isGlobalRecommendationsLoading) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getRecommendations(); // 재귀 호출로 재시도
  }

  isGlobalRecommendationsLoading = true;

  recommendationsPromise = (async () => {
    try {
      const response = await api.get('/api/v1/recommendations');
      return response.data;
    } finally {
      isGlobalRecommendationsLoading = false;
      // 요청 완료 후 1초 뒤에 Promise 캐시 초기화 (너무 빠른 재요청 방지)
      setTimeout(() => {
        recommendationsPromise = null;
      }, 1000);
    }
  })();

  return recommendationsPromise;
};
