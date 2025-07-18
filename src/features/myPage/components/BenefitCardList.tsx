// src/features/myPage/components/BenefitCardList.tsx
import { TbStarFilled } from 'react-icons/tb';
import { FavoriteItem } from '../hooks/useFavorites';

interface BenefitCardListProps {
  items: FavoriteItem[]; // 현재 페이지에 보여줄 아이템들
  selectedId: number | null;
  setSelectedId: (id: number) => void;

  isEditing: boolean;
  selectedItems: number[];
  setSelectedItems: (ids: number[]) => void;

  onRemove: (id: number) => void; // 단일 삭제
  onRequestDelete: (id: number) => void; // 모달 열기용 (단일)
}

/**
 * 카드 리스트를 렌더링하는 컴포넌트
 * 👉 MyFavoritesPage에서 상태/로직을 props로 내려서 사용
 */
export default function BenefitCardList({
  items,
  selectedId,
  setSelectedId,
  isEditing,
  selectedItems,
  setSelectedItems,
  onRemove,
  onRequestDelete,
}: BenefitCardListProps) {
  // 체크박스 토글 함수
  const toggleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-x-12 gap-y-5 min-h-[520px]">
      {items.map((item) => (
        <div
          key={item.benefitId}
          onClick={() => {
            if (isEditing) {
              toggleSelect(item.benefitId);
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
          {/* 편집 모드일 때 체크박스 표시 */}
          {isEditing && (
            <input
              type="checkbox"
              checked={selectedItems.includes(item.benefitId)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems([...selectedItems, item.benefitId]);
                } else {
                  setSelectedItems(selectedItems.filter((id) => id !== item.benefitId));
                }
              }}
              className="absolute top-5 right-5 w-5 h-5 accent-purple04 appearance-none rounded-md border border-grey03 checked:bg-[url('/images/myPage/icon-check.png')] bg-no-repeat bg-center checked:border-purple04"
            />
          )}

          {/* 즐겨찾기 해제 버튼 (편집 모드 아닐 때만 표시) */}
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete(item.benefitId); // 모달 열기
              }}
              className="absolute top-5 right-5 text-orange03 hover:scale-110 transition-transform"
              title="즐겨찾기 해제"
            >
              <TbStarFilled size={22} />
            </button>
          )}

          {/* 카드 이미지 및 제목 */}
          <img
            src={item.image}
            alt={item.benefitName}
            className="h-[108px] w-auto object-contain mx-auto mt-6"
          />
          <p className="text-grey05 text-title-5 text-center mt-4">{item.benefitName}</p>
        </div>
      ))}
    </div>
  );
}
