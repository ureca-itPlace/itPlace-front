// src/features/myPage/components/EditControls.tsx
import { FavoriteItem } from '../hooks/useFavorites';

interface EditControlsProps {
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  filteredFavorites: FavoriteItem[];
  selectedItems: number[];
  setSelectedItems: (v: number[]) => void;
}

export default function EditControls({
  isEditing,
  setIsEditing,
  filteredFavorites,
  selectedItems,
  setSelectedItems,
}: EditControlsProps) {
  return (
    <div className="flex items-center justify-end gap-3 mr-1 mb-1">
      {isEditing ? (
        <label className="flex items-center text-grey05 text-body-0-bold">
          <input
            type="checkbox"
            className="mr-1 w-4 h-4 accent-purple04 appearance-none rounded-[4px] border border-grey03 checked:bg-[url('/images/myPage/icon-check.png')] bg-no-repeat bg-center checked:border-purple04"
            checked={
              selectedItems.length === filteredFavorites.length && filteredFavorites.length > 0
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
  );
}
