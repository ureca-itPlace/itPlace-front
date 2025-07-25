// src/features/myPage/components/EditControls.tsx
import { FavoriteItem } from '../../../../types/favorites';

interface EditControlsProps {
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  currentItems: FavoriteItem[]; // ✅ currentItems 추가
  selectedItems: number[];
  setSelectedItems: (v: number[]) => void;
}

export default function EditControls({
  isEditing,
  setIsEditing,
  currentItems, // ✅ 추가
  selectedItems,
  setSelectedItems,
}: EditControlsProps) {
  return (
    <div className="flex items-center justify-end gap-3 mr-1 mb-1 max-md:mt-6 max-md:mb-2">
      {isEditing ? (
        <label className="flex items-center text-grey05 text-body-0-bold max-xl:text-body-2-bold">
          <input
            type="checkbox"
            className="mr-1 w-4 h-4 accent-purple04 appearance-none rounded-[4px] border border-grey03 checked:bg-[url('/images/myPage/icon-check.png')] bg-no-repeat bg-center checked:border-purple04"
            // ✅ 체크 조건: 현재 페이지의 아이템이 전부 선택된 경우
            checked={
              currentItems.length > 0 &&
              currentItems.every((item) => selectedItems.includes(item.benefitId))
            }
            onChange={(e) => {
              if (e.target.checked) {
                // ✅ 현재 페이지의 아이템만 선택
                setSelectedItems([
                  ...new Set([...selectedItems, ...currentItems.map((item) => item.benefitId)]),
                ]);
              } else {
                // ✅ 현재 페이지의 아이템만 선택 해제
                setSelectedItems(
                  selectedItems.filter((id) => !currentItems.some((item) => item.benefitId === id))
                );
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
          className="text-grey05 text-body-0-bold max-xl:text-body-2-bold"
        >
          편집
        </button>
      )}
    </div>
  );
}
