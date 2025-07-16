import { useState } from 'react';
import { TbRefresh, TbExternalLink, TbChevronUp, TbChevronDown } from 'react-icons/tb';
import StatisticsCard from '../../../../components/common/StatisticsCard';
import SearchBar from '../../../../components/common/SearchBar';
import FilterDropdown from '../../../../components/common/FilterDropdown';
import DataTable from '../../../../components/common/DataTable';
import ActionButton from '../../../../components/common/ActionButton';
import Pagination from '../../../../components/common/Pagination';
import PartnerDetailModal from './PartnerDetailModal';

// 제휴처 데이터 타입
interface Partner {
  id: string;
  logo: string;
  brand: string;
  category: string;
  benefitType: string;
  searchRank: number;
  favoriteRank: number;
  usageRank: number;
}

// 샘플 제휴처 데이터
const samplePartners: Partner[] = [
  {
    id: '1',
    logo: '/images/admin/GS25.png',
    brand: 'GS25',
    category: '생활/편의',
    benefitType: '할인',
    searchRank: 169,
    favoriteRank: 1,
    usageRank: 7,
  },
  {
    id: '2',
    logo: '/images/admin/megabox.png',
    brand: '스타벅스',
    category: '푸드',
    benefitType: '할인',
    searchRank: 69,
    favoriteRank: 7,
    usageRank: 3,
  },
  {
    id: '3',
    logo: '/images/admin/paris.png',
    brand: '파리바게트',
    category: '푸드',
    benefitType: '증정',
    searchRank: 45,
    favoriteRank: 49,
    usageRank: 1,
  },
  {
    id: '4',
    logo: '/images/admin/GSthefresh.png',
    brand: 'GS THE FRESH',
    category: '쇼핑',
    benefitType: '할인',
    searchRank: 30,
    favoriteRank: 30,
    usageRank: 2,
  },
  {
    id: '5',
    logo: '/images/admin/CGV.png',
    brand: 'CGV',
    category: '문화/여가',
    benefitType: '할인',
    searchRank: 25,
    favoriteRank: 25,
    usageRank: 88,
  },
  {
    id: '6',
    logo: '/images/admin/lotteworld.png',
    brand: '롯데월드',
    category: '액티비티',
    benefitType: '할인',
    searchRank: 111,
    favoriteRank: 111,
    usageRank: 44,
  },
  {
    id: '7',
    logo: '/images/admin/megabox.png',
    brand: '프로포즈',
    category: '뷰티/건강',
    benefitType: '증정',
    searchRank: 119,
    favoriteRank: 119,
    usageRank: 11,
  },
  {
    id: '8',
    logo: '/images/admin/ediya.png',
    brand: '이디야커피',
    category: '푸드',
    benefitType: '할인',
    searchRank: 88,
    favoriteRank: 15,
    usageRank: 22,
  },
  {
    id: '9',
    logo: '/images/admin/emart24.png',
    brand: '이마트24',
    category: '쇼핑',
    benefitType: '할인',
    searchRank: 55,
    favoriteRank: 33,
    usageRank: 18,
  },
  {
    id: '10',
    logo: '/images/admin/baskin.png',
    brand: '배스킨라빈스',
    category: '푸드',
    benefitType: '증정',
    searchRank: 77,
    favoriteRank: 44,
    usageRank: 27,
  },
];

const PartnershipManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBenefitType, setSelectedBenefitType] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortField, setSortField] = useState<'searchRank' | 'favoriteRank' | 'usageRank' | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 8;

  // 총 제휴처 수
  const totalPartners = 128;
  const lastUpdated = '2025.07.11 UT 23:15:05';

  // 검색 필터링
  const filteredPartners = samplePartners.filter((partner) => {
    const matchesSearch =
      partner.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? partner.category === selectedCategory : true;
    const matchesBenefitType = selectedBenefitType
      ? partner.benefitType === selectedBenefitType
      : true;

    return matchesSearch && matchesCategory && matchesBenefitType;
  });

  // 정렬 적용
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPartners = sortedPartners.slice(startIndex, startIndex + itemsPerPage);

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

  // 정렬 핸들러
  const handleSort = (field: 'searchRank' | 'favoriteRank' | 'usageRank') => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRefresh = () => {
    // 새로고침 로직
    console.log('데이터 새로고침');
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
    setSortField(null);
    setSortDirection('asc');
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  // 상태 렌더링 함수
  const renderBenefitType = (benefitType: string) => {
    return <span className="text-body-2 font-medium">{benefitType}</span>;
  };

  // 정렬 아이콘 렌더링 함수
  const renderSortIcon = (field: 'searchRank' | 'favoriteRank' | 'usageRank') => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col ml-2">
          <TbChevronUp size={16} className="text-grey05" />
          <TbChevronDown size={16} className="text-grey05 -mt-1" />
        </div>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <div className="flex flex-col ml-2">
          <TbChevronUp size={16} className="text-orange04" />
          <TbChevronDown size={16} className="text-grey05 -mt-1" />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col ml-2">
          <TbChevronUp size={16} className="text-grey05" />
          <TbChevronDown size={16} className="text-orange04 -mt-1" />
        </div>
      );
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'logo',
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
    { key: 'brand', label: '제휴처명', width: '240px' },
    { key: 'category', label: '카테고리', width: '120px' },
    {
      key: 'benefitType',
      label: '혜택 유형',
      width: '120px',
      render: (value: unknown) => renderBenefitType(value as string),
    },
    {
      key: 'searchRank',
      label: '검색 순위',
      width: '120px',
      sortable: true,
      headerRender: () => (
        <button
          onClick={() => handleSort('searchRank')}
          className={`flex items-center justify-start transition-colors duration-150 ${
            sortField === 'searchRank' ? 'text-orange04 rounded-[4px]' : 'text-grey05'
          }`}
        >
          <span>검색 순위</span>
          {renderSortIcon('searchRank')}
        </button>
      ),
      render: (value: unknown) => (
        <span className="text-caption-1 font-medium text-left block">{value as number}위</span>
      ),
    },
    {
      key: 'favoriteRank',
      label: '즐겨찾기 순위',
      width: '120px',
      sortable: true,
      headerRender: () => (
        <button
          onClick={() => handleSort('favoriteRank')}
          className={`flex items-center justify-start transition-colors duration-150 ${
            sortField === 'favoriteRank' ? ' text-orange04 rounded-[4px]' : 'text-grey05'
          }`}
        >
          <span>즐겨찾기 순위</span>
          {renderSortIcon('favoriteRank')}
        </button>
      ),
      render: (value: unknown) => (
        <span className="text-caption-1 font-medium text-left block">{value as number}위</span>
      ),
    },
    {
      key: 'usageRank',
      label: '이용 순위',
      width: '120px',
      sortable: true,
      headerRender: () => (
        <button
          onClick={() => handleSort('usageRank')}
          className={`flex items-center justify-start transition-colors duration-150 ${
            sortField === 'usageRank' ? ' text-orange04 rounded-[4px]' : 'text-grey05'
          }`}
        >
          <span>이용 순위</span>
          {renderSortIcon('usageRank')}
        </button>
      ),
      render: (value: unknown) => (
        <span className="text-caption-1 font-medium text-left block">{value as number}위</span>
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
      <DataTable
        data={currentPartners as unknown as Record<string, unknown>[]}
        columns={columns}
        onRowClick={(row) => handlePartnerDetailClick(row as unknown as Partner)}
        width={1410}
        height={516}
        emptyMessage="제휴처가 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={sortedPartners.length}
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
