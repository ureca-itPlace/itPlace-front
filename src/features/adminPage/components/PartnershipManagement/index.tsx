import { useState, useEffect, useCallback, useMemo } from 'react';
import { TbRefresh, TbExternalLink } from 'react-icons/tb';
import { debounce } from 'lodash';
import StatisticsCard from '../../../../components/common/StatisticsCard';
import SearchBar from '../../../../components/common/SearchBar';
import FilterDropdown from '../../../../components/common/FilterDropdown';
import DataTable from '../../../../components/common/DataTable';
import ActionButton from '../../../../components/common/ActionButton';
import Pagination from '../../../../components/common/Pagination';
import PartnerDetailModal from './components/PartnerDetailModal';
import {
  Partner,
  searchPartnersWithPagination,
  getPartnersWithPagination,
  getPartnerStatistics,
} from './apis/PartnershipManagementApis';

const PartnershipManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBenefitType, setSelectedBenefitType] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 8;

  // 페이지네이션 정보 상태
  const [totalItems, setTotalItems] = useState(0);

  // 통계 데이터 상태
  const [totalPartners, setTotalPartners] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  // 제휴처 데이터 로드 함수
  const loadPartners = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const response = await getPartnersWithPagination(
          page,
          itemsPerPage,
          selectedCategory || undefined,
          selectedBenefitType || undefined
        );
        setPartners(response.data);
        setTotalItems(response.totalItems);
        setCurrentPage(response.currentPage);
      } catch (error) {
        console.error('제휴처 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, selectedBenefitType]
  );

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const statistics = await getPartnerStatistics();
        setTotalPartners(statistics.totalPartners);
        setLastUpdated(statistics.lastUpdated);

        // 첫 페이지 데이터 로드
        await loadPartners(1);
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [loadPartners]);

  // 검색 API 호출 함수
  const searchPartners = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await searchPartnersWithPagination(searchQuery, 1, itemsPerPage);
      setPartners(response.data);
      setTotalItems(response.totalItems);
      setCurrentPage(1);
    } catch (error) {
      console.error('검색 API 호출 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 디바운스된 검색 함수
  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery: string) => {
        setDebouncedSearchTerm(searchQuery);
        searchPartners(searchQuery);
      }, 500),
    [searchPartners]
  );

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    debouncedSearch(searchTerm);

    // cleanup 함수로 디바운스 취소
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // 검색어 변경 시 페이지 초기화
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 필터 핸들러
  const handleCategoryFilter = (category: string) => {
    if (category === '전체') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(selectedCategory === category ? null : category);
    }
    setCurrentPage(1);
  };

  const handleBenefitTypeFilter = (benefitType: string) => {
    if (benefitType === '전체') {
      setSelectedBenefitType(null);
    } else {
      setSelectedBenefitType(selectedBenefitType === benefitType ? null : benefitType);
    }
    setCurrentPage(1);
  };

  // 필터 변경 시 데이터 다시 로드
  useEffect(() => {
    if (!debouncedSearchTerm) {
      loadPartners(1);
    }
  }, [selectedCategory, selectedBenefitType, debouncedSearchTerm, loadPartners]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    if (debouncedSearchTerm) {
      // 검색 모드일 때는 검색 결과 페이지네이션
      const searchPagination = async () => {
        setIsLoading(true);
        try {
          const response = await searchPartnersWithPagination(
            debouncedSearchTerm,
            pageNumber,
            itemsPerPage
          );
          setPartners(response.data);
          setTotalItems(response.totalItems);
          setCurrentPage(pageNumber);
        } catch (error) {
          console.error('검색 페이지네이션 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };
      searchPagination();
    } else {
      // 일반 모드일 때는 전체 데이터 페이지네이션
      loadPartners(pageNumber);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const statistics = await getPartnerStatistics();
      setTotalPartners(statistics.totalPartners);
      setLastUpdated(statistics.lastUpdated);
      setSearchTerm('');
      setDebouncedSearchTerm('');
      setCurrentPage(1);
      await loadPartners(1);
      console.log('데이터 새로고침 완료');
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartnerDetailClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedPartner(null);
  };

  const handleFilterReset = () => {
    setSelectedCategory(null);
    setSelectedBenefitType(null);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  // 상태 렌더링 함수
  const renderBenefitType = (benefitType: string) => {
    return <span className="text-body-2 font-medium">{benefitType}</span>;
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'image',
      label: '로고',
      width: '80px',
      align: 'center' as const,
      render: (value: unknown) => (
        <div className="flex items-center justify-center">
          <img
            src={value as string}
            alt="브랜드 로고"
            className="w-10 h-10 object-contain rounded-lg"
          />
        </div>
      ),
    },
    { key: 'partnerName', label: '제휴처명', width: '240px' },
    { key: 'mainCategory', label: '카테고리', width: '120px' },
    {
      key: 'type',
      label: '혜택 유형',
      width: '120px',
      render: (value: unknown) => renderBenefitType(value as string),
    },
    {
      key: 'searchRank',
      label: '검색 순위',
      width: '120px',
      render: (value: unknown) => (
        <span className="text-caption-1 text-left block">{value as number}위</span>
      ),
    },
    {
      key: 'favoriteRank',
      label: '즐겨찾기 순위',
      width: '120px',
      render: (value: unknown) => (
        <span className="text-caption-1 text-left block">{value as number}위</span>
      ),
    },
    {
      key: 'usageRank',
      label: '이용 순위',
      width: '120px',
      render: (value: unknown) => (
        <span className="text-caption-1 text-left block">{value as number}위</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      render: (_value: unknown, row: Record<string, unknown>) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePartnerDetailClick(row as unknown as Partner);
          }}
          className="flex items-center justify-center text-black hover:text-grey03 transition-colors duration-150"
        >
          <TbExternalLink size={18} />
        </button>
      ),
    },
  ];

  // 필터 그룹 정의
  const filterGroups = [
    {
      title: '카테고리',
      options: [
        { label: '전체', value: '전체' },
        { label: '액티비티', value: '액티비티' },
        { label: '뷰티/건강', value: '뷰티/건강' },
        { label: '쇼핑', value: '쇼핑' },
        { label: '생활/편의', value: '생활/편의' },
        { label: '푸드', value: '푸드' },
        { label: '문화/여가', value: '문화/여가' },
        { label: '교육', value: '교육' },
        { label: '여행/교통', value: '여행/교통' },
      ],
      selectedValue: selectedCategory,
      onSelect: handleCategoryFilter,
    },
    {
      title: '혜택 유형',
      options: [
        { label: '전체', value: '전체' },
        { label: '할인', value: '할인' },
        { label: '증정', value: '증정' },
      ],
      selectedValue: selectedBenefitType,
      onSelect: handleBenefitTypeFilter,
    },
  ];

  return (
    <div className="pl-[28px] pt-[32px] pr-[28px] h-full">
      <h2 className="text-title-3 mb-[40px]">제휴 관리</h2>

      {/* 상단 정보 섹션 */}
      <div className="flex mb-[28px]" style={{ width: 1410 }}>
        <StatisticsCard
          title="제휴처 수"
          value={totalPartners}
          subtitle="개"
          borderColor="border-l-purple04"
          valueColor="text-purple04"
          subtitleColor="text-black"
          width={344}
          height={87}
        />

        <div className="ml-auto">
          <StatisticsCard
            title="최근 업데이트 날짜"
            value={lastUpdated}
            borderColor="border-l-orange04"
            valueColor="text-orange04"
            width={1046}
            height={87}
          />
        </div>
      </div>

      {/* 검색 및 액션 버튼 섹션 */}
      <div className="flex items-center justify-between mb-[28px]" style={{ width: 1410 }}>
        <SearchBar
          placeholder="제휴처 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={() => setSearchTerm('')}
          width={344}
          height={50}
        />

        <div className="flex items-center gap-3">
          <div className="filter-dropdown">
            <FilterDropdown
              isOpen={showFilterDropdown}
              onToggle={() => setShowFilterDropdown(!showFilterDropdown)}
              filterGroups={filterGroups}
              onReset={handleFilterReset}
              hasActiveFilters={selectedCategory !== null || selectedBenefitType !== null}
            />
          </div>

          <ActionButton
            icon={<TbRefresh size={20} />}
            onClick={handleRefresh}
            variant="primary"
            size={50}
          />
        </div>
      </div>

      {/* 제휴처 목록 테이블 */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
            <div className="text-grey03">검색 중...</div>
          </div>
        )}
        <DataTable
          data={partners as unknown as Record<string, unknown>[]}
          columns={columns}
          onRowClick={(row) => handlePartnerDetailClick(row as unknown as Partner)}
          width={1410}
          height={516}
          emptyMessage="제휴처가 없습니다."
        />
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        width={1410}
      />

      {/* 제휴처 상세정보 모달 */}
      <PartnerDetailModal
        isOpen={showDetailModal}
        partner={selectedPartner}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PartnershipManagement;
