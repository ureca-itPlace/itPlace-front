import api from '../../../apis/axiosInstance';
import {
  FavoritesListResponse,
  FavoriteDetailResponse,
  FavoriteSearchResponse,
} from '../../../types/favorites';

// 목록 조회 (카테고리, 페이지, 사이즈)
export async function fetchFavorites(category?: string, page = 0, size = 6) {
  const res = await api.get<FavoritesListResponse>('api/v1/favorites', {
    params: { category: category ?? undefined, page, size },
  });
  return res.data;
}

// 상세 조회
export async function fetchFavoriteDetail(benefitId: number) {
  const res = await api.get<FavoriteDetailResponse>(`api/v1/favorites/benefits/${benefitId}`);
  return res.data;
}

// 검색
export async function searchFavorites(keyword: string, category?: string) {
  const res = await api.get<FavoriteSearchResponse>('api/v1/favorites/search', {
    params: { keyword, category: category ?? undefined },
  });
  return res.data;
}

// 삭제 : 단일/다중 다 가능
export async function deleteFavorites(ids: number[]) {
  return api.delete('api/v1/favorites', {
    data: {
      benefitIds: ids, // 🔥 단일/다중 모두 배열로 전송
    },
  });
}
