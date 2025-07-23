import { useFavorites } from '../../features/myPage/hooks/useFavorites';
import { LoadingSpinner, Pagination } from '../../components';
import BenefitFilterToggle from '../../components/BenefitFilterToggle';
import SearchBar from '../../components/SearchBar';
import NoResult from '../../components/NoResult';
import BenefitCardList from '../../features/myPage/components/Favorites/BenefitCardList';
import EditControls from '../../features/myPage/components/Favorites/EditControls';
import MyPageContentLayout from '../../features/myPage/layout/MyPageContentLayout';
import FavoritesDeleteModal from '../../features/myPage/components/Favorites/FavoritesDeleteModal';
import FavoritesAside from '../../features/myPage/components/Favorites/FavoritesAside';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function MyFavoritesPage() {
  const {
    loading,
    allFavorites,
    totalElements,
    currentItems,
    selectedId,
    setSelectedId,
    benefitFilter,
    setBenefitFilter,
    keyword,
    setKeyword,
    isEditing,
    setIsEditing,
    selectedItems,
    setSelectedItems,
    pendingDeleteId,
    setPendingDeleteId,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleRemoveFavorite,
    handleDeleteSelected,
    handlePageChange,
    itemsPerPage,
    currentPage,
  } = useFavorites(6);

  const userGrade = useSelector((state: RootState) => state.auth.user?.membershipGrade);

  return (
    <>
      <MyPageContentLayout
        // ✨ MainContent 영역

        main={
          <div className="flex flex-col flex-1 h-full">
            {/* 상단 타이틀 */}
            <h1 className="text-title-2 text-black mb-7">찜한 혜택</h1>
            {/* 토글 + 검색 */}
            <div className="flex justify-between mb-[-10px]">
              <BenefitFilterToggle
                value={benefitFilter}
                onChange={setBenefitFilter}
                width="w-[300px]"
                fontSize="text-title-7"
              />
              <SearchBar
                placeholder="제휴처명으로 검색하기"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onClear={() => setKeyword('')}
                width={280}
                height={50}
                backgroundColor="bg-grey01"
              />
            </div>
            {/* 편집/전체선택 컨트롤 */}
            {currentItems.length > 0 && (
              <EditControls
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                currentItems={currentItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            )}
            {/* 모달 */}
            <FavoritesDeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setPendingDeleteId(null);
              }}
              onConfirm={() => {
                if (pendingDeleteId !== null) {
                  handleRemoveFavorite(pendingDeleteId);
                } else {
                  handleDeleteSelected();
                }
                setIsDeleteModalOpen(false);
                setPendingDeleteId(null);
              }}
            />
            {/* 카드 리스트 */}
            {/* 검색 결과가 없을 때는 "검색 결과 없음" 표시
            검색어가 없고 목록도 없을 때는 "찜한 혜택이 없음" 표시 */}
            {loading ? (
              // 로딩 중
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
              </div>
            ) : keyword.trim() ? (
              currentItems.length === 0 ? (
                <div className="mt-28">
                  <NoResult message1="검색 결과가 없어요." message2="다른 키워드로 검색해보세요." />
                </div>
              ) : (
                <BenefitCardList
                  items={currentItems}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  isEditing={isEditing}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  onRemove={handleRemoveFavorite}
                  onRequestDelete={(id: number) => {
                    setPendingDeleteId(id);
                    setIsDeleteModalOpen(true);
                  }}
                />
              )
            ) : allFavorites.length === 0 ? (
              <div className="mt-28">
                <NoResult
                  message1="찜 보관함이 텅 비었어요!"
                  message2="마음에 드는 혜택을 찜해보세요."
                  buttonText="전체 혜택 보러가기"
                  buttonRoute="/benefits"
                />
              </div>
            ) : (
              <BenefitCardList
                items={currentItems}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                isEditing={isEditing}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                onRemove={handleRemoveFavorite}
                onRequestDelete={(id: number) => {
                  setPendingDeleteId(id);
                  setIsDeleteModalOpen(true);
                }}
              />
            )}

            {/* 페이지네이션 */}
            {!(
              (keyword.trim() && currentItems.length === 0) || // 검색 중이고 결과가 0
              (!keyword.trim() && allFavorites.length === 0) // 검색 안 했는데 전체도 0
            ) && (
              <div className="mt-auto relative flex justify-center items-end">
                <Pagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalElements}
                  onPageChange={handlePageChange}
                  width={37}
                />
                {isEditing && (
                  <div className="absolute right-[56px] flex gap-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedItems([]);
                      }}
                      className="px-4 py-2 rounded-[16px] bg-grey01 hover:bg-grey02 text-title-8 text-grey04"
                    >
                      편집 취소
                    </button>
                    <button
                      onClick={() => {
                        setPendingDeleteId(null);
                        setIsDeleteModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-[16px] bg-purple04 hover:bg-purple05 text-title-8 text-white"
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        }
        // ✨ RightAside 영역
        aside={
          <FavoritesAside
            favorites={allFavorites}
            isEditing={isEditing}
            selectedItems={selectedItems}
            selectedId={selectedId}
            userGrade={userGrade}
            loading={loading}
          />
        }
        bottomImage="/images/myPage/bunny-favorites.webp"
        bottomImageAlt="찜한 혜택 토끼"
        bottomImageFallback="/images/myPage/bunny-favorites.png"
      />
    </>
  );
}
