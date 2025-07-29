import api from '../../../apis/axiosInstance';
import { RecommendationResponse } from '../types/api';

// 전역 중복 호출 방지
let isGlobalRecommendationsLoading = false;

/**
 * AI 추천 목록 조회
 */
export const getRecommendations = async (): Promise<RecommendationResponse> => {
  // 전역 중복 호출 방지 - 100ms 후 재시도
  if (isGlobalRecommendationsLoading) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getRecommendations(); // 재귀 호출로 재시도
  }

  isGlobalRecommendationsLoading = true;
  try {
    const response = await api.get('/api/v1/recommendations');
    return response.data;
  } finally {
    isGlobalRecommendationsLoading = false;
  }
};
