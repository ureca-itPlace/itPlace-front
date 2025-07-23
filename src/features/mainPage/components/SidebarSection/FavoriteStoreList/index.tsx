import React from 'react';
import { TbChevronRight } from 'react-icons/tb';
import { FavoriteBenefit } from '../../../types/api';

interface FavoriteStoreListProps {
  favorites: FavoriteBenefit[];
  onItemClick: (favorite: FavoriteBenefit) => void;
  isLoading?: boolean;
}

const FavoriteStoreList: React.FC<FavoriteStoreListProps> = ({
  favorites,
  onItemClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-[60px] bg-grey02 rounded-[10px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-grey04 text-body-2 mb-2">아직 찜한 혜택이 없어요</div>
        <div className="text-grey03 text-body-4">마음에 드는 혜택을 찜해보세요!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-5">
      {favorites.map((favorite) => (
        <div
          key={favorite.benefitId}
          onClick={() => onItemClick(favorite)}
          className="w-[330px] h-[60px] bg-grey01 rounded-[10px] px-4 flex items-center cursor-pointer hover:bg-purple01 transition-colors overflow-x-hidden"
        >
          {/* 왼쪽: 파트너 이미지 */}
          <div className="w-[50px] h-[50px] rounded-[10px] overflow-hidden flex-shrink-0 mr-6">
            {favorite.partnerImage ? (
              <img
                src={favorite.partnerImage}
                alt={`${favorite.partnerName} 로고`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple04 flex items-center justify-center">
                <span className="text-white text-body-4 font-bold">
                  {favorite.partnerName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* 중앙: 파트너 이름 */}
          <div className="flex-1">
            <span className="text-body-3-bold text-grey06">{favorite.partnerName}</span>
          </div>

          {/* 오른쪽: 화살표 */}
          <div className="flex-shrink-0">
            <TbChevronRight size={20} className="text-grey04" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteStoreList;
