import React from 'react';
import EventBanner from './components/EventBanner';
import SimpleRanking from './components/SimpleRanking';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import BenefitFilterToggle from '../../components/BenefitFilterToggle';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoResult from '../../components/NoResult';
import { TbChevronDown, TbStar, TbStarFilled } from 'react-icons/tb';
import { showToast } from '../../utils/toast';
import {
  getBenefits,
  addFavorite,
  removeFavorite,
  BenefitItem,
  TierBenefit,
  BenefitApiParams,
} from './apis/allBenefitsApi';
import { /* createMockBenefitResponse, */ toggleMockFavorite } from './data/mockData';
import BenefitDetailModal from './components/BenefitDetailModal';

const AllBenefitsLayout: React.FC = () => {
  // 중요 !!!!!! 개발 모드 설정 (true: Mock 데이터 사용, false: 실제 API 사용)
  const USE_MOCK_DATA = false;

  const [filter, setFilter] = useState<'default' | 'vipkok'>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortFilter, setSortFilter] = useState('전체');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isLoading, setIsLoading] = useState(false);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // API 호출 함수
  const fetchBenefits = useCallback(
    async (page: number = 0, keyword?: string, category?: string, filterType?: string) => {
      setIsLoading(true);
      // 로딩 시작 시 기존 결과를 유지하지 않고 초기화
      setBenefits([]);
      setTotalElements(0);

      try {
        const params: BenefitApiParams = {
          mainCategory: filter === 'vipkok' ? 'VIP_COCK' : 'BASIC_BENEFIT',
          page: page,
          size: 9, // 3x3 그리드
        };

        if (keyword) params.keyword = keyword;
        if (category && category !== '전체') {
          // 카테고리명 매핑
          let apiCategory = category;
          if (category === '액티비티') apiCategory = '엑티비티';
          params.category = apiCategory;
        }
        if (filterType && filterType !== '전체') {
          params.filter = filterType === '온라인' ? 'ONLINE' : 'OFFLINE';
        }

        let data;
        if (USE_MOCK_DATA) {
          // Mock 데이터 사용
          const { createMockBenefitResponse } = await import('./data/mockData');
          data = createMockBenefitResponse(
            page,
            9,
            keyword,
            category,
            params.mainCategory,
            params.filter
          );
        } else {
          // 실제 API 호출
          data = await getBenefits(params);
        }

        setBenefits(data.content);
        setTotalElements(data.totalElements);
        setCurrentPage(data.currentPage + 1); // API는 0부터 시작, UI는 1부터 시작

        // 초기 즐겨찾기 상태 설정 (API에서 받아온 데이터 기준)
        const favoriteIds = data.content
          .filter((benefit) => benefit.isFavorite)
          .map((benefit) => benefit.benefitId);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('혜택 데이터 로드 실패:', error);
        showToast('혜택 데이터를 불러오는 중 오류가 발생했습니다', 'error');
        setBenefits([]);
        setTotalElements(0);
      } finally {
        setIsLoading(false);
      }
    },
    [filter, USE_MOCK_DATA]
  );

  // 즐겨찾기 토글 함수
  const toggleFavorite = useCallback(
    async (benefitId: number) => {
      try {
        if (USE_MOCK_DATA) {
          // mock 데이터 즐겨찾기 토글
          toggleMockFavorite(benefitId);
          setFavorites((prev) =>
            prev.includes(benefitId) ? prev.filter((id) => id !== benefitId) : [...prev, benefitId]
          );
          setBenefits((prev) =>
            prev.map((benefit) =>
              benefit.benefitId === benefitId
                ? { ...benefit, isFavorite: !benefit.isFavorite }
                : benefit
            )
          );
          showToast(
            favorites.includes(benefitId)
              ? '즐겨찾기에서 삭제되었습니다'
              : '즐겨찾기에 추가되었습니다',
            'success'
          );
          return;
        }

        const isCurrentlyFavorite = favorites.includes(benefitId);
        if (isCurrentlyFavorite) {
          // 즐겨찾기 삭제
          await removeFavorite(benefitId);
          setFavorites((prev) => prev.filter((id) => id !== benefitId));
          showToast('즐겨찾기에서 삭제되었습니다', 'success');
        } else {
          // 즐겨찾기 추가
          await addFavorite(benefitId);
          setFavorites((prev) => [...prev, benefitId]);
          showToast('즐겨찾기에 추가되었습니다', 'success');
        }

        // 혜택 목록의 즐겨찾기 상태도 업데이트
        setBenefits((prev) =>
          prev.map((benefit) =>
            benefit.benefitId === benefitId
              ? { ...benefit, isFavorite: !benefit.isFavorite }
              : benefit
          )
        );
      } catch (error) {
        console.error('즐겨찾기 토글 실패:', error);
        showToast('즐겨찾기 처리 중 오류가 발생했습니다', 'error');
      }
    },
    [favorites, USE_MOCK_DATA]
  );

  // 카드 클릭 핸들러
  const handleCardClick = (benefit: BenefitItem) => {
    setSelectedBenefit(benefit);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBenefit(null);
  };

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

  // 모달이 열릴 때 뒷배경 스크롤 방지
  useEffect(() => {
    if (isModalOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // 스크롤 위치 복원
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-y');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    }
    return () => {
      // 컴포넌트 언마운트 시 정리
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.removeAttribute('data-scroll-y');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    };
  }, [isModalOpen]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchBenefits(0, debouncedSearchTerm, selectedCategory, sortFilter);
  }, [fetchBenefits, debouncedSearchTerm, selectedCategory, sortFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortFilterChange = (value: string) => {
    setSortFilter(value);
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  // 디바운스된 검색 함수
  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery: string) => {
        setDebouncedSearchTerm(searchQuery);
      }, 500),
    []
  );

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    debouncedSearch(searchTerm);

    // cleanup 함수로 디바운스 취소
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const sortOptions = ['전체', '오프라인', '온라인'];
  const categories = [
    '전체',
    'APP/기기',
    '액티비티',
    '뷰티/건강',
    '쇼핑',
    '생활/편의',
    '푸드',
    '문화/여가',
    '교육',
    '여행/교통',
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 페이지네이션 로직
  const itemsPerPage = 9; // 3행 × 3열 = 9개

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchBenefits(pageNumber - 1, debouncedSearchTerm, selectedCategory, sortFilter);
  };

  // 혜택 설명 표시를 위한 헬퍼 함수
  const getBenefitDescription = (tierBenefits: TierBenefit[]) => {
    // 가장 적절한 등급의 혜택을 선택 (예: BASIC 등급)
    const basicBenefit = tierBenefits.find((benefit) => benefit.grade === 'BASIC');
    return basicBenefit ? basicBenefit.context : tierBenefits[0]?.context || '';
  };

  return (
    <div>
      <div className="p-7 flex gap-7 items-start">
        <EventBanner />
        <SimpleRanking />
        {/* 추후 다른 컴포넌트 추가 시 여기에 배치 */}
      </div>
      <div className="pt-7 px-7">
        <div className="w-[1783px] flex items-start justify-between">
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
                className={`flex items-center gap-2 px-4 py-3 border border-grey02 rounded-[10px] hover:bg-grey01 transition-colors min-w-[120px] justify-between ${
                  sortFilter !== '전체' ? 'bg-purple01' : 'bg-white'
                }`}
              >
                <span className={`${sortFilter !== '전체' ? 'text-purple04' : 'text-black'}`}>
                  {sortFilter}
                </span>
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
                      className={`w-full px-4 py-2 text-left hover:bg-grey01 transition-colors text-black ${
                        option === sortOptions[0] ? 'rounded-t-[10px]' : ''
                      } ${option === sortOptions[sortOptions.length - 1] ? 'rounded-b-[10px]' : ''}`}
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
      <div className="px-8 pb-7">
        <div className="bg-grey01 rounded-[10px] w-[1783px] h-[70px] flex items-center px-6 gap-[60px]">
          {categories.map((category) => (
            <span
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`text-body-1 cursor-pointer transition-colors ${
                selectedCategory === category ? 'text-purple04' : 'text-grey04 hover:text-purple04'
              }`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="px-7 pb-7">
        <div className="relative">
          <div className="w-[1783px] grid grid-cols-3 gap-[17px] min-h-[400px]">
            {isLoading ? (
              // 로딩 중일 때 스피너 표시
              <div className="col-span-3 flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <LoadingSpinner className="h-10 w-10 border-4 border-purple04 border-t-transparent" />
                </div>
              </div>
            ) : benefits.length > 0 ? (
              // 혜택 카드들 표시
              benefits.map((benefit) => (
                <div
                  key={benefit.benefitId}
                  className="w-[583px] h-[227px] bg-white rounded-[18px] drop-shadow-basic p-8 flex justify-between relative cursor-pointer hover:drop-shadow-hover transition-shadow"
                  onClick={() => handleCardClick(benefit)}
                >
                  {/* 왼쪽 콘텐츠 */}
                  <div className="flex flex-col flex-1 mr-4 overflow-hidden">
                    <h3 className="text-title-4 text-black mb-2 truncate">{benefit.benefitName}</h3>
                    <div className="text-body-0 text-grey05 overflow-hidden">
                      <div
                        className="line-clamp-4"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {getBenefitDescription(benefit.tierBenefits)}
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽 로고 및 즐겨찾기 */}
                  <div className="flex flex-col items-end">
                    {/* 즐겨찾기 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭 이벤트 중단
                        toggleFavorite(benefit.benefitId);
                      }}
                      className="mb-4 text-yellow-400 hover:scale-110 transition-transform"
                    >
                      {benefit.isFavorite || favorites.includes(benefit.benefitId) ? (
                        <TbStarFilled className="w-6 h-6" />
                      ) : (
                        <TbStar className="w-6 h-6" />
                      )}
                    </button>

                    {/* 로고 이미지 */}
                    <div className="w-[80px] h-[80px] flex items-center justify-center">
                      <img
                        src={benefit.image || '/images/mock/cgv.png'} // 이미지가 없을 경우 기본 이미지
                        alt={`${benefit.benefitName} 로고`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // 검색 결과가 없을 때 표시
              <div className="col-span-3 flex items-center justify-center h-[400px]">
                <NoResult
                  message1="앗! 일치하는 결과를 찾을 수 없어요!"
                  message2="다른 키워드나 혜택으로 다시 찾아보세요."
                />
              </div>
            )}
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalElements}
            onPageChange={handlePageChange}
            width={1783}
          />
        </div>
      </div>

      {/* 제휴처 상세정보 모달 */}
      <BenefitDetailModal
        isOpen={isModalOpen}
        benefit={selectedBenefit}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AllBenefitsLayout;
