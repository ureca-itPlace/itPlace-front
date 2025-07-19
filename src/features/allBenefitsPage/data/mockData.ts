import { BenefitItem, BenefitResponse } from '../apis/allBenefitsApi';

// Mock 혜택 데이터
export const mockBenefits: BenefitItem[] = [
  {
    benefitId: 1,
    benefitName: 'CGV',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '문화/여가',
    image: '/images/mock/cgv.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '2D 영화 2천원 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '2D 영화 3천원 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '2D 영화 4천원 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 1200,
  },
  {
    benefitId: 2,
    benefitName: '투루카',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'ONLINE',
    category: '여행/교통',
    image: '/images/mock/turucar.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context:
          '① 리터당의 8천원 할인 추천\n② 리터당의 50% 할인강\n③ 리터당의 출발시와 반납시기 다른 편도 운행 서비스',
        isAll: false,
      },
      {
        grade: 'VIP',
        context:
          '① 리터당의 1만원 할인 추천\n② 리터당의 60% 할인강\n③ 리터당의 출발시와 반납시기 다른 편도 운행 서비스',
        isAll: false,
      },
      {
        grade: 'VVIP',
        context:
          '① 리터당의 1만2천원 할인 추천\n② 리터당의 70% 할인강\n③ 리터당의 출발시와 반납시기 다른 편도 운행 서비스',
        isAll: false,
      },
    ],
    isFavorite: false,
    favoriteCount: 850,
  },
  {
    benefitId: 3,
    benefitName: '메가박스',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '문화/여가',
    image: '/images/mock/cgv.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context:
          '① VVIP/VIP: 4천원 할인\n우수: 2천원 할인\n② 오리지널/카라멜팝콘 L 4천원 구매\n③ 콤보 3천원 할인상(패밀 김치 1개)',
        isAll: false,
      },
      {
        grade: 'VIP',
        context:
          '① VVIP/VIP: 5천원 할인\n우수: 3천원 할인\n② 오리지널/카라멜팝콘 L 5천원 구매\n③ 콤보 4천원 할인상(패밀 김치 1개)',
        isAll: false,
      },
      {
        grade: 'VVIP',
        context:
          '① VVIP/VIP: 6천원 할인\n우수: 4천원 할인\n② 오리지널/카라멜팝콘 L 6천원 구매\n③ 콤보 5천원 할인상(패밀 김치 1개)',
        isAll: false,
      },
    ],
    isFavorite: false,
    favoriteCount: 2100,
  },
  {
    benefitId: 4,
    benefitName: 'GS25',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '생활/편의',
    image: '/images/mock/gs25.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '편의점 할인 혜택\n1천원 당 50원 할인\n일 최대 1만원까지 할인 가능',
        isAll: false,
      },
      {
        grade: 'VIP',
        context: '편의점 할인 혜택\n1천원 당 80원 할인\n일 최대 1만5천원까지 할인 가능',
        isAll: false,
      },
      {
        grade: 'VVIP',
        context: '편의점 할인 혜택\n1천원 당 100원 할인\n일 최대 2만원까지 할인 가능',
        isAll: false,
      },
    ],
    isFavorite: false,
    favoriteCount: 1800,
  },
  {
    benefitId: 5,
    benefitName: '파리바게뜨',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '푸드',
    image: '/images/mock/cgv.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '베이커리 할인 혜택\n빵류 10% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '베이커리 할인 혜택\n빵류 15% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '베이커리 할인 혜택\n빵류 20% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 950,
  },
  {
    benefitId: 6,
    benefitName: '롯데월드',
    mainCategory: 'VIP_COCK',
    usageType: 'OFFLINE',
    category: '액티비티',
    image: '/images/mock/turucar.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '테마파크 할인 혜택\n자유이용권 15% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '테마파크 할인 혜택\n자유이용권 20% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '테마파크 할인 혜택\n자유이용권 25% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 3200,
  },
  {
    benefitId: 7,
    benefitName: '투썸플레이스',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '푸드',
    image: '/images/mock/cgv.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '카페 할인 혜택\n음료 10% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '카페 할인 혜택\n음료 15% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '카페 할인 혜택\n음료 20% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 1350,
  },
  {
    benefitId: 8,
    benefitName: '올리브영',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '뷰티/건강',
    image: '/images/mock/gs25.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '뷰티 할인 혜택\n화장품 5% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '뷰티 할인 혜택\n화장품 10% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '뷰티 할인 혜택\n화장품 15% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 2800,
  },
  {
    benefitId: 9,
    benefitName: '스타벅스',
    mainCategory: 'VIP_COCK',
    usageType: 'OFFLINE',
    category: '푸드',
    image: '/images/mock/turucar.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '커피 할인 혜택\n음료 10% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '커피 할인 혜택\n음료 15% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '커피 할인 혜택\n음료 20% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 4500,
  },
  {
    benefitId: 10,
    benefitName: '이마트',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '쇼핑',
    image: '/images/mock/cgv.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '마트 할인 혜택\n생필품 5% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '마트 할인 혜택\n생필품 8% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '마트 할인 혜택\n생필품 12% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 1600,
  },
  {
    benefitId: 11,
    benefitName: '교보문고',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'ONLINE',
    category: '교육',
    image: '/images/mock/gs25.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '도서 할인 혜택\n도서 5% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '도서 할인 혜택\n도서 8% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '도서 할인 혜택\n도서 12% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 720,
  },
  {
    benefitId: 12,
    benefitName: '버거킹',
    mainCategory: 'BASIC_BENEFIT',
    usageType: 'OFFLINE',
    category: '푸드',
    image: '/images/mock/turucar.png',
    tierBenefits: [
      {
        grade: 'BASIC',
        context: '패스트푸드 할인 혜택\n세트메뉴 10% 할인',
        isAll: true,
      },
      {
        grade: 'VIP',
        context: '패스트푸드 할인 혜택\n세트메뉴 15% 할인',
        isAll: true,
      },
      {
        grade: 'VVIP',
        context: '패스트푸드 할인 혜택\n세트메뉴 20% 할인',
        isAll: true,
      },
    ],
    isFavorite: false,
    favoriteCount: 1150,
  },
];

