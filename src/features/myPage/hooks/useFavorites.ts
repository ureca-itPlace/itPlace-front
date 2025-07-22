// src/features/myPage/hooks/useFavorites.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchFavorites, deleteFavorites } from '../apis/favorites';
import { FavoriteItem } from '../../../types/favorites';
import { showToast } from '../../../utils/toast';

/**
 * 즐겨찾기 상태 및 로직을 관리하는 훅
 * - category 파라미터를 통해 기본혜택/VIP콕 구분
 * - 검색은 프론트에서 필터링
 */
export function useFavorites(itemsPerPageInit = 6) {
  // ✅ API로부터 받은 원본 목록
  const [allFavorites, setAllFavorites] = useState<FavoriteItem[]>([]);

  // ✅ 현재 선택된 카드
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ VIP콕/기본혜택 필터
  const [benefitFilter, setBenefitFilter] = useState<'default' | 'vipkok'>('default');

  // ✅ 검색어
  const [keyword, setKeyword] = useState('');

  // ✅ 편집 모드
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // ✅ 삭제 모달 관련
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ✅ 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(itemsPerPageInit);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ 전체 아이템 수 상태
  const [totalElements, setTotalElements] = useState(0);

  /**
   * 카테고리 파라미터로 API 호출
   */
  const loadFavorites = useCallback(async () => {
    try {
      const category = benefitFilter === 'vipkok' ? 'VIP 콕' : '기본 혜택';
      const res = await fetchFavorites(category, currentPage - 1, itemsPerPage);
      setAllFavorites(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements); // ✅ 전체 개수 상태 추가
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('즐겨찾기 목록 불러오기 실패', err);
      setAllFavorites([]);
      setTotalPages(1);
      setTotalElements(0); // ✅ 에러 시 0으로 초기화
    }
  }, [benefitFilter, currentPage, itemsPerPage]);

  // ✅ currentPage, benefitFilter가 바뀔 때마다 서버 호출
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // ✅ 검색 로직 (프론트에서 필터링)
  const searchedFavorites = useMemo(() => {
    if (!keyword.trim()) return allFavorites;
    return allFavorites.filter((fav) =>
      fav.benefitName.toLowerCase().includes(keyword.trim().toLowerCase())
    );
  }, [allFavorites, keyword]);

  useEffect(() => {
    // 검색 모드일 땐 클라이언트 기준 totalElements
    if (keyword.trim()) {
      setTotalElements(searchedFavorites.length);
      setTotalPages(Math.max(1, Math.ceil(searchedFavorites.length / itemsPerPage)));
    }
  }, [keyword, searchedFavorites, itemsPerPage]);

  // ✅ currentItems는 slice 안 함 (서버가 이미 페이지 단위로 내려줌)
  const currentItems = searchedFavorites;

  // ✅ 페이지 변경 시
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 현재 페이지의 첫 번째 아이템 선택
    const newFirst = searchedFavorites[0];
    setSelectedId(newFirst ? newFirst.benefitId : null);
  };

  // ✅ 필터나 검색 변경 시 1페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [benefitFilter, keyword]);

  // ✅ 목록이 갱신될 때 첫 번째 아이템 선택
  useEffect(() => {
    if (searchedFavorites.length > 0) {
      setSelectedId(searchedFavorites[0].benefitId);
    } else {
      setSelectedId(null);
    }
  }, [searchedFavorites]);

  // ✅ 단일 삭제
  const handleRemoveFavorite = async (benefitId: number) => {
    try {
      await deleteFavorites([benefitId]); // ✅ API 호출
      showToast('삭제에 성공했습니다.', 'success'); // ✅ 토스트 알림
      await loadFavorites(); // ✅ 목록 리로드 (삭제 반영)
    } catch (e) {
      console.error('단일 즐겨찾기 삭제 실패', e);
      showToast('삭제에 실패했습니다.', 'error'); // ❌ 에러 시 토스트
    }
  };

  // ✅ 다중 삭제
  const handleDeleteSelected = async () => {
    try {
      await deleteFavorites(selectedItems); // ✅ 선택된 항목 모두 삭제
      showToast('삭제에 성공했습니다.', 'success'); // ✅ 토스트 알림
      setSelectedItems([]);
      setIsEditing(false);
      await loadFavorites(); // ✅ 목록 리로드
    } catch (e) {
      console.error('다중 즐겨찾기 삭제 실패', e);
      showToast('삭제에 실패했습니다.', 'error'); // ❌ 에러 시 토스트
    }
  };

  return {
    // 상태
    currentItems,
    currentPage,
    itemsPerPage,
    totalPages,
    selectedId,
    benefitFilter,
    keyword,
    isEditing,
    selectedItems,
    pendingDeleteId,
    isDeleteModalOpen,
    allFavorites,
    totalElements,

    // 상태 변경 함수
    setSelectedId,
    setBenefitFilter,
    setKeyword,
    setIsEditing,
    setSelectedItems,
    setPendingDeleteId,
    setIsDeleteModalOpen,

    // 로직
    handlePageChange,
    handleRemoveFavorite,
    handleDeleteSelected,
  };
}
