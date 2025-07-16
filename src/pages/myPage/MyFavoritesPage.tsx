import { useEffect, useState } from 'react';
import MainContentWrapper from '../../features/myPage/components/MainContentWrapper';
import RightAside from '../../features/myPage/components/RightAside';
import { mockFavorites, mockUser } from '../../features/myPage/mock/mockData';
import { TbStarFilled } from 'react-icons/tb';
import api from '../../apis/axiosInstance';
import BenefitDetailTabs from '../../features/myPage/components/BenefitDetailTabs';

interface FavoriteItem {
  benefitId: number;
  benefitName: string;
  image: string;
}

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(mockFavorites);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ 진입 시 첫 번째 혜택 기본 선택: mock
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
        <h1 className="text-title-2 text-black mb-4">찜한 혜택</h1>
        <div className="grid grid-cols-3 gap-10">
          {favorites.map((item) => (
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
      </MainContentWrapper>

      <RightAside bottomImage="/images/myPage/bunny-favorites.png" bottomImageAlt="찜한 혜택 토끼">
        {selectedId ? (
          <>
            <h1 className="text-title-2 text-black mb-4 text-center">상세 혜택</h1>
            <BenefitDetailTabs
              benefitId={selectedId}
              image={favorites.find((f) => f.benefitId === selectedId)?.image ?? ''}
              name={favorites.find((f) => f.benefitId === selectedId)?.benefitName ?? ''}
            />
          </>
        ) : (
          <p>카드를 선택하면 상세 혜택이 표시됩니다.</p>
        )}
      </RightAside>
    </>
  );
}
