import React from 'react';
import { Category } from '../../../types';
import {
  TbDeviceTv,
  TbHeart,
  TbShoppingBag,
  TbHome,
  TbToolsKitchen2,
  TbMovie,
  TbBook,
  TbPlane,
} from 'react-icons/tb';

interface CategoryTabsSectionProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const getCategoryIcon = (
  categoryId: string,
  isSelected: boolean
): React.ReactElement | undefined => {
  const getIconColor = () => {
    if (isSelected) return 'text-white';

    // 선택되지 않았을 때의 기본 색상
    const colorMap: Record<string, string> = {
      엔터테인먼트: 'text-orange04',
      '뷰티/건강': 'text-pink04',
      쇼핑: 'text-purple04',
      '생활/편의': 'text-orange04',
      푸드: 'text-pink04',
      '문화/여가': 'text-purple04',
      교육: 'text-orange04',
      '여행/교통': 'text-pink04',
    };
    return colorMap[categoryId] || 'text-grey05';
  };

  const iconMap: Record<string, React.ReactElement> = {
    엔터테인먼트: <TbDeviceTv size={20} className={getIconColor()} />,
    '뷰티/건강': <TbHeart size={20} className={getIconColor()} />,
    쇼핑: <TbShoppingBag size={20} className={getIconColor()} />,
    '생활/편의': <TbHome size={20} className={getIconColor()} />,
    푸드: <TbToolsKitchen2 size={20} className={getIconColor()} />,
    '문화/여가': <TbMovie size={20} className={getIconColor()} />,
    교육: <TbBook size={20} className={getIconColor()} />,
    '여행/교통': <TbPlane size={20} className={getIconColor()} />,
  };
  return iconMap[categoryId];
};

const CategoryTabsSection: React.FC<CategoryTabsSectionProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`flex-shrink-0 flex items-center justify-center gap-2 text-body-2 font-medium transition-colors duration-200 h-[50px] px-6 rounded-[30px] shadow-[0_2px_4px_rgba(0,0,0,0.2)] border-none ${
            selectedCategory === category.id
              ? 'bg-purple04 text-white'
              : 'bg-white text-grey05 hover:bg-purple02'
          }`}
        >
          {category.id !== '전체' && (
            <span className="flex-shrink-0">
              {getCategoryIcon(category.id, selectedCategory === category.id)}
            </span>
          )}
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabsSection;
