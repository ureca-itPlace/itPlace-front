import { useState } from 'react';
import { TbRefresh } from 'react-icons/tb';
import { TbSearch } from 'react-icons/tb';
import { TbExternalLink } from 'react-icons/tb';
import Pagination from 'react-js-pagination';

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

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 총 회원 수
  const totalMembers = 125587;
  const lastUpdated = '2025.07.11 UT 23:15:05';

  // 검색 필터링
  const filteredMembers = sampleMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  // 검색어 변경 시 페이지 초기화
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 등급별 색상
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'VVIP':
        return 'text-purple-900 bg-purple-100';
      case 'VIP':
        return 'text-purple-600 bg-purple-50';
      case '우수':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleRefresh = () => {
    // 새로고침 로직
    console.log('데이터 새로고침');
  };

  return (
    <div className="pl-[28px] pt-[32px] pr-[28px] h-full">
      <h2 className="text-title-3 mb-[40px]">사용자 관리</h2>

      {/* 상단 정보 섹션 */}
      <div className="flex mb-[28px]" style={{ width: 1410 }}>
        {/* 회원 수 */}
        <div style={{ width: 344, height: 87 }}>
          <div className="bg-white rounded-[18px] shadow-sm border border-gray-100 p-6 flex items-center h-full border-l-[10px] border-l-purple04">
            <div>
              <div className="text-body-2 text-black mb-1">회원 수</div>
              <div className="text-title-3 font-bold">
                <span className="text-purple04">{totalMembers.toLocaleString()}</span>
                <span className="text-black"> 명</span>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 업데이트 날짜 */}
        <div className="ml-auto" style={{ width: 1046, height: 87 }}>
          <div className="bg-white rounded-[18px] shadow-sm border border-gray-100 p-6 flex items-center h-full border-l-[10px] border-l-orange04">
            <div>
              <div className="text-body-2 text-black mb-1">최근 업데이트 날짜</div>
              <div className="text-title-4 text-orange04 font-semibold">{lastUpdated}</div>
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
            className="w-full h-full pl-12 pr-4 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
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

      {/* 회원 목록 테이블 */}
      <div
        className="bg-white rounded-[18px] shadow-sm border border-gray-100 overflow-hidden"
        style={{ width: 1410, height: 516 }}
      >
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr style={{ height: 56 }}>
              <th className="px-6 py-4 text-left text-body-2 font-medium text-gray-700">
                회원 구분
              </th>
              <th className="px-6 py-4 text-left text-body-2 font-medium text-gray-700">회원명</th>
              <th className="px-8 py-4 text-left text-body-2 font-medium text-gray-700">등급</th>
              <th className="px-6 py-4 text-left text-body-2 font-medium text-gray-700">이메일</th>
              <th className="px-6 py-4 text-left text-body-2 font-medium text-gray-700">
                전화 번호
              </th>
              <th className="px-6 py-4 text-left text-body-2 font-medium text-gray-700">
                생성일자
              </th>
              <th className="px-6 py-4 text-left text-body-2 font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50 transition-colors duration-150"
                style={{ height: 56 }}
              >
                <td className="px-6 py-4 text-body-2 text-gray-900">{member.name}</td>
                <td className="px-6 py-4 text-body-2 text-gray-900">{member.nickname}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-body-3 font-medium ${getGradeColor(
                      member.grade
                    )}`}
                  >
                    {member.grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-body-2 text-gray-900">{member.email}</td>
                <td className="px-6 py-4 text-body-2 text-gray-900">{member.phone}</td>
                <td className="px-6 py-4 text-body-2 text-gray-900">{member.joinDate}</td>
                <td className="px-6 py-4">
                  <button className="flex items-center justify-center text-black hover:text-grey03 transition-colors duration-150">
                    <TbExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
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
    </div>
  );
};

export default MemberManagement;
