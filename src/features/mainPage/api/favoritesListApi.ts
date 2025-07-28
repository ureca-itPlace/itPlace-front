import axiosInstance from '../../../apis/axiosInstance';
import { FavoritesListRequest, FavoriteBenefit } from '../types/api';

export const getFavoritesList = async (
  params: FavoritesListRequest
): Promise<FavoriteBenefit[]> => {
  try {
    console.log('[getFavoritesList] API 호출 시작 - params:', params);
    const response = await axiosInstance.get('/api/v1/favorites/search', {
      params: {
        ...(params.category && params.category !== '전체' && { category: params.category }),
      },
    });
    console.log('[getFavoritesList] API 호출 완료 - 결과:', response.data.data.length, '개');
    return response.data.data;
  } catch (error) {
    console.error('즐겨찾기 목록 조회 실패:', error);
    throw error;
  }
};
