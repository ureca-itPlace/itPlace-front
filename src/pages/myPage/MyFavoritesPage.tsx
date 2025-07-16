import { useEffect, useState } from 'react';
import MainContentWrapper from '../../features/myPage/components/MainContentWrapper';
import RightAside from '../../features/myPage/components/RightAside';
import { mockFavorites, mockUser, mockTierBenefits } from '../../features/myPage/mock/mockData';
import { TbStarFilled } from 'react-icons/tb';
//import api from '../../apis/axiosInstance';
import BenefitDetailTabs from '../../features/myPage/components/BenefitDetailTabs';
import { Pagination } from '../../components/common';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';
import BenefitFilterToggle from '../../components/common/BenefitFilterToggle';

interface FavoriteItem {
  benefitId: number;
  benefitName: string;
  image: string;
}

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(mockFavorites);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [benefitFilter, setBenefitFilter] = useState<'default' | 'vipkok'>('default'); // 토글 필터링용 상태

  // ✅ 토글 필터링된 리스트
  const filteredFavorites = mockFavorites.filter((fav) => {
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
        <div className="flex flex-col h-full justify-between">
          {/* 상단 타이틀 */}
          <h1 className="text-title-2 text-black mb-4">찜한 혜택</h1>

          {/* 토글 버튼 */}
          <BenefitFilterToggle
            value={benefitFilter}
            onChange={setBenefitFilter}
            width="w-[300px]"
            fontSize="text-title-7"
          />

          {/* 카드 리스트 + 페이지네이션 */}
          <div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-5 min-h-[520px]">
                {currentItems.map((item) => (
                  <div
                    key={item.benefitId}
                    onClick={() => setSelectedId(item.benefitId)}
                    className={`relative p-4 border rounded-[18px] cursor-pointer w-[220px] h-[240px] transition-shadow ${
                      selectedId === item.benefitId ? 'border-purple04 border-2' : 'border-grey03'
                    }`}
                  >
                    {/* 즐겨찾기 해제 버튼 */}
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
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredFavorites.length}
                onPageChange={handlePageChange}
                width={37}
              />
            </div>
          </div>
        </div>
      </MainContentWrapper>

      <RightAside bottomImage="/images/myPage/bunny-favorites.png" bottomImageAlt="찜한 혜택 토끼">
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
      </RightAside>
    </>
  );
}
