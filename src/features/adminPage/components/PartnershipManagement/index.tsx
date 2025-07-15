import { useState } from 'react';
import { TbRefresh, TbExternalLink, TbX } from 'react-icons/tb';
import StatisticsCard from '../../../../components/common/StatisticsCard';
import SearchBar from '../../../../components/common/SearchBar';
import FilterDropdown from '../../../../components/common/FilterDropdown';
import DataTable from '../../../../components/common/DataTable';
import ActionButton from '../../../../components/common/ActionButton';
import Pagination from '../../../../components/common/Pagination';

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
    logo: 'https://via.placeholder.com/40x40?text=GS',
    brand: 'GS25',
    category: '편의점',
    benefitType: '할인',
    searchRank: 169,
    favoriteRank: 1,
    usageRank: 7,
  },
  {
    id: '2',
    logo: 'https://via.placeholder.com/40x40?text=S',
    brand: '스타벅스',
    category: '카페',
    benefitType: '할인',
    searchRank: 69,
    favoriteRank: 7,
    usageRank: 3,
  },
  {
    id: '3',
    logo: 'https://via.placeholder.com/40x40?text=P',
    brand: '파리바게트',
    category: '베이커리',
    benefitType: '할인',
    searchRank: 45,
    favoriteRank: 49,
    usageRank: 1,
  },
  {
    id: '4',
    logo: 'https://via.placeholder.com/40x40?text=GS',
    brand: 'GS THE FRESH',
    category: '마트',
    benefitType: '할인',
    searchRank: 30,
    favoriteRank: 30,
    usageRank: 2,
  },
  {
    id: '5',
    logo: 'https://via.placeholder.com/40x40?text=C',
    brand: 'CGV',
    category: '영화관',
    benefitType: '할인',
    searchRank: 25,
    favoriteRank: 25,
    usageRank: 88,
  },
  {
    id: '6',
    logo: 'https://via.placeholder.com/40x40?text=L',
    brand: '롯데월드',
    category: '테마파크',
    benefitType: '할인',
    searchRank: 111,
    favoriteRank: 111,
    usageRank: 44,
  },
  {
    id: '7',
    logo: 'https://via.placeholder.com/40x40?text=P',
    brand: '프로포즈',
    category: '뷰티',
    benefitType: '할인',
    searchRank: 119,
    favoriteRank: 119,
    usageRank: 11,
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

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPartners = filteredPartners.slice(startIndex, startIndex + itemsPerPage);

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
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  // 상태 렌더링 함수
  const renderBenefitType = (benefitType: string) => {
    const benefitTypeStyles = {
      할인: 'bg-blue-100 text-blue-800',
      적립: 'bg-green-100 text-green-800',
      무료: 'bg-purple-100 text-purple-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-body-2 font-medium ${benefitTypeStyles[benefitType as keyof typeof benefitTypeStyles]}`}
      >
        {benefitType}
      </span>
    );
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'logo',
      label: '로고',
      width: '80px',
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
    { key: 'brand', label: '제휴처명', width: '150px' },
    { key: 'category', label: '카테고리', width: '100px' },
    {
      key: 'benefitType',
      label: '혜택 유형',
      width: '100px',
      render: (value: unknown) => renderBenefitType(value as string),
    },
    {
      key: 'searchRank',
      label: '검색 순위',
      width: '120px',
      render: (value: unknown) => (
        <div className="flex items-center justify-center">
          <span className="text-caption-1 font-medium">{value as number}</span>
        </div>
      ),
    },
    {
      key: 'favoriteRank',
      label: '즐겨찾기 순위',
      width: '120px',
      render: (value: unknown) => (
        <div className="flex items-center justify-center">
          <span className="text-caption-1 font-medium">{value as number}</span>
        </div>
      ),
    },
    {
      key: 'usageRank',
      label: '이용 순위',
      width: '120px',
      render: (value: unknown) => (
        <div className="flex items-center justify-center">
          <span className="text-caption-1 font-medium">{value as number}</span>
        </div>
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
        { label: '편의점', value: '편의점' },
        { label: '카페', value: '카페' },
        { label: '베이커리', value: '베이커리' },
        { label: '마트', value: '마트' },
        { label: '영화관', value: '영화관' },
        { label: '테마파크', value: '테마파크' },
        { label: '뷰티', value: '뷰티' },
      ],
      selectedValue: selectedCategory,
      onSelect: handleCategoryFilter,
    },
    {
      title: '혜택 유형',
      options: [
        { label: '전체', value: '전체' },
        { label: '할인', value: '할인' },
        { label: '적립', value: '적립' },
        { label: '무료', value: '무료' },
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
        rowHeight={50}
        emptyMessage="제휴처가 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredPartners.length}
        onPageChange={handlePageChange}
        width={1410}
      />

      {/* 제휴처 상세정보 모달 */}
      {showDetailModal && selectedPartner && (
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
              <h3 className="text-title-5 font-semibold text-gray-900">제휴처 상세정보</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <TbX size={24} />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 h-full flex flex-col">
              {/* 브랜드 정보 */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={selectedPartner.logo}
                      alt={`${selectedPartner.brand} 로고`}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-title-2 font-bold text-gray-900 mb-1">
                      {selectedPartner.brand}
                    </h4>
                    <p className="text-body-2 text-gray-600">
                      영화보다 멋진 당신의 일상을 위하여, 라이프스타일 매거진스!
                    </p>
                  </div>
                </div>
                <div className="w-20 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">MEGABOX</span>
                </div>
              </div>

              {/* 제공 혜택 섹션 */}
              <div className="mb-8">
                <h5 className="text-title-5 font-semibold text-gray-900 mb-4">제공 혜택</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-body-2 font-medium text-gray-900">VVIP/VIP 등급 정보</p>
                      <p className="text-body-2 text-gray-700">
                        VIP관 내 무료예매 연3회/1+1예매 연9회(총 12회)
                      </p>
                      <p className="text-body-2 text-gray-700">
                        (월 1회 사용 가능, CGV/메가박스 중 택 1)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 이용방법 섹션 */}
              <div className="flex-1">
                <h5 className="text-title-5 font-semibold text-gray-900 mb-4">이용방법</h5>
                <div className="space-y-4">
                  <div>
                    <p className="text-body-2 text-gray-700">
                      메가박스-웹/앱 ) 영화예매시 ) 제휴포인트 ) U+멤버십 ) VIP관 할인 ) 멤버십 조
                      회 ) VIP관 3개 혜택 중 1개 선택 ) 예매
                    </p>
                  </div>

                  <div>
                    <p className="text-body-2 font-medium text-gray-900 mb-2">*꼭 확인하세요</p>
                    <div className="space-y-2">
                      <p className="text-body-2 text-gray-700">
                        - VIP관 무료/1+1 혜택은 2D, 일반관텐트에 한하여 적용 가능하며, 일반관, 컴
                        포트관에 예약 할 수 있습니다.
                      </p>
                      <p className="text-body-2 text-gray-700">
                        - VIP관 특별관 6천원 할인 혜택은 더 퍼디스, Dolby Atmos, 더 테라스아우트,
                        Dolby Cinema, MX4D관에 한하여 적용 가능합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="mt-8 flex justify-center">
                <button className="w-32 h-12 bg-purple-600 text-white rounded-lg text-body-1 font-medium hover:bg-purple-700 transition-colors">
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipManagement;
