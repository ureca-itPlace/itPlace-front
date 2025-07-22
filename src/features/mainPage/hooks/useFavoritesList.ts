import { useState, useEffect } from 'react';
import { FavoriteBenefit, FavoritesListRequest } from '../types/api';
import { FAVORITES_PAGE_SIZE, FAVORITES_DEFAULT_PAGE } from '../constants';
import { getFavoritesList } from '../api/favoritesListApi';

export const useFavoritesList = (category?: string) => {
  const [favorites, setFavorites] = useState<FavoriteBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const fetchFavorites = async (selectedCategory?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const params: FavoritesListRequest = {
        page: FAVORITES_DEFAULT_PAGE,
        size: FAVORITES_PAGE_SIZE,
      };

      // 전체가 아닌 경우에만 category 파라미터 추가
      if (selectedCategory && selectedCategory !== '전체') {
        params.category = selectedCategory;
      }

      // 실제 API 호출
      const response = await getFavoritesList(params);

      setFavorites(response.data.content);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setHasNext(response.data.hasNext);
    } catch (err) {
      console.error('즐겨찾기 목록 조회 오류:', err);
      setError('즐겨찾기 목록을 불러올 수 없습니다.');
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 변경될 때마다 API 호출
  useEffect(() => {
    fetchFavorites(category);
  }, [category]);

  return {
    favorites,
    isLoading,
    error,
    totalElements,
    totalPages,
    currentPage,
    hasNext,
    refreshFavorites: () => fetchFavorites(category),
  };
};
