import { useState } from 'react';
import { TbRefresh, TbExternalLink, TbX } from 'react-icons/tb';
import StatisticsCard from '../../../../components/common/StatisticsCard';
import SearchBar from '../../../../components/common/SearchBar';
import FilterDropdown from '../../../../components/common/FilterDropdown';
import DataTable from '../../../../components/common/DataTable';
import ActionButton from '../../../../components/common/ActionButton';
import Pagination from '../../../../components/common/Pagination';

// 브랜드 데이터 타입
interface Brand {
  id: string;
  name: string;
  category: string;
  status: '활성' | '비활성' | '대기중';
  totalUsers: number;
  monthlyUsers: number;
  totalRevenue: number;
  registrationDate: string;
}

// 샘플 브랜드 데이터
const sampleBrands: Brand[] = [
  {
    id: '1',
    name: 'GS25',
    category: '편의점',
    status: '활성',
    totalUsers: 1567,
    monthlyUsers: 234,
    totalRevenue: 5420000,
    registrationDate: '2024.01.15',
  },
  {
    id: '2',
    name: '스타벅스',
    category: '카페',
    status: '활성',
    totalUsers: 892,
    monthlyUsers: 145,
    totalRevenue: 3200000,
    registrationDate: '2024.02.20',
  },
  {
    id: '3',
    name: '파리바게트',
    category: '베이커리',
    status: '활성',
    totalUsers: 645,
    monthlyUsers: 89,
    totalRevenue: 2100000,
    registrationDate: '2024.03.10',
  },
  {
    id: '4',
    name: 'GS THE FRESH',
    category: '마트',
    status: '비활성',
    totalUsers: 423,
    monthlyUsers: 12,
    totalRevenue: 800000,
    registrationDate: '2024.04.05',
  },
  {
    id: '5',
    name: 'CGV',
    category: '영화관',
    status: '활성',
    totalUsers: 1234,
    monthlyUsers: 178,
    totalRevenue: 4500000,
    registrationDate: '2024.05.01',
  },
];

const BrandManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 8;

  // 총 브랜드 수
  const totalBrands = 45;
  const lastUpdated = '2025.07.11 UT 23:15:05';

  // 검색 필터링
  const filteredBrands = sampleBrands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? brand.category === selectedCategory : true;
    const matchesStatus = selectedStatus ? brand.status === selectedStatus : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBrands = filteredBrands.slice(startIndex, startIndex + itemsPerPage);

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

  const handleStatusFilter = (status: string) => {
    if (status === '전체') {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(selectedStatus === status ? null : status);
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

  const handleBrandDetailClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedBrand(null);
  };

  const handleFilterReset = () => {
    setSelectedCategory(null);
    setSelectedStatus(null);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  // 상태 렌더링 함수
  const renderStatus = (status: string) => {
    const statusStyles = {
      활성: 'bg-green-100 text-green-800',
      비활성: 'bg-red-100 text-red-800',
      대기중: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-body-2 font-medium ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {status}
      </span>
    );
  };

  // 매출 포맷팅 함수
  const formatRevenue = (amount: number) => {
    return `${(amount / 10000).toLocaleString()}만원`;
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: 'name', label: '브랜드명', width: '200px' },
    { key: 'category', label: '카테고리', width: '120px' },
    {
      key: 'status',
      label: '상태',
      width: '120px',
      render: (value: unknown) => renderStatus(value as string),
    },
    { key: 'totalUsers', label: '총 이용자', width: '100px' },
    { key: 'monthlyUsers', label: '월간 이용자', width: '100px' },
    {
      key: 'totalRevenue',
      label: '총 매출',
      width: '120px',
      render: (value: unknown) => formatRevenue(value as number),
    },
    { key: 'registrationDate', label: '등록일', width: '140px' },
    {
      key: 'actions',
      label: '',
      width: '60px',
      render: (_value: unknown, row: Record<string, unknown>) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBrandDetailClick(row as unknown as Brand);
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
        { label: '편의점', value: '편의점' },
        { label: '카페', value: '카페' },
        { label: '베이커리', value: '베이커리' },
        { label: '마트', value: '마트' },
        { label: '영화관', value: '영화관' },
        { label: '테마파크', value: '테마파크' },
      ],
      selectedValue: selectedCategory,
      onSelect: handleCategoryFilter,
    },
    {
      title: '상태',
      options: [
        { label: '전체', value: '전체' },
        { label: '활성', value: '활성' },
        { label: '비활성', value: '비활성' },
        { label: '대기중', value: '대기중' },
      ],
      selectedValue: selectedStatus,
      onSelect: handleStatusFilter,
    },
  ];

  return (
    <div className="pl-[28px] pt-[32px] pr-[28px] h-full">
      <h2 className="text-title-3 mb-[40px]">브랜드 관리</h2>

      {/* 상단 정보 섹션 */}
      <div className="flex mb-[28px]" style={{ width: 1410 }}>
        <StatisticsCard
          title="브랜드 수"
          value={totalBrands}
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
          placeholder="브랜드 검색"
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
              hasActiveFilters={selectedCategory !== null || selectedStatus !== null}
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

      {/* 브랜드 목록 테이블 */}
      <DataTable
        data={currentBrands as unknown as Record<string, unknown>[]}
        columns={columns}
        onRowClick={(row) => handleBrandDetailClick(row as unknown as Brand)}
        width={1410}
        height={516}
        emptyMessage="브랜드가 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredBrands.length}
        onPageChange={handlePageChange}
        width={1410}
      />

      {/* 브랜드 상세정보 모달 */}
      {showDetailModal && selectedBrand && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-[20px] shadow-lg relative"
            style={{ width: 800, height: 664 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-title-5 font-semibold text-gray-900">브랜드 상세정보</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <TbX size={24} />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-title-2 font-semibold">{selectedBrand.name}</h4>
                  {renderStatus(selectedBrand.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-body-2 text-gray-600">카테고리</p>
                    <p className="text-body-1 font-medium">{selectedBrand.category}</p>
                  </div>
                  <div>
                    <p className="text-body-2 text-gray-600">총 이용자</p>
                    <p className="text-body-1 font-medium">
                      {selectedBrand.totalUsers.toLocaleString()}명
                    </p>
                  </div>
                  <div>
                    <p className="text-body-2 text-gray-600">월간 이용자</p>
                    <p className="text-body-1 font-medium">
                      {selectedBrand.monthlyUsers.toLocaleString()}명
                    </p>
                  </div>
                  <div>
                    <p className="text-body-2 text-gray-600">총 매출</p>
                    <p className="text-body-1 font-medium">
                      {formatRevenue(selectedBrand.totalRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-2 text-gray-600">등록일</p>
                    <p className="text-body-1 font-medium">{selectedBrand.registrationDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;
