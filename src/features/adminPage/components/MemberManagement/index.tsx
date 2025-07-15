import { useState, useEffect, useRef } from 'react';
import { TbRefresh } from 'react-icons/tb';
import { TbSearch } from 'react-icons/tb';
import { TbExternalLink } from 'react-icons/tb';
import { TbX } from 'react-icons/tb';
import Pagination from 'react-js-pagination';
import { TbFilter } from 'react-icons/tb';
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
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <div className="pl-[28px] pt-[32px] pr-[28px] h-full">
      <h2 className="text-title-3 mb-[40px]">사용자 관리</h2>

      {/* 상단 정보 섹션 */}
      <div className="flex mb-[28px]" style={{ width: 1410 }}>
        {/* 회원 수 */}
        <div style={{ width: 344, height: 87 }}>
          <div className="rounded-[10px] overflow-hidden shadow-sm border border-gray-100 h-full">
            <div className="bg-white p-6 flex items-center h-full border-l-[10px] border-l-purple04">
              <div>
                <div className="text-body-2 text-black mb-1">회원 수</div>
                <div className="text-title-3 font-bold">
                  <span className="text-purple04">{totalMembers.toLocaleString()}</span>
                  <span className="text-black"> 명</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 업데이트 날짜 */}
        <div className="ml-auto" style={{ width: 1046, height: 87 }}>
          <div className="rounded-[10px] overflow-hidden shadow-sm border border-gray-100 h-full">
            <div className="bg-white p-6 flex items-center h-full border-l-[10px] border-l-orange04">
              <div>
                <div className="text-body-2 text-black mb-1">최근 업데이트 날짜</div>
                <div className="text-title-4 text-orange04 font-semibold">{lastUpdated}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 새로고침 섹션 */}
      <div className="flex items-center justify-between mb-[28px]" style={{ width: 1410 }}>
        {/* 검색창 */}
        <div className="relative" style={{ width: 344, height: 50 }}>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <TbSearch size={16} className="text-purple04" />
          </div>
          <input
            type="text"
            placeholder="회원 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full h-full pl-12 pr-10 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              <TbX size={18} />
            </button>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-3">
          {/* 필터 버튼 */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center justify-center border border-gray-300 rounded-[12px] transition-colors duration-200 ${
                selectedMemberType !== null || selectedGrade !== null
                  ? 'bg-purple04 hover:bg-purple05'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{ width: 50, height: 50 }}
            >
              <TbFilter
                size={20}
                className={
                  selectedMemberType !== null || selectedGrade !== null
                    ? 'text-white'
                    : 'text-gray-600'
                }
              />
            </button>

            {/* 필터 드롭다운 */}
            {showFilterDropdown && (
              <div
                ref={filterDropdownRef}
                className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-body-2 font-medium text-gray-700 mb-2">회원 구분</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleMemberTypeFilter('전체')}
                        className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                          selectedMemberType === null
                            ? 'bg-purple04 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        전체
                      </button>
                      <button
                        onClick={() => handleMemberTypeFilter('U+ 연동')}
                        className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                          selectedMemberType === 'U+ 연동'
                            ? 'bg-purple04 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        U+ 연동
                      </button>
                      <button
                        onClick={() => handleMemberTypeFilter('일반')}
                        className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                          selectedMemberType === '일반'
                            ? 'bg-purple04 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        일반
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-body-2 font-medium text-gray-700 mb-2">등급</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleGradeFilter('전체')}
                        className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                          selectedGrade === null
                            ? 'bg-purple04 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        전체
                      </button>
                      <button
                        onClick={() => handleGradeFilter('VVIP')}
                        className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                          selectedGrade === 'VVIP'
                            ? 'bg-purple04 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        VVIP
                      </button>
                      <button
                        onClick={() => handleGradeFilter('VIP')}
                        className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                          selectedGrade === 'VIP'
                            ? 'bg-purple04 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        VIP
                      </button>
                      <button
                        onClick={() => handleGradeFilter('우수')}
                        className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                          selectedGrade === '우수'
                            ? 'bg-purple04 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        우수
                      </button>
                    </div>
                  </div>
                </div>

                {/* 필터 초기화 버튼 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedMemberType(null);
                      setSelectedGrade(null);
                      setCurrentPage(1);
                      setShowFilterDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-body-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                  >
                    필터 초기화
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 새로고침 버튼 */}
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center bg-purple04 border border-gray-300 rounded-[12px] hover:bg-purple05 transition-colors duration-200"
            style={{ width: 50, height: 50 }}
          >
            <TbRefresh size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* 회원 목록 테이블 */}
      <div
        className="bg-white rounded-[18px] shadow-sm border border-gray-100 overflow-hidden relative"
        style={{ width: 1410, height: 516 }}
      >
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr style={{ height: 56 }}>
              <th
                className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"
                style={{ width: '120px' }}
              >
                회원 구분
              </th>
              <th
                className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"
                style={{ width: '140px' }}
              >
                회원명
              </th>
              <th
                className="px-8 py-4 text-left text-body-2 font-medium text-gray-700"
                style={{ width: '100px' }}
              >
                등급
              </th>
              <th
                className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"
                style={{ width: '300px' }}
              >
                이메일
              </th>
              <th
                className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"
                style={{ width: '160px' }}
              >
                전화 번호
              </th>
              <th
                className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"
                style={{ width: '140px' }}
              >
                생성일자
              </th>
              <th
                className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"
                style={{ width: '60px' }}
              ></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50 transition-colors duration-150"
                style={{ height: 56 }}
              >
                <td
                  className="px-6 py-4 text-body-2 text-gray-900 truncate"
                  style={{ width: '120px' }}
                >
                  {member.name}
                </td>
                <td
                  className="px-6 py-4 text-body-2 text-gray-900 truncate"
                  style={{ width: '140px' }}
                >
                  {member.nickname}
                </td>
                <td className="px-6 py-4" style={{ width: '100px' }}>
                  <span className={`px-3 py-1 rounded-full text-body-2 font-medium `}>
                    {member.grade}
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-body-2 text-gray-900 truncate"
                  style={{ width: '300px' }}
                >
                  {member.email}
                </td>
                <td
                  className="px-6 py-4 text-body-2 text-gray-900 truncate"
                  style={{ width: '160px' }}
                >
                  {member.phone}
                </td>
                <td
                  className="px-6 py-4 text-body-2 text-gray-900 truncate"
                  style={{ width: '140px' }}
                >
                  {member.joinDate}
                </td>
                <td className="px-6 py-4" style={{ width: '60px' }}>
                  <button
                    onClick={() => handlePartnerDetailClick(member)}
                    className="flex items-center justify-center text-black hover:text-grey03 transition-colors duration-150"
                  >
                    <TbExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {/* 빈 행 추가하여 테이블 높이 고정
            {Array.from({ length: itemsPerPage - currentMembers.length }, (_, index) => (
              <tr key={`empty-${index}`} style={{ height: 56 }}>
                <td className="px-6 py-4">&nbsp;</td>
                <td className="px-6 py-4">&nbsp;</td>
                <td className="px-6 py-4">&nbsp;</td>
                <td className="px-6 py-4">&nbsp;</td>
                <td className="px-6 py-4">&nbsp;</td>
                <td className="px-6 py-4">&nbsp;</td>
                <td className="px-6 py-4">&nbsp;</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center mt-[20px]" style={{ width: 1410 }}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={filteredMembers.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          innerClass="flex items-center space-x-2"
          itemClass="px-3 py-2 text-body-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-150"
          linkClass="block w-full h-full"
          activeClass="bg-purple04 text-white hover:bg-purple04"
          activeLinkClass="text-white"
          firstPageText="<<"
          lastPageText=">>"
          prevPageText="<"
          nextPageText=">"
          hideFirstLastPages={false}
          hideNavigation={false}
          hideDisabled={false}
          disabledClass="opacity-50 cursor-not-allowed"
        />
      </div>

      {/* 제휴처 상세정보 모달 */}
      {showPartnerModal && selectedMember && (
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
              <h3 className="text-title-5 font-semibold text-gray-900">회원 상세정보</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <TbX size={24} />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="pt-[38px] overflow-y-auto" style={{ height: 'calc(664px - 88px)' }}>
              {/* 회원 정보 */}
              <div className="mb-6 ml-[40px]">
                <h4 className="text-title-2 font-semibold mb-2">{selectedMember.nickname}</h4>
                <p className="text-body-0 text-grey05">
                  {selectedMember.grade} | 멤버십 번호: 123875793487594857
                </p>
              </div>

              {/* 제휴처 이용 내역 테이블 */}
              <div
                className="bg-grey01 rounded-[12px] overflow-hidden ml-[40px] mr-[40px]"
                style={{ height: 'calc(100% - 120px)' }}
              >
                <div className="bg-gray-200 px-4 py-3 border-b border-gray-300 ">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4 text-left text-body-2 font-medium text-gray-700">
                      브랜드
                    </div>
                    <div className="col-span-4 text-center text-body-2 font-medium text-gray-700">
                      할인 금액
                    </div>
                    <div className="col-span-4 text-center text-body-2 font-medium text-gray-700">
                      날짜
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto " style={{ height: 'calc(100% - 48px)' }}>
                  {partnerUsageData.map((usage, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-4 text-body-2 text-gray-900 truncate">
                          {usage.brand}
                        </div>
                        <div className="col-span-4 text-body-2 text-gray-900 text-center pl-4">
                          {usage.amount}
                        </div>
                        <div className="col-span-4 text-body-2 text-gray-900 text-center pl-4">
                          {usage.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
