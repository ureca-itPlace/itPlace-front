import { useFavorites } from '../../features/myPage/hooks/useFavorites';
import { Pagination } from '../../components/common';
import BenefitFilterToggle from '../../components/common/BenefitFilterToggle';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/Modal';
import NoResult from '../../components/NoResult';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';
import BenefitDetailTabs from '../../features/myPage/components/BenefitDetailTabs';
import BenefitCardList from '../../features/myPage/components/BenefitCardList';
import EditControls from '../../features/myPage/components/EditControls';
import MyPageContentLayout from '../../features/myPage/layout/MyPageContentLayout';

export default function MyFavoritesPage() {
  const {
    favorites,
    filteredFavorites,
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
  } = useFavorites();

  return (
    <>
      <MyPageContentLayout
        // ✨ MainContent 영역
        main={
          <div className="flex-shrink-0">
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
                backgroundColor="#f5f5f5"
              />
            </div>

            {/* ✨ 편집/전체선택 컨트롤을 컴포넌트로 분리 */}
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
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setPendingDeleteId(null);
              }}
              title="선택한 혜택을 삭제하시겠습니까?"
              message="삭제하신 혜택은 다시 복구할 수 없습니다."
              buttons={[
                {
                  label: '아니오',
                  type: 'secondary',
                  onClick: () => {
                    setIsDeleteModalOpen(false);
                    setPendingDeleteId(null);
                  },
                },
                {
                  label: '삭제하기',
                  type: 'primary',
                  onClick: () => {
                    if (pendingDeleteId !== null) {
                      handleRemoveFavorite(pendingDeleteId);
                    } else {
                      handleDeleteSelected();
                    }
                    setIsDeleteModalOpen(false);
                    setPendingDeleteId(null);
                  },
                },
              ]}
            />

            {/* 카드 리스트 */}
            <div className="flex flex-col flex-grow">
              {favorites.length === 0 ? (
                <div className="mt-28">
                  <NoResult
                    message1="찜 보관함이 텅 비었어요!"
                    message2="마음에 드는 혜택을 찜해보세요."
                    buttonText="전체 혜택 보러가기"
                    buttonRoute="/benefits"
                  />
                </div>
              ) : currentItems.length === 0 ? (
                <div className="mt-28">
                  <NoResult />
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
            </div>

            {/* 페이지네이션 */}
            <div className="mt-auto relativ flex justify-center items-end">
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredFavorites.length}
                onPageChange={handlePageChange}
                width={37}
              />
              {/* 편집 모드에서 나오는 버튼 */}
              {currentItems.length > 0 && isEditing && (
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
          </div>
        }
        // ✨ RightAside 영역
        aside={
          favorites.length === 0 ? (
            <>
              <h1 className="text-title-2 text-black mb-4 text-center">선택한 혜택</h1>
              <div className="flex flex-col items-center justify-center mt-20">
                <img
                  src="/images/myPage/icon-nothing.webp"
                  alt="텅빈 찜 보관함"
                  className="w-[300px] h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/myPage/icon-nothing.png';
                  }}
                />
                <p className="text-grey05 text-body-0 mt-5">찜 보관함이 텅 비었어요!</p>
              </div>
            </>
          ) : isEditing ? (
            <FadeWrapper changeKey={selectedItems.length}>
              <h1 className="text-title-2 text-black mb-4 text-center">선택한 혜택</h1>
              <div className="flex flex-col items-center justify-center mt-7">
                <img
                  src="/images/myPage/icon-file.webp"
                  alt="폴더"
                  className="w-[185px] h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/myPage/icon-file.png';
                  }}
                />
                <div className="flex justify-center items-baseline">
                  <p className="text-[96px] font-bold text-orange04 mt-3">{selectedItems.length}</p>
                  <p className="text-title-1 text-grey05 ml-2">개</p>
                </div>
              </div>
            </FadeWrapper>
          ) : (
            <FadeWrapper changeKey={selectedId}>
              {selectedId ? (
                <>
                  <h1 className="text-title-2 text-black mb-5 text-center">상세 혜택</h1>
                  <BenefitDetailTabs
                    benefitId={selectedId}
                    image={favorites.find((f) => f.benefitId === selectedId)?.image ?? ''}
                    name={favorites.find((f) => f.benefitId === selectedId)?.benefitName ?? ''}
                  />
                </>
              ) : (
                <p className="text-grey05">카드를 선택하면 상세 혜택이 표시됩니다.</p>
              )}
            </FadeWrapper>
          )
        }
        bottomImage="/images/myPage/bunny-favorites.webp"
        bottomImageAlt="찜한 혜택 토끼"
        bottomImageFallback="/images/myPage/bunny-favorites.png"
      />
    </>
  );
}
