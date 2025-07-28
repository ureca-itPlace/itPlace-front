import { useEffect, useCallback, useRef, useState } from 'react';
import { FavoriteBenefit, FavoritesListRequest } from '../types/api';
import { getFavoritesList } from '../api/favoritesListApi';
import { useApiCall } from './useApiCall';

/**
 * 즐겨찾기 목록 관리 훅
 * 카테고리별 즐겨찾기 조회 및 새로고침 기능 제공
 */
export const useFavoritesList = (category?: string) => {
  const { data: favorites, isLoading, error, execute } = useApiCall<FavoriteBenefit[]>([]);

  // 함수 참조를 ref로 저장 (의존성 배열 최적화)
  const executeRef = useRef(execute);
  executeRef.current = execute;

  /**
   * 즐겨찾기 목록 조회
   * 카테고리가 '전체'이거나 비어있으면 전체 조회, 그 외에는 카테고리별 조회
   */
  const fetchFavorites = useCallback(async (selectedCategory?: string) => {
    const params: FavoritesListRequest = {};

    // 카테고리 필터링 설정
    if (selectedCategory && selectedCategory !== '전체') {
      params.category = selectedCategory;
    }

    const data = await getFavoritesList(params);
    return data;
  }, []);

  // fetchFavorites 참조를 ref로 저장 (의존성 배열 최적화)
  const fetchFavoritesRef = useRef(fetchFavorites);
  fetchFavoritesRef.current = fetchFavorites;

  // 초기 로드 상태 관리 (nearby 방식과 완전히 동일)
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isInitialLoadRef = useRef(isInitialLoad);
  isInitialLoadRef.current = isInitialLoad;

  // 카테고리 변경 시 즐겨찾기 목록 재로드 (nearby 패턴과 동일)
  useEffect(() => {
    if (category !== undefined) {
      const loadFavorites = async () => {
        const data = await fetchFavoritesRef.current(category);
        return data;
      };
      executeRef.current(loadFavorites);
    }
  }, [category]);

  // 초기 로드 완료 감지
  useEffect(() => {
    if (category !== undefined && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [category, isInitialLoad]);

  // 카테고리 변경 시에만 실행 (초기 로드 제외)
  useEffect(() => {
    if (isInitialLoadRef.current || category === undefined) {
      return;
    }

    const reloadByCategory = async () => {
      const data = await fetchFavoritesRef.current(category);
      return data;
    };

    executeRef.current(reloadByCategory);
  }, [category]);

  /**
   * 즐겨찾기 목록 새로고침
   */
  const refreshFavorites = useCallback(() => {
    if (category !== undefined) {
      executeRef.current(() => fetchFavoritesRef.current(category));
    }
  }, [category]);

  return {
    favorites: favorites || [], // null 방어
    isLoading,
    error,
    refreshFavorites,
  };
};
