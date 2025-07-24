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
import MobileHeader from '../../components/MobileHeader';

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
              ? '관심 혜택에서 삭제되었습니다'
              : '관심 혜택에 추가되었습니다',
            'success'
          );
          return;
        }

        const isCurrentlyFavorite = favorites.includes(benefitId);
        if (isCurrentlyFavorite) {
          // 즐겨찾기 삭제
          await removeFavorite(benefitId);
          setFavorites((prev) => prev.filter((id) => id !== benefitId));
          showToast('관심 혜택에서 삭제되었습니다', 'success');
        } else {
          // 즐겨찾기 추가
          await addFavorite(benefitId);
          setFavorites((prev) => [...prev, benefitId]);
          showToast('관심 혜택에 추가되었습니다', 'success');
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
        console.error('관심 혜택 토글 실패:', error);
        showToast('관심 혜택 처리 중 오류가 발생했습니다', 'error');
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
  const itemsPerPage = 9;

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
      {/* 모바일 헤더 */}
      <div className="fixed top-0 left-0 w-full z-[9999] max-md:block hidden">
        <MobileHeader title="전체 혜택" />
      </div>

      {/* 이벤트 배너 - 모바일에서만 별도 표시 */}
      <div className="max-md:block hidden max-md:-mx-5 max-md:mb-4">
        <EventBanner />
      </div>

      {/* 데스크탑/태블릿/노트북 레이아웃 */}
      <div className="p-7 flex gap-7 items-start max-xl:gap-5 max-xl:p-5 max-md:flex-col max-md:p-0 ">
        <div className="max-md:hidden">
          <EventBanner />
        </div>
        <SimpleRanking />
      </div>

      {/* 모바일: 랭킹 아래 토글버튼
      <div className="max-md:block hidden px-4 pt-2">
        <BenefitFilterToggle value={filter} onChange={setFilter} />
      </div> */}

      {/* 데스크탑: 기존 토글버튼 위치 */}
      <div className="pt-7 px-7 max-xl:pt-5 max-xl:px-0 max-xl:pl-5 max-xl:pr-8 max-md:pt-16 max-md:px-0">
        <div className="w-[1783px] max-xl:w-full flex items-start justify-between max-xl:gap-4 max-md:flex-col max-md:w-full">
          <BenefitFilterToggle
            value={filter}
            onChange={setFilter}
            width="w-[300px] max-xl:w-[220px] max-md:w-full max-md:mb-0"
          />
          <div className="flex gap-2 max-xl:gap-1 max-md:mb-6 max-md:w-full ">
            <SearchBar
              placeholder="제휴처 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={() => setSearchTerm('')}
              className="w-[350px] h-[50px] max-md:w-full max-xl:w-full"
              backgroundColor="bg-grey01"
            />
            {/* 정렬 필터 드롭다운 */}
            <div className="relative max-md:hidden" ref={dropdownRef}>
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
      <div className="px-8 pb-7 max-xl:w-full max-xl:pl-5 max-xl:pr-8 max-xl:pb-5 max-md:-mx-5 max-md:px-0">
        {/* PC: 기존 고정형, 노트북: 축소, 모바일: 가로 스크롤 */}
        <div className="bg-grey01 rounded-[10px] w-[1783px] max-xl:w-full h-[70px] max-xl:h-[52px] flex items-center px-6 max-xl:px-4 gap-[60px] max-xl:gap-[32px] max-md:w-screen max-md:h-[70px] max-md:px-6 max-md:overflow-x-auto max-md:gap-4 max-md:pr-4">
          <div className="flex items-center gap-[60px] max-xl:gap-[32px] max-md:gap-10 max-md:flex-nowrap max-md:min-w-max">
            {categories.map((category) => (
              <span
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`text-body-1 max-md:text-body-2 max-xl:text-body-2 cursor-pointer transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'text-purple04'
                    : 'text-grey04 hover:text-purple04'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="px-7 pb-7 max-xl:px-5 max-xl:pb-5 max-md:px-0">
        <div className="relative">
          <div className="w-[1783px] max-xl:w-full grid grid-cols-3 gap-[17px] max-xl:gap-x-[2px] max-xl:gap-y-[20px] min-h-[400px] max-xl:min-h-[260px] max-md:w-full max-md:grid-cols-1 max-md:gap-4">
            {isLoading ? (
              // 로딩 중일 때 스피너 표시
              <div className="col-span-3 flex items-center justify-center h-[400px] max-xl:h-[320px] max-md:col-span-1">
                <div className="flex flex-col items-center gap-4 max-xl:gap-2">
                  <LoadingSpinner className="h-10 w-10 max-xl:h-8 max-xl:w-8 border-4 border-purple04 border-t-transparent" />
                </div>
              </div>
            ) : benefits.length > 0 ? (
              // 혜택 카드들 표시
              benefits.map((benefit) => (
                <div
                  key={benefit.benefitId}
                  className="w-[583px] max-xl:w-[460px] h-[227px] max-xl:h-[168px] bg-white rounded-[18px] max-xl:rounded-[13px] drop-shadow-basic p-8 max-xl:p-5 flex justify-between relative cursor-pointer hover:drop-shadow-hover transition-shadow max-md:w-full max-md:h-[180px]"
                  onClick={() => handleCardClick(benefit)}
                >
                  {/* 왼쪽 콘텐츠 */}
                  <div className="flex flex-col flex-1 mr-4 max-xl:mr-2 overflow-hidden">
                    <h3 className="text-title-4 max-xl:text-title-5 text-black mb-2 max-xl:mb-1 truncate max-md:text-title-6">
                      {benefit.benefitName}
                    </h3>
                    <div className="text-body-0 max-xl:text-body-1 text-grey05 overflow-hidden max-md:text-body-2">
                      <div
                        className="line-clamp-4 max-xl:line-clamp-3"
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
                      className="mb-4 max-xl:mb-2 text-orange03 hover:scale-110 transition-transform"
                    >
                      {benefit.isFavorite || favorites.includes(benefit.benefitId) ? (
                        <TbStarFilled className="w-6 h-6 max-xl:w-5 max-xl:h-5" />
                      ) : (
                        <TbStar className="w-6 h-6 max-xl:w-5 max-xl:h-5" />
                      )}
                    </button>

                    {/* 로고 이미지 */}
                    <div className="w-[80px] max-xl:w-[64px] h-[80px] max-xl:h-[64px] flex items-center justify-center max-md:w-[56px] max-md:h-[56px]">
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
              <div className="col-span-3 flex items-center justify-center h-[400px] max-xl:h-[320px] max-md:col-span-1">
                <NoResult
                  message1="앗! 일치하는 결과를 찾을 수 없어요!"
                  message2="다른 키워드나 혜택으로 다시 찾아보세요."
                />
              </div>
            )}
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8 max-xl:mt-6 max-md:w-[calc(100vw-56px)]">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalElements}
            onPageChange={handlePageChange}
            width={window.innerWidth <= 1536 ? 1426 : 1783}
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
