import { useState } from 'react';
import { TbRefresh, TbExternalLink } from 'react-icons/tb';
import StatisticsCard from '../../../../components/common/StatisticsCard';
import SearchBar from '../../../../components/common/SearchBar';
import FilterDropdown from '../../../../components/common/FilterDropdown';
import DataTable from '../../../../components/common/DataTable';
import ActionButton from '../../../../components/common/ActionButton';
import Pagination from '../../../../components/common/Pagination';
import MemberDetailModal from './MemberDetailModal';

// 회원 데이터 타입
interface Member {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  grade: 'VIP' | 'VVIP' | '우수';
  joinDate: string;
}

// 제휴처 이용 내역 타입
interface PartnerUsage {
  brand: string;
  amount: string;
  date: string;
}

// 샘플 회원 데이터
const sampleMembers: Member[] = [
  {
    id: '1',
    name: 'U+ 연동',
    nickname: '최영준',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: 'VIP',
    joinDate: '2002.10.22',
  },
  {
    id: '2',
    name: '일반',
    nickname: '박용규',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: 'VVIP',
    joinDate: '2002.10.22',
  },
  {
    id: '3',
    name: '일반',
    nickname: '염승아',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: 'VIP',
    joinDate: '2002.10.22',
  },
  {
    id: '4',
    name: 'U+ 연동',
    nickname: '백세진',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: '우수',
    joinDate: '2002.10.22',
  },
  {
    id: '5',
    name: 'U+ 연동',
    nickname: '이희용',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: '우수',
    joinDate: '2002.10.22',
  },
  {
    id: '6',
    name: '일반',
    nickname: '정현경',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: 'VIP',
    joinDate: '2002.10.22',
  },
  {
    id: '7',
    name: 'U+ 연동',
    nickname: '하령경',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: 'VIP',
    joinDate: '2002.10.22',
  },
  {
    id: '8',
    name: 'U+ 연동',
    nickname: '허승현',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: 'VIP',
    joinDate: '2002.10.22',
  },
  {
    id: '9',
    name: 'U+ 연동',
    nickname: '허승현',
    email: 'hello123@google.com',
    phone: '010-0000-0000',
    grade: 'VIP',
    joinDate: '2002.10.22',
  },
  {
    id: '10',
    name: '일반',
    nickname: '김민수',
    email: 'minsu@example.com',
    phone: '010-1111-1111',
    grade: 'VVIP',
    joinDate: '2003.05.15',
  },
  {
    id: '11',
    name: 'U+ 연동',
    nickname: '이영희',
    email: 'younghee@example.com',
    phone: '010-2222-2222',
    grade: 'VIP',
    joinDate: '2004.08.20',
  },
  {
    id: '12',
    name: '일반',
    nickname: '박철수',
    email: 'chulsoo@example.com',
    phone: '010-3333-3333',
    grade: '우수',
    joinDate: '2005.12.10',
  },
  {
    id: '13',
    name: 'U+ 연동',
    nickname: '김소영',
    email: 'soyoung@example.com',
    phone: '010-4444-4444',
    grade: 'VIP',
    joinDate: '2006.03.25',
  },
  {
    id: '14',
    name: '일반',
    nickname: '최우진',
    email: 'woojin@example.com',
    phone: '010-5555-5555',
    grade: 'VVIP',
    joinDate: '2007.07.30',
  },
  {
    id: '15',
    name: 'U+ 연동',
    nickname: '정수민',
    email: 'sumin@example.com',
    phone: '010-6666-6666',
    grade: '우수',
    joinDate: '2008.11.05',
  },
  {
    id: '16',
    name: '일반',
    nickname: '강지혜',
    email: 'jihye@example.com',
    phone: '010-7777-7777',
    grade: 'VIP',
    joinDate: '2009.02.14',
  },
  {
    id: '17',
    name: 'U+ 연동',
    nickname: '조민호',
    email: 'minho@example.com',
    phone: '010-8888-8888',
    grade: 'VVIP',
    joinDate: '2010.06.18',
  },
];

// 제휴처 이용 내역 샘플 데이터
const partnerUsageData: PartnerUsage[] = [
  {
    brand: 'GS25',
    amount: '3,000원',
    date: '25.07.01',
  },
  {
    brand: '세븐일레븐',
    amount: '13,000원',
    date: '25.07.05',
  },
  {
    brand: '파리바게트',
    amount: '73,000원',
    date: '25.07.10',
  },
  {
    brand: '롯데월드',
    amount: '53,000원',
    date: '25.07.11',
  },
  {
    brand: '야놀자 글리우드캠프앤글램핑코아...',
    amount: '23,000원',
    date: '25.07.11',
  },
  {
    brand: 'GS25',
    amount: '3,000원',
    date: '25.07.01',
  },
  {
    brand: '세븐일레븐',
    amount: '13,000원',
    date: '25.07.05',
  },
  {
    brand: '파리바게트',
    amount: '73,000원',
    date: '25.07.10',
  },
  {
    brand: '롯데월드',
    amount: '53,000원',
    date: '25.07.11',
  },
  {
    brand: '야놀자 글리우드캠프앤글램핑코아...',
    amount: '23,000원',
    date: '25.07.11',
  },
];

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMemberType, setSelectedMemberType] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const itemsPerPage = 8;

  // 총 회원 수
  const totalMembers = 125587;
  const lastUpdated = '2025.07.11 UT 23:15:05';

  // 검색 필터링
  const filteredMembers = sampleMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMemberType = selectedMemberType ? member.name === selectedMemberType : true;
    const matchesGrade = selectedGrade ? member.grade === selectedGrade : true;

    return matchesSearch && matchesMemberType && matchesGrade;
  });

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

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

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRefresh = () => {
    // 새로고침 로직
    console.log('데이터 새로고침');
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
    { key: 'name', label: '회원 구분', width: '120px' },
    { key: 'nickname', label: '회원명', width: '140px' },
    {
      key: 'grade',
      label: '등급',
      width: '100px',
    },
    { key: 'email', label: '이메일', width: '300px' },
    { key: 'phone', label: '전화 번호', width: '160px' },
    { key: 'joinDate', label: '생성일자', width: '140px' },
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
      <DataTable
        data={currentMembers as unknown as Record<string, unknown>[]}
        columns={columns}
        onRowClick={(row) => handlePartnerDetailClick(row as unknown as Member)}
        width={1410}
        height={516}
        emptyMessage="회원이 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredMembers.length}
        onPageChange={handlePageChange}
        width={1410}
      />

      {/* 회원 상세정보 모달 */}
      <MemberDetailModal
        isOpen={showPartnerModal}
        member={selectedMember}
        onClose={handleCloseModal}
        partnerUsageData={partnerUsageData}
      />
    </div>
  );
};

export default MemberManagement;
