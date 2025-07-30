import axiosInstance from '../../../apis/axiosInstance';
import { FavoritesListRequest, FavoriteBenefit } from '../types/api';

// 전역 중복 호출 방지
let isGlobalFavoritesLoading = false;
let lastFavoritesParams: string | null = null;

export const getFavoritesList = async (
  params: FavoritesListRequest
): Promise<FavoriteBenefit[]> => {
  const paramsKey = JSON.stringify(params);

  // 전역 중복 호출 방지 - 같은 파라미터로 이미 로딩 중이면 대기
  if (isGlobalFavoritesLoading && lastFavoritesParams === paramsKey) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getFavoritesList(params); // 재귀 호출로 재시도
  }

  isGlobalFavoritesLoading = true;
  lastFavoritesParams = paramsKey;

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
  } finally {
    isGlobalFavoritesLoading = false;
    lastFavoritesParams = null;
  }
};
