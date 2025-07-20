import { useState, useEffect, useCallback, useMemo } from 'react';
import { TbRefresh, TbExternalLink } from 'react-icons/tb';
import { debounce } from 'lodash';
import StatisticsCard from '../../../../components/common/StatisticsCard';
import SearchBar from '../../../../components/common/SearchBar';
import FilterDropdown from '../../../../components/common/FilterDropdown';
import DataTable from '../../../../components/common/DataTable';
import ActionButton from '../../../../components/common/ActionButton';
import Pagination from '../../../../components/common/Pagination';
import MemberDetailModal from './components/MemberDetailModal';
import {
  Member,
  searchMembersWithPagination,
  getMembersWithPagination,
  getMemberStatistics,
} from './apis/MemberManagementApis';

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMemberType, setSelectedMemberType] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const itemsPerPage = 8;

  // 페이지네이션 정보 상태
  const [totalItems, setTotalItems] = useState(0);

  // 통계 데이터 상태
  const [totalMembers, setTotalMembers] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  // 회원 데이터 로드 함수
  const loadMembers = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const response = await getMembersWithPagination(
          page,
          itemsPerPage,
          selectedMemberType || undefined,
          selectedGrade || undefined
        );
        setMembers(response.data);
        setTotalItems(response.totalItems);
        setCurrentPage(response.currentPage);
      } catch (error) {
        console.error('회원 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedMemberType, selectedGrade]
  );

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const statistics = await getMemberStatistics();
        setTotalMembers(statistics.totalMembers);
        setLastUpdated(statistics.lastUpdated);

        // 첫 페이지 데이터 로드
        await loadMembers(1);
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [loadMembers]);

  // 검색 API 호출 함수
  const searchMembers = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await searchMembersWithPagination(searchQuery, 1, itemsPerPage);
      setMembers(response.data);
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
        searchMembers(searchQuery);
      }, 500),
    [searchMembers]
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
  const handleMemberTypeFilter = (type: string) => {
    if (type === '전체') {
      setSelectedMemberType(null);
    } else {
      setSelectedMemberType(selectedMemberType === type ? null : type);
    }
    setCurrentPage(1);
  };

  const handleGradeFilter = (grade: string) => {
    if (grade === '전체') {
      setSelectedGrade(null);
    } else {
      setSelectedGrade(selectedGrade === grade ? null : grade);
    }
    setCurrentPage(1);
  };

  // 필터 변경 시 데이터 다시 로드
  useEffect(() => {
    if (!debouncedSearchTerm) {
      loadMembers(1);
    }
  }, [selectedMemberType, selectedGrade, debouncedSearchTerm, loadMembers]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    if (debouncedSearchTerm) {
      // 검색 모드일 때는 검색 결과 페이지네이션
      const searchPagination = async () => {
        setIsLoading(true);
        try {
          const response = await searchMembersWithPagination(
            debouncedSearchTerm,
            pageNumber,
            itemsPerPage
          );
          setMembers(response.data);
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
      loadMembers(pageNumber);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const statistics = await getMemberStatistics();
      setTotalMembers(statistics.totalMembers);
      setLastUpdated(statistics.lastUpdated);
      setSearchTerm('');
      setDebouncedSearchTerm('');
      setCurrentPage(1);
      await loadMembers(1);
      console.log('데이터 새로고침 완료');
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartnerDetailClick = (member: Member) => {
    setSelectedMember(member);
    setShowPartnerModal(true);
  };

  const handleCloseModal = () => {
    setShowPartnerModal(false);
    setSelectedMember(null);
  };

  const handleFilterReset = () => {
    setSelectedMemberType(null);
    setSelectedGrade(null);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'userType',
      label: '회원 구분',
      width: '120px',
      render: (value: unknown) => {
        const userType = value as 'LINKED' | 'STANDARD';
        return userType === 'LINKED' ? 'U+ 연동' : '일반';
      },
    },
    { key: 'name', label: '회원명', width: '140px' },
    {
      key: 'grade',
      label: '등급',
      width: '100px',
      render: (value: unknown) => {
        const grade = value as 'VVIP' | 'VIP' | 'BASIC' | null;
        if (grade === 'BASIC') return '우수';
        return grade || '-';
      },
    },
    { key: 'email', label: '이메일', width: '300px' },
    { key: 'phoneNumber', label: '전화 번호', width: '160px' },
    { key: 'birthday', label: '생년월일', width: '140px' },
    {
      key: 'actions',
      label: '',
      width: '60px',
      render: (_value: unknown, row: Record<string, unknown>) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePartnerDetailClick(row as unknown as Member);
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
      title: '회원 구분',
      options: [
        { label: '전체', value: '전체' },
        { label: 'U+ 연동', value: 'U+ 연동' },
        { label: '일반', value: '일반' },
      ],
      selectedValue: selectedMemberType,
      onSelect: handleMemberTypeFilter,
    },
    {
      title: '등급',
      options: [
        { label: '전체', value: '전체' },
        { label: 'VVIP', value: 'VVIP' },
        { label: 'VIP', value: 'VIP' },
        { label: '우수', value: '우수' },
      ],
      selectedValue: selectedGrade,
      onSelect: handleGradeFilter,
    },
  ];

  return (
    <div className="pl-[28px] pt-[32px] pr-[28px] h-full">
      <h2 className="text-title-3 mb-[40px]">사용자 관리</h2>

      {/* 상단 정보 섹션 */}
      <div className="flex mb-[28px]" style={{ width: 1410 }}>
        <StatisticsCard
          title="회원 수"
          value={totalMembers}
          subtitle="명"
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
          placeholder="회원 검색"
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={() => setSearchTerm('')}
          width={344}
          height={50}
          backgroundColor="white"
        />

        <div className="flex items-center gap-3">
          <div className="filter-dropdown">
            <FilterDropdown
              isOpen={showFilterDropdown}
              onToggle={() => setShowFilterDropdown(!showFilterDropdown)}
              filterGroups={filterGroups}
              onReset={handleFilterReset}
              hasActiveFilters={selectedMemberType !== null || selectedGrade !== null}
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

      {/* 회원 목록 테이블 */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
            <div className="text-grey03">검색 중...</div>
          </div>
        )}
        <DataTable
          data={members as unknown as Record<string, unknown>[]}
          columns={columns}
          onRowClick={(row) => handlePartnerDetailClick(row as unknown as Member)}
          width={1410}
          height={516}
          emptyMessage="회원이 없습니다."
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

      {/* 회원 상세정보 모달 */}
      <MemberDetailModal
        isOpen={showPartnerModal}
        member={selectedMember}
        onClose={handleCloseModal}
        partnerUsageData={[]}
      />
    </div>
  );
};

export default MemberManagement;
