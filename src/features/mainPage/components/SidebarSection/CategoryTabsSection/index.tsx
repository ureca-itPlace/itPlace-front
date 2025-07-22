import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Category } from '../../../types';
import { LAYOUT } from '../../../constants';
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
import 'swiper/css';
import 'swiper/css/free-mode';

type CategoryTabsMode = 'map' | 'sidebar';

interface CategoryTabsSectionProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  mode?: CategoryTabsMode;
}

// 카테고리 색상 매핑 (메모이제이션을 위해 컴포넌트 외부로 이동)
const CATEGORY_COLOR_MAP: Record<string, string> = {
  엔터테인먼트: 'text-orange04',
  '뷰티/건강': 'text-pink04',
  쇼핑: 'text-purple04',
  '생활/편의': 'text-orange04',
  푸드: 'text-pink04',
  '문화/여가': 'text-purple04',
  교육: 'text-orange04',
  '여행/교통': 'text-pink04',
};

const getCategoryIcon = (
  categoryId: string,
  isSelected: boolean
): React.ReactElement | undefined => {
  const iconColor = isSelected ? 'text-white' : CATEGORY_COLOR_MAP[categoryId] || 'text-grey05';
  const iconSize = 20;

  const iconMap: Record<string, React.ReactElement> = {
    엔터테인먼트: <TbDeviceTv size={iconSize} className={iconColor} />,
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
      button: `flex-shrink-0 flex items-center justify-center gap-2 font-medium transition-colors duration-200 border-none ${
        isSidebarMode
          ? `h-[${LAYOUT.CATEGORY_TAB_HEIGHT_COMPACT}px] px-4 rounded-[20px] text-body-2` // 사이드바: 높이 40px, 작은 패딩, body-2
          : `h-[${LAYOUT.CATEGORY_TAB_HEIGHT}px] px-6 rounded-[30px] text-body-2 shadow-[0_2px_4px_rgba(0,0,0,0.2)]` // 맵: 높이 48px, 큰 패딩, 그림자
      }`,
      showIcon: isMapMode, // 맵 모드에서만 아이콘 표시
    };
  }, [mode]);

  // 사이드바 모드에서만 스와이퍼 사용
  if (mode === 'sidebar') {
    return (
      <div className="pb-2">
        <Swiper
          modules={[FreeMode]}
          spaceBetween={8}
          slidesPerView="auto"
          freeMode={true}
          grabCursor={true}
          className="category-tabs-swiper"
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
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  // 맵 모드에서는 기존 방식 (스크롤)
  return (
    <div className={styles.container}>
      {categories.map((category) => (
        <button
          key={category.id}
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
      ))}
    </div>
  );
};

export default CategoryTabsSection;
