import React from 'react';
import EventBanner from './EventBanner';
import SimpleRanking from './SimpleRanking';
import { useState, useEffect, useRef } from 'react';
import BenefitFilterToggle from '../../components/common/BenefitFilterToggle';
import SearchBar from '../../components/common/SearchBar';
import { TbChevronDown } from 'react-icons/tb';

const AllBenefitsLayout: React.FC = () => {
  const [filter, setFilter] = useState<'default' | 'vipkok'>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortFilter, setSortFilter] = useState('전체');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortFilterChange = (value: string) => {
    setSortFilter(value);
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  const sortOptions = ['전체', '오프라인', '온라인'];
  const categories = [
    '전체',
    '쇼핑/기타',
    '배달/배송',
    '뷰티/건강',
    '숙박',
    '여행/여가',
    '쿠폰',
    '문화/여가',
    '교육',
    '의료/금융',
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="p-7 flex gap-7 items-start">
        <EventBanner />
        <SimpleRanking />
        {/* 추후 다른 컴포넌트 추가 시 여기에 배치 */}
      </div>
      <div className="pt-7 px-7">
        <div className="w-[1783px] flex items-center justify-between">
          <BenefitFilterToggle value={filter} onChange={setFilter} />
          <div className="flex gap-2">
            <SearchBar
              placeholder="제휴처 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={() => setSearchTerm('')}
              width={350}
              height={50}
              backgroundColor="bg-grey01"
            />
            {/* 정렬 필터 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-grey02 rounded-[10px] hover:bg-grey01 transition-colors min-w-[120px] justify-between"
              >
                <span className="text-black">{sortFilter}</span>
                <TbChevronDown
                  className={`w-4 h-4 text-grey03 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-grey03 rounded-[10px] z-50 min-w-[120px] max-h-60 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSortFilterChange(option)}
                      className={`w-full px-4 py-2 text-left hover:bg-grey01 transition-colors ${
                        sortFilter === option ? 'bg-purple01 text-purple04' : 'text-black'
                      } ${option === sortOptions[0] ? 'rounded-t-[10px]' : ''} ${
                        option === sortOptions[sortOptions.length - 1] ? 'rounded-b-[10px]' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-7 pb-7">
        <div className="bg-grey01 rounded-[10px] w-[1783px] h-[70px] flex items-center px-6 gap-8">
          {categories.map((category) => (
            <span
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`text-sm font-medium cursor-pointer transition-colors ${
                selectedCategory === category
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBenefitsLayout;
