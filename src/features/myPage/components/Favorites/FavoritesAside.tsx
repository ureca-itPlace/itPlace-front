import FadeWrapper from '../FadeWrapper';
import BenefitDetailTabs from './BenefitDetailTabs';
import { FavoriteItem } from '../../../../types/favorites';

interface FavoritesAsideProps {
  favorites: FavoriteItem[];
  isEditing: boolean;
  selectedItems: number[];
  selectedId: number | null;
  userGrade?: string;
}

export default function FavoritesAside({
  favorites,
  isEditing,
  selectedItems,
  selectedId,
  userGrade,
}: FavoritesAsideProps) {
  // 찜한 혜택이 아예 없을 때
  if (favorites.length === 0) {
    return (
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
    );
  }

  // 편집 모드일 때
  if (isEditing) {
    return (
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
    );
  }

  // 상세 혜택 표시 모드
  return (
    <FadeWrapper changeKey={selectedId}>
      {selectedId ? (
        <>
          <h1 className="text-title-2 text-black mb-5 text-center">상세 혜택</h1>
          <BenefitDetailTabs
            benefitId={selectedId}
            image={favorites.find((f) => f.benefitId === selectedId)?.partnerImage ?? ''}
            name={favorites.find((f) => f.benefitId === selectedId)?.benefitName ?? ''}
            userGrade={userGrade}
          />
        </>
      ) : (
        <p className="text-grey05">카드를 선택하면 상세 혜택이 표시됩니다.</p>
      )}
    </FadeWrapper>
  );
}
