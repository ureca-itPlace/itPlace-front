import axiosInstance from '../../../apis/axiosInstance';
import { FavoritesListRequest, FavoritesListResponse } from '../types/api';

export const getFavoritesList = async (
  params?: FavoritesListRequest
): Promise<FavoritesListResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.category && params.category !== '전체') {
      queryParams.append('category', params.category);
    }

    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }

    const url = `/api/v1/favorites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 목록 조회 실패:', error);
    throw error;
  }
};
