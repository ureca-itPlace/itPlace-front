// src/features/myPage/hooks/useFavorites.ts
import { useState, useEffect } from 'react';
import { mockFavorites, mockTierBenefits } from '../mock/mockData';

/**
 * FavoriteItem 타입 정의
 */
export interface FavoriteItem {
  benefitId: number;
  benefitName: string;
  image: string;
}

/**
 * 즐겨찾기 상태 및 로직을 관리하는 커스텀 훅
 * 초기 즐겨찾기 목록 (mock 데이터로 기본값 설정)
 */
export function useFavorites(initial: FavoriteItem[] = mockFavorites) {
  // ✅ 즐겨찾기 목록 상태
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initial);

  // ✅ 현재 선택된 카드의 benefitId (우측 상세보기용)
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ VIP콕 / 기본 혜택 필터
  const [benefitFilter, setBenefitFilter] = useState<'default' | 'vipkok'>('default');

  // ✅ 검색어 상태
  const [keyword, setKeyword] = useState('');

  // ✅ 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);

  // ✅ 편집 모드에서 선택된 아이템 목록
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // ✅ 단일 삭제용(별 버튼)으로 선택된 benefitId
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // ✅ 삭제 확인 모달 열림 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // =============================
  // 🔎 검색어와 필터를 적용한 결과
  // =============================

  // 1. 검색어 필터링
  const searchFiltered = favorites.filter((fav) =>
    fav.benefitName.toLowerCase().includes(keyword.toLowerCase())
  );

  // 2. VIP콕 / 기본 혜택 필터링
  const filteredFavorites = searchFiltered.filter((fav) => {
    const isVipKok = mockTierBenefits.some(
      (tier) => tier.benefitId === fav.benefitId && tier.grade === 'VIP콕'
    );
    return benefitFilter === 'vipkok' ? isVipKok : !isVipKok;
  });

  // =============================
  // 📄 페이지네이션
  // =============================
  const itemsPerPage = 6; // 한 페이지에 보여줄 개수
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 보여줄 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFavorites.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 이벤트
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지가 바뀔 때 첫 번째 아이템 자동 선택
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const newFirst = favorites[startIndex];
    setSelectedId(newFirst ? newFirst.benefitId : null);
  };

  // =============================
  // ✅ 첫 로드시 목록 중 첫번째 기본 선택
  // =============================
  useEffect(() => {
    if (favorites.length > 0 && selectedId === null) {
      setSelectedId(favorites[0].benefitId);
    }
  }, [favorites, selectedId]);

  // =============================
  // ❌ 단일 즐겨찾기 해제
  // =============================
  const handleRemoveFavorite = (benefitId: number) => {
    const updated = favorites.filter((item) => item.benefitId !== benefitId);
    setFavorites(updated);

    // 선택된 카드가 삭제된 경우 첫 번째 아이템으로 변경
    if (selectedId === benefitId) {
      setSelectedId(updated.length > 0 ? updated[0].benefitId : null);
    }
  };

  // =============================
  // ❌ 여러개 즐겨찾기 해제 (추후 구현)
  // =============================
  const handleDeleteSelected = () => {
    console.log('즐겨찾기 여러개 삭제 로직을 여기에 작성하면 됨.');
  };

  // =============================
  // 💡 훅에서 반환
  // =============================
  return {
    // 상태
    favorites,
    filteredFavorites,
    currentItems,
    selectedId,
    benefitFilter,
    keyword,
    isEditing,
    selectedItems,
    pendingDeleteId,
    isDeleteModalOpen,
    currentPage,
    itemsPerPage,

    // 상태 변경 함수
    setSelectedId,
    setBenefitFilter,
    setKeyword,
    setIsEditing,
    setSelectedItems,
    setPendingDeleteId,
    setIsDeleteModalOpen,

    // 로직 함수
    handlePageChange,
    handleRemoveFavorite,
    handleDeleteSelected,
  };
}
