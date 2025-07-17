// 회원 데이터 타입
export interface Member {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  grade: 'VIP' | 'VVIP' | '우수';
  joinDate: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
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

// 페이지네이션된 회원 검색 API
export const searchMembersWithPagination = async (
  searchQuery: string,
  page: number = 1,
  itemsPerPage: number = 8
): Promise<PaginatedResponse<Member>> => {
  try {
    // 실제 API 호출
    // const response = await fetch(`/api/members/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${itemsPerPage}`);
    // const data = await response.json();
    // return data;

    // 임시로 샘플 데이터를 필터링
    const filteredData = sampleMembers.filter((member) => {
      const matchesSearch =
        searchQuery === '' ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // 실제 API 호출 시뮬레이션을 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  } catch (error) {
    console.error('회원 검색 API 호출 실패:', error);
    throw error;
  }
};

// 페이지네이션된 회원 조회 API
export const getMembersWithPagination = async (
  page: number = 1,
  itemsPerPage: number = 8,
  memberType?: string,
  grade?: string
): Promise<PaginatedResponse<Member>> => {
  try {
    // 실제 API 호출
    // const params = new URLSearchParams({
    //   page: page.toString(),
    //   limit: itemsPerPage.toString(),
    //   ...(memberType && { memberType }),
    //   ...(grade && { grade }),
    // });
    // const response = await fetch(`/api/members?${params}`);
    // const data = await response.json();
    // return data;

    // 임시로 샘플 데이터를 필터링
    let filteredData = sampleMembers;

    if (memberType) {
      filteredData = filteredData.filter((member) => member.name === memberType);
    }

    if (grade) {
      filteredData = filteredData.filter((member) => member.grade === grade);
    }

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // 실제 API 호출 시뮬레이션을 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  } catch (error) {
    console.error('회원 조회 API 호출 실패:', error);
    throw error;
  }
};

// 모든 회원 조회 API
export const getAllMembers = async (): Promise<Member[]> => {
  try {
    // 실제 API 호출
    // const response = await fetch('/api/members');
    // const data = await response.json();
    // return data;

    // 임시로 샘플 데이터 반환
    return sampleMembers;
  } catch (error) {
    console.error('전체 회원 조회 API 호출 실패:', error);
    throw error;
  }
};

// 회원 상세 정보 조회 API
export const getMemberById = async (id: string): Promise<Member | null> => {
  try {
    // 실제 API 호출
    // const response = await fetch(`/api/members/${id}`);
    // const data = await response.json();
    // return data;

    // 임시로 샘플 데이터에서 검색
    const member = sampleMembers.find((m) => m.id === id);
    return member || null;
  } catch (error) {
    console.error('회원 상세 정보 조회 API 호출 실패:', error);
    throw error;
  }
};

// 회원 통계 조회 API
export const getMemberStatistics = async () => {
  try {
    // 실제 API 호출
    // const response = await fetch('/api/members/statistics');
    // const data = await response.json();
    // return data;

    // 임시 통계 데이터
    return {
      totalMembers: 125587,
      lastUpdated: '2025.07.11 UT 23:15:05',
    };
  } catch (error) {
    console.error('회원 통계 조회 API 호출 실패:', error);
    throw error;
  }
};
