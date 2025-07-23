import axiosInstance from '../../../apis/axiosInstance';
import { FavoriteRequest, FavoriteResponse } from '../types/api';

// 즐겨찾기 추가 API
export const addFavorite = async (benefitId: number): Promise<FavoriteResponse> => {
  try {
    const requestBody: FavoriteRequest = { benefitId };
    const response = await axiosInstance.post('/api/v1/favorites', requestBody);
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 추가 실패:', error);
    throw error;
  }
};

// 즐겨찾기 삭제 API
export const removeFavorite = async (benefitIds: number[]): Promise<FavoriteResponse> => {
  try {
    const requestBody = { benefitIds };
    const response = await axiosInstance.delete('/api/v1/favorites', { data: requestBody });
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 삭제 실패:', error);
    throw error;
  }
};
