import React from 'react';
import { Category } from '../../types';
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

const getCategoryIcon = (categoryId: string): React.ReactElement | undefined => {
  const iconMap: Record<string, React.ReactElement> = {
    엔터테인먼트: <TbDeviceTv size={20} className="text-orange04" />,
    '뷰티/건강': <TbHeart size={20} className="text-pink04" />,
    쇼핑: <TbShoppingBag size={20} className="text-purple04" />,
    '생활/편의': <TbHome size={20} className="text-orange04" />,
    푸드: <TbToolsKitchen2 size={20} className="text-pink04" />,
    '문화/여가': <TbMovie size={20} className="text-purple04" />,
    교육: <TbBook size={20} className="text-orange04" />,
    '여행/교통': <TbPlane size={20} className="text-pink04" />,
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
          className={`flex-shrink-0 flex items-center justify-center gap-2 text-body-3 font-medium transition-colors duration-200 h-[50px] px-6 rounded-[30px] shadow-[0_2px_4px_rgba(0,0,0,0.2)] border-none ${
            selectedCategory === category.id
              ? 'bg-purple04 text-white'
              : 'bg-white text-grey05 hover:bg-purple02'
          }`}
        >
          {category.id !== '전체' && (
            <span className="flex-shrink-0 text-current">{getCategoryIcon(category.id)}</span>
          )}
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabsSection;
