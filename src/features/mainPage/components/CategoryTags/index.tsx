import React from 'react';
import { Category } from '../../types';
import {
  TbDeviceTv,
  TbHeart,
  TbShoppingBag,
  TbHome,
  TbToolsKitchen2,
  TbPalette,
  TbBook,
  TbPlane,
} from 'react-icons/tb';

interface CategoryTagsProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const getCategoryIcon = (categoryId: string) => {
  const iconMap = {
    entertainment: <TbDeviceTv size={16} />,
    beauty: <TbHeart size={16} />,
    shopping: <TbShoppingBag size={16} />,
    life: <TbHome size={16} />,
    food: <TbToolsKitchen2 size={16} />,
    culture: <TbPalette size={16} />,
    education: <TbBook size={16} />,
    travel: <TbPlane size={16} />,
  };
  return iconMap[categoryId as keyof typeof iconMap] || null;
};

const CategoryTags: React.FC<CategoryTagsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`flex-shrink-0 flex items-center justify-center gap-1 text-body-3 font-medium transition-colors duration-200 ${
            selectedCategory === category.id
              ? 'bg-purple04 text-white'
              : 'bg-white text-grey05 hover:bg-purple02'
          }`}
          style={{
            height: '50px',
            paddingLeft: '24px',
            paddingRight: '24px',
            borderRadius: '30px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            border: 'none',
          }}
        >
          {category.id !== 'all' && getCategoryIcon(category.id)}
          <span>{category.name.replace(/🎬|💄|🛍️|🏪|🍽️|🎨|📚|✈️/g, '').trim()}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTags;
