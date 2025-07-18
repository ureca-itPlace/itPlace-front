import MainContentWrapper from '../../features/myPage/components/MainContentWrapper';
import RightAside from '../../features/myPage/components/RightAside';
import { TbStarFilled } from 'react-icons/tb';
//import api from '../../apis/axiosInstance';
import BenefitDetailTabs from '../../features/myPage/components/BenefitDetailTabs';
import { Pagination } from '../../components/common';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';
import BenefitFilterToggle from '../../components/common/BenefitFilterToggle';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/Modal';
import NoResult from '../../components/NoResult';
import { useFavorites } from '../../features/myPage/hooks/useFavorites';

export default function MyFavoritesPage() {
  // ✅ 커스텀 훅에서 모든 상태와 로직을 가져옴
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
      <MainContentWrapper>
        <div className="flex-shrink-0">
          {/* 상단 타이틀 */}
          <h1 className="text-title-2 text-black mb-7">찜한 혜택</h1>

          <div className="flex justify-between mb-[-10px]">
            {/* 토글 버튼 */}
            <BenefitFilterToggle
              value={benefitFilter}
              onChange={setBenefitFilter}
              width="w-[300px]"
              fontSize="text-title-7"
            />

            {/* 🔍 검색 바 */}
            <SearchBar
              placeholder="제휴처명으로 검색하기"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClear={() => setKeyword('')}
              width={280}
              height={50}
              backgroundColor="#f5f5f5" // ← grey01에 해당하는 HEX 코드
            />
          </div>

          {/* 편집 버튼 */}
          {currentItems.length > 0 && (
            <div className="flex items-center justify-end gap-3 mr-1 mb-1">
              {isEditing ? (
                <label className="flex items-center text-grey05 text-body-0-bold">
                  <input
                    type="checkbox"
                    className="mr-1 w-4 h-4 accent-purple04 appearance-none rounded-[4px] border border-grey03 checked:bg-[url('/images/myPage/icon-check.png')] bg-no-repeat bg-center checked:border-purple04"
                    checked={
                      selectedItems.length === filteredFavorites.length &&
                      filteredFavorites.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredFavorites.map((item) => item.benefitId));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                  전체 선택
                </label>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setSelectedItems([]);
                  }}
                  className="text-grey05 text-body-0-bold"
                >
                  편집
                </button>
              )}
            </div>
          )}

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
                    // ✅ 단일 삭제
                    handleRemoveFavorite(pendingDeleteId);
                  } else {
                    // ✅ 편집 모드에서 여러 개 삭제
                    handleDeleteSelected();
                  }
                  setIsDeleteModalOpen(false);
                  setPendingDeleteId(null);
                },
              },
            ]}
          />

          {/* 카드 리스트 + 페이지네이션 */}
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
              <div className="grid grid-cols-3 gap-x-12 gap-y-5 min-h-[520px]">
                {currentItems.map((item) => (
                  <div
                    key={item.benefitId}
                    onClick={() => {
                      if (isEditing) {
                        // 체크박스 토글
                        if (selectedItems.includes(item.benefitId)) {
                          setSelectedItems(selectedItems.filter((id) => id !== item.benefitId));
                        } else {
                          setSelectedItems([...selectedItems, item.benefitId]);
                        }
                      } else {
                        setSelectedId(item.benefitId); // 상세보기
                      }
                    }}
                    className={`relative p-4 border rounded-[18px] w-[220px] h-[240px] cursor-pointer border-none shadow-[0px_3px_12px_rgba(0,0,0,0.15)] ${
                      isEditing
                        ? selectedItems.includes(item.benefitId)
                          ? 'ring-2 ring-purple04'
                          : ''
                        : selectedId === item.benefitId
                          ? 'ring-2 ring-purple04'
                          : ''
                    }`}
                  >
                    {isEditing && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.benefitId)}
                        onChange={() => {}}
                        className="absolute top-5 right-5 w-5 h-5 accent-purple04 appearance-none rounded-md border border-grey03 checked:bg-[url('/images/myPage/icon-check.png')] bg-no-repeat bg-center checked:border-purple04"
                      />
                    )}
                    {/* 즐겨찾기 해제 버튼 (편집 모드일 때는 숨김) */}
                    {!isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDeleteId(item.benefitId); // 단일 삭제 ID 기억
                          setIsDeleteModalOpen(true);
                        }}
                        className="absolute top-5 right-5 text-orange03 hover:scale-110 transition-transform"
                        title="즐겨찾기 해제"
                      >
                        <TbStarFilled size={22} />
                      </button>
                    )}

                    <img
                      src={item.image}
                      alt={item.benefitName}
                      className="h-[108px] w-auto object-contain mx-auto mt-6"
                    />
                    <p className="text-grey05 text-title-5 text-center mt-4">{item.benefitName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ 페이지네이션 */}
          <div className="mt-auto relativ flex justify-center items-end">
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredFavorites.length}
              onPageChange={handlePageChange}
              width={37}
            />
            {currentItems.length > 0 && isEditing && (
              <div className="absolute right-[56px] flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedItems([]);
                  }}
                  className="px-4 py-2 rounded-[16px] bg-grey01 hover:bg-grey02 text-title-8 text-grey04 "
                >
                  편집 취소
                </button>
                <button
                  onClick={() => {
                    setPendingDeleteId(null); // ✅ 여러 개 삭제니까 단일 ID는 초기화
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
      </MainContentWrapper>

      <RightAside
        bottomImage="/images/myPage/bunny-favorites.webp"
        bottomImageAlt="찜한 혜택 토끼"
        bottomImageFallback="/images/myPage/bunny-favorites.png"
      >
        {favorites.length === 0 ? (
          // ✅ 찜한 혜택이 아예 없을 때 보여줄 RightAside 전용 UI
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
          // ✅ 편집모드 때 보여줄 RightAside 전용 UI
          <FadeWrapper changeKey={selectedItems.length}>
            <h1 className="text-title-2 text-black mb-4 text-center">선택한 혜택</h1>
            <div className="flex flex-col items-center justify-center mt-7">
              <img
                src="/images/myPage/icon-file.webp"
                alt="폴더"
                className="w-[185px] h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // 무한 루프 방지
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
        )}
      </RightAside>
    </>
  );
}
