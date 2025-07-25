import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Category } from '../../../types';
import { LAYOUT } from '../../../constants';
import {
  TbHeart,
  TbShoppingBag,
  TbHome,
  TbToolsKitchen2,
  TbMovie,
  TbBook,
  TbPlane,
  TbBuildingCarousel,
} from 'react-icons/tb';
import 'swiper/swiper-bundle.css';

type CategoryTabsMode = 'map' | 'sidebar';

interface CategoryTabsSectionProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  mode?: CategoryTabsMode;
}

// 카테고리 색상 매핑
const CATEGORY_COLOR_MAP: Record<string, string> = {
  엑티비티: 'text-purple04',
  '뷰티/건강': 'text-orange04',
  쇼핑: 'text-pink04',
  '생활/편의': 'text-purple04',
  푸드: 'text-orange04',
  '문화/여가': 'text-pink04',
  교육: 'text-purple04',
  '여행/교통': 'text-orange04',
};

const getCategoryIcon = (
  categoryId: string,
  isSelected: boolean
): React.ReactElement | undefined => {
  const iconColor = isSelected ? 'text-white' : CATEGORY_COLOR_MAP[categoryId] || 'text-grey05';
  const iconSize = isSelected
    ? window.innerWidth < 768
      ? 16
      : 20
    : window.innerWidth < 768
      ? 14
      : 20;

  const iconMap: Record<string, React.ReactElement> = {
    엑티비티: <TbBuildingCarousel size={iconSize} className={iconColor} />,
    '뷰티/건강': <TbHeart size={iconSize} className={iconColor} />,
    쇼핑: <TbShoppingBag size={iconSize} className={iconColor} />,
    '생활/편의': <TbHome size={iconSize} className={iconColor} />,
    푸드: <TbToolsKitchen2 size={iconSize} className={iconColor} />,
    '문화/여가': <TbMovie size={iconSize} className={iconColor} />,
    교육: <TbBook size={iconSize} className={iconColor} />,
    '여행/교통': <TbPlane size={iconSize} className={iconColor} />,
  };
  return iconMap[categoryId];
};

const CategoryTabsSection: React.FC<CategoryTabsSectionProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  mode = 'map',
}) => {
  // 모드별 스타일 메모이제이션
  const styles = useMemo(() => {
    const isMapMode = mode === 'map';
    const isSidebarMode = mode === 'sidebar';

    return {
      container: `flex items-center ${isSidebarMode ? 'gap-2' : 'gap-3'} overflow-x-auto scrollbar-hide pb-2`,
      button: `flex-shrink-0 py-2 flex items-center justify-center gap-2 font-medium transition-colors duration-200 border-none ${
        isSidebarMode
          ? `h-[${LAYOUT.CATEGORY_TAB_HEIGHT_COMPACT}px] px-4 rounded-[20px] text-body-2 shadow-[0_2px_4px_rgba(0,0,0,0.2)] max-md:h-[32px] max-md:px-3 max-md:text-body-3 max-sm:h-[28px] max-sm:px-2 max-sm:text-body-4` // 사이드바: 더 작게
          : `h-[${LAYOUT.CATEGORY_TAB_HEIGHT}px] px-6 rounded-[30px] text-body-2 shadow-[0_2px_4px_rgba(0,0,0,0.2)] max-md:h-[36px] max-md:px-4 max-md:text-body-3 max-md:gap-1 max-sm:h-[32px] max-sm:px-3 max-sm:text-body-4 max-sm:gap-0.5` // 맵: 더 작게
      }`,
      showIcon: isMapMode, // 맵 모드에서만 아이콘 표시
    };
  }, [mode]);

  // 모든 모드에서 스와이퍼 사용
  return (
    <div
      className={
        mode === 'map'
          ? 'px-0 pt-2 pb-2 h-20 max-md:h-14 max-md:pt-1 max-md:pb-1 max-sm:h-12 max-sm:pt-0.5 max-sm:pb-0.5'
          : 'px-2 h-15 max-md:h-12 max-md:px-1 max-sm:h-10 max-sm:px-0.5'
      }
    >
      <Swiper
        modules={[FreeMode]}
        spaceBetween={
          mode === 'sidebar'
            ? window.innerWidth < 640
              ? 4
              : window.innerWidth < 768
                ? 6
                : 8
            : window.innerWidth < 640
              ? 6
              : window.innerWidth < 768
                ? 8
                : 12
        }
        slidesPerView="auto"
        freeMode={true}
        grabCursor={true}
        className={`category-tabs-swiper ${mode === 'map' ? 'h-16 max-md:h-12 max-sm:h-10' : 'h-14 max-md:h-10 max-sm:h-8'}`}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} style={{ width: 'auto' }}>
            <button
              onClick={() => onCategorySelect(category.id)}
              className={`${styles.button} ${
                selectedCategory === category.id
                  ? 'bg-purple04 text-white'
                  : 'bg-white text-grey05 hover:bg-purple02'
              }`}
            >
              {styles.showIcon && category.id !== '전체' && (
                <span className="flex-shrink-0">
                  {getCategoryIcon(category.id, selectedCategory === category.id)}
                </span>
              )}
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryTabsSection;