// 즐겨찾기 토글 함수 (mock용)
export const toggleMockFavorite = (benefitId: number) => {
  const idx = mockBenefits.findIndex((benefit) => benefit.benefitId === benefitId);
  if (idx !== -1) {
    mockBenefits[idx].isFavorite = !mockBenefits[idx].isFavorite;
  }
};

// Mock API 응답 생성 함수
export const createMockBenefitResponse = (
  page: number = 0,
  size: number = 9,
  keyword?: string,
  category?: string,
  mainCategory?: 'VIP_COCK' | 'BASIC_BENEFIT',
  filter?: 'ONLINE' | 'OFFLINE'
): BenefitResponse => {
  let filteredBenefits = [...mockBenefits];

  // 메인 카테고리 필터링
  if (mainCategory) {
    filteredBenefits = filteredBenefits.filter((benefit) => benefit.mainCategory === mainCategory);
  }

  // 카테고리 필터링
  if (category && category !== '전체') {
    filteredBenefits = filteredBenefits.filter((benefit) => benefit.category === category);
  }

  // 온라인/오프라인 필터링
  if (filter) {
    filteredBenefits = filteredBenefits.filter((benefit) => benefit.usageType === filter);
  }

  // 키워드 검색
  if (keyword) {
    filteredBenefits = filteredBenefits.filter(
      (benefit) =>
        benefit.benefitName.toLowerCase().includes(keyword.toLowerCase()) ||
        benefit.tierBenefits.some((tier) =>
          tier.context.toLowerCase().includes(keyword.toLowerCase())
        )
    );
  }

  const totalElements = filteredBenefits.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = filteredBenefits.slice(startIndex, endIndex);

  return {
    content,
    currentPage: page,
    totalPages,
    totalElements,
    hasNext: page < totalPages - 1,
  };
};
