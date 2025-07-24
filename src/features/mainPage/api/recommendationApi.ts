import api from '../../../apis/axiosInstance';
import { RecommendationResponse } from '../types/api';

/**
 * AI 추천 목록 조회
 */
export const getRecommendations = async (): Promise<RecommendationResponse> => {
  const response = await api.get('/api/v1/recommendations');
  return response.data;
};