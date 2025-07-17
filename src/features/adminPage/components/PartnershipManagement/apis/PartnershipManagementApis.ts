// 제휴처 데이터 타입
export interface Partner {
  id: string;
  logo: string;
  brand: string;
  category: string;
  benefitType: string;
  searchRank: number;
  favoriteRank: number;
  usageRank: number;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
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

// 페이지네이션된 제휴처 검색 API
export const searchPartnersWithPagination = async (
  searchQuery: string,
  page: number = 1,
  itemsPerPage: number = 8,
  sortField?: 'searchRank' | 'favoriteRank' | 'usageRank',
  sortDirection?: 'asc' | 'desc'
): Promise<PaginatedResponse<Partner>> => {
  try {
    // 실제 API 호출
    // const params = new URLSearchParams({
    //   q: searchQuery,
    //   page: page.toString(),
    //   limit: itemsPerPage.toString(),
    //   ...(sortField && { sortField }),
    //   ...(sortDirection && { sortDirection }),
    // });
    // const response = await fetch(`/api/partners/search?${params}`);
    // const data = await response.json();
    // return data;

    // 임시로 샘플 데이터를 필터링
    let filteredData = samplePartners.filter((partner) => {
      const matchesSearch =
        searchQuery === '' ||
        partner.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // 정렬 적용
    if (sortField) {
      filteredData = filteredData.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

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
    console.error('제휴처 검색 API 호출 실패:', error);
    throw error;
  }
};

// 페이지네이션된 제휴처 조회 API
export const getPartnersWithPagination = async (
  page: number = 1,
  itemsPerPage: number = 8,
  category?: string,
  benefitType?: string,
  sortField?: 'searchRank' | 'favoriteRank' | 'usageRank',
  sortDirection?: 'asc' | 'desc'
): Promise<PaginatedResponse<Partner>> => {
  try {
    // 실제 API 호출
    // const params = new URLSearchParams({
    //   page: page.toString(),
    //   limit: itemsPerPage.toString(),
    //   ...(category && { category }),
    //   ...(benefitType && { benefitType }),
    //   ...(sortField && { sortField }),
    //   ...(sortDirection && { sortDirection }),
    // });
    // const response = await fetch(`/api/partners?${params}`);
    // const data = await response.json();
    // return data;

    // 임시로 샘플 데이터를 필터링
    let filteredData = samplePartners;

    if (category) {
      filteredData = filteredData.filter((partner) => partner.category === category);
    }

    if (benefitType) {
      filteredData = filteredData.filter((partner) => partner.benefitType === benefitType);
    }

    // 정렬 적용
    if (sortField) {
      filteredData = filteredData.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
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
    console.error('제휴처 조회 API 호출 실패:', error);
    throw error;
  }
};

// 제휴처 상세 정보 조회 API
export const getPartnerById = async (id: string): Promise<Partner | null> => {
  try {
    // 실제 API 호출
    // const response = await fetch(`/api/partners/${id}`);
    // const data = await response.json();
    // return data;

    // 임시로 샘플 데이터에서 검색
    const partner = samplePartners.find((p) => p.id === id);
    return partner || null;
  } catch (error) {
    console.error('제휴처 상세 정보 조회 API 호출 실패:', error);
    throw error;
  }
};

// 제휴처 통계 조회 API
export const getPartnerStatistics = async () => {
  try {
    // 실제 API 호출
    // const response = await fetch('/api/partners/statistics');
    // const data = await response.json();
    // return data;

    // 임시 통계 데이터
    return {
      totalPartners: 128,
      lastUpdated: '2025.07.11 UT 23:15:05',
    };
  } catch (error) {
    console.error('제휴처 통계 조회 API 호출 실패:', error);
    throw error;
  }
};
