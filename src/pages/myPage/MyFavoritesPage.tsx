import { useEffect, useState } from 'react';
import MainContentWrapper from '../../features/myPage/components/MainContentWrapper';
import RightAside from '../../features/myPage/components/RightAside';
import { mockFavorites, mockTierBenefits } from '../../features/myPage/mock/mockData';
import { TbStarFilled } from 'react-icons/tb';
//import api from '../../apis/axiosInstance';
import BenefitDetailTabs from '../../features/myPage/components/BenefitDetailTabs';
import { Pagination } from '../../components/common';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';
import BenefitFilterToggle from '../../components/common/BenefitFilterToggle';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/Modal';

interface FavoriteItem {
  benefitId: number;
  benefitName: string;
  image: string;
}

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(mockFavorites);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [benefitFilter, setBenefitFilter] = useState<'default' | 'vipkok'>('default'); // 토글 필터링용 상태
  const [keyword, setKeyword] = useState(''); // 검색용 상태
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 검색어 기반 필터링
  const searchFiltered = favorites.filter((fav) =>
    fav.benefitName.toLowerCase().includes(keyword.toLowerCase())
  );

  // ✅ VIP콕 / 기본혜택 토글 필터링 리스트
  const filteredFavorites = searchFiltered.filter((fav) => {
    const isVipKok = mockTierBenefits.some(
      (tier) => tier.benefitId === fav.benefitId && tier.grade === 'VIP콕'
    );
    if (benefitFilter === 'vipkok') {
      return isVipKok;
    } else {
      return !isVipKok;
    }
  });

  // ✅ 페이지네이션 상태
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ 현재 페이지에 보여줄 데이터 slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFavorites.slice(indexOfFirstItem, indexOfLastItem);

  // ✅ 페이지 변경 이벤트
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 바뀌면 첫 번째 아이템 자동 선택
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const newFirst = favorites[startIndex];
    setSelectedId(newFirst ? newFirst.benefitId : null);
  };

  // ✅ 첫 로드시 기본 선택
  useEffect(() => {
    if (favorites.length > 0 && selectedId === null) {
      setSelectedId(favorites[0].benefitId);
    }
  }, [favorites, selectedId]);

  // ✅ 즐겨찾기 해제
  const handleRemoveFavorite = (benefitId: number) => {
    const updated = favorites.filter((item) => item.benefitId !== benefitId);
    setFavorites(updated);

    // 현재 선택된 카드였으면 첫 번째로 변경 or 해제
    if (selectedId === benefitId) {
      if (updated.length > 0) {
        setSelectedId(updated[0].benefitId);
      } else {
        setSelectedId(null);
      }
    }
  };

  const handleDeleteSelected = () => {
    console.log('즐겨 찾기 목록 삭제');

    // 🚨 API 연동 시
    // await api.delete(`/favorites/${userId}`, { data: { benefitIds: selectedItems } });
  };

  // 🚨 진입 시 즐겨찾기 목록 API 호출: API완성되면 주석 해제
  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       const res = await api.get(`/favorites/${mockUser.userId}`, {
  //         params: { page: 0, size: 6 },
  //       });
  //       const data = res.data.data;
  //       if (data?.content) {
  //         setFavorites(data.content);
  //         if (data.content.length > 0) {
  //           setSelectedId(data.content[0].benefitId); // 기본 첫 번째 선택
  //         }
  //       }
  //     } catch (err) {
  //       console.error('즐겨찾기 목록 조회 실패', err);
  //     }
  //   };

  //   fetchFavorites();
  // }, []);

  // 🚨 즐겨찾기 해제 API 호출: API 완성되면 주석 해제
  // const handleRemoveFavorite = async (benefitId: number) => {
  //   try {
  //     await api.delete(`/favorites/${mockUser.userId}`, {
  //       data: {
  //         benefitIds: [benefitId],
  //       },
  //     });
  //     // API 성공 후 상태 갱신
  //     const updated = favorites.filter((item) => item.benefitId !== benefitId);
  //     setFavorites(updated);

  //     // 삭제한 카드가 선택된 상태였다면 선택 해제 또는 첫 번째로 변경
  //     if (selectedId === benefitId) {
  //       if (updated.length > 0) {
  //         setSelectedId(updated[0].benefitId);
  //       } else {
  //         setSelectedId(null);
  //       }
  //     }
  //   } catch (err) {
  //     console.error('즐겨찾기 해제 실패', err);
  //     // TODO: 토스트나 에러 핸들링 로직 추가
  //   }
  // };

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
          <div className="flex items-center justify-end gap-3 mr-1 mb-1">
            {isEditing ? (
              <label className="flex items-center text-grey05 text-body-0 font-medium">
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
                className="text-grey05 text-body-0 font-medium"
              >
                편집
              </button>
            )}
          </div>

          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="선택한 혜택을 삭제하시겠습니까?"
            message="삭제하신 혜택은 다시 복구할 수 없습니다."
            buttons={[
              {
                label: '아니요',
                type: 'secondary',
                onClick: () => setIsDeleteModalOpen(false),
              },
              {
                label: '삭제하기',
                type: 'primary',
                onClick: () => {
                  handleDeleteSelected(); // 실제 삭제 로직
                  setIsDeleteModalOpen(false);
                },
              },
            ]}
          />

          {/* 카드 리스트 + 페이지네이션 */}
          <div className="flex flex-col flex-grow">
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
                  className={`relative p-4 border rounded-[18px] w-[220px] h-[240px] cursor-pointer transition-shadow ${
                    isEditing
                      ? selectedItems.includes(item.benefitId)
                        ? 'border-purple04 border-2'
                        : 'border-grey03'
                      : selectedId === item.benefitId
                        ? 'border-purple04 border-2'
                        : 'border-grey03'
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
                        handleRemoveFavorite(item.benefitId);
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
            {isEditing && (
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
                  onClick={() => setIsDeleteModalOpen(true)}
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
        {isEditing ? (
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
