import axiosInstance from '../../../apis/axiosInstance';
import { FavoritesListRequest, FavoriteBenefit } from '../types/api';

export const getFavoritesList = async (
  params: FavoritesListRequest
): Promise<FavoriteBenefit[]> => {
  try {
    const response = await axiosInstance.get('/api/v1/favorites/search', {
      params: {
        ...(params.category && params.category !== '전체' && { category: params.category }),
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('즐겨찾기 목록 조회 실패:', error);
    throw error;
  }
};
