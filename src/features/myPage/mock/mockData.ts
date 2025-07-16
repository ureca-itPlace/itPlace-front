export interface TierBenefitItem {
  benefitId: number;
  grade?: string; // VVIP, VIP, BASIC
  isAll: boolean;
  content: string;
  discountValue?: number;
}

// 🟣 등급별 혜택 리스트 (CSV 기반)
export const mockTierBenefits: TierBenefitItem[] = [
  // VIP콕 인 경우
  {
    benefitId: 1,
    grade: 'VIP콕',
    isAll: false,
    content: '아메리카노(R사이즈) 1잔 무료\n※ ICE/HOT 선택 가능',
    discountValue: 4500,
  },
  {
    benefitId: 2,
    grade: 'VIP콕',
    isAll: false,
    content:
      '네이버플러스멤버십 1개월 무료 이용권 제공\n무료 예매 연 3회 / 1+1 예매 연 9회 (총 12회)\n(월 1회 사용 가능, CGV/메가박스 중 택 1)\n※ 1+1이란? 1매 유료로 구매 시, 1매 무료 제공',
    discountValue: 4900,
  },

  // isAll = true 인 모든 등급 공통 혜택
  {
    benefitId: 28,
    grade: 'VVIP',
    isAll: true,
    content: '2D영화 2천원 할인\n※모든 등급 공통으로 적용되는 혜택 예시',
    discountValue: 2000,
  },
  {
    benefitId: 28,
    grade: 'VIP',
    isAll: true,
    content: '2D영화 2천원 할인\n※모든 등급 공통으로 적용되는 혜택 예시',
    discountValue: 2000,
  },
  {
    benefitId: 28,
    grade: 'BASIC',
    isAll: true,
    content: '2D영화 2천원 할인\n※모든 등급 공통으로 적용되는 혜택 예시',
    discountValue: 2000,
  },

  // 등급별로 다른 혜택
  {
    benefitId: 40,
    grade: 'VVIP',
    isAll: false,
    content: `10% 할인\n(2만원 이상 주문 시, 최대 4천원)`,
    discountValue: 10,
  },
  {
    benefitId: 40,
    grade: 'VIP',
    isAll: false,
    content: `10% 할인\n(2만원 이상 주문 시, 최대 4천원)`,
    discountValue: 10,
  },
  {
    benefitId: 40,
    grade: 'BASIC',
    isAll: false,
    content: `5% 할인\n(2만원 이상 주문 시, 최대 4천원)`,
    discountValue: 5,
  },
];

// 찜한 혜택 목록
export interface FavoriteItem {
  benefitId: number;
  benefitName: string;
  image: string;
}

export const mockFavorites: FavoriteItem[] = [
  { benefitId: 40, benefitName: 'GS25', image: '/images/mock/gs25.png' }, // 등급별로 다른 혜택 예시
  { benefitId: 2, benefitName: '투루카', image: '/images/mock/turucar.png' }, // VIP 콕 예시
  { benefitId: 28, benefitName: 'CGV', image: '/images/mock/cgv.png' }, // 모든등급 같은 혜택 예시
  { benefitId: 41, benefitName: 'GS25', image: '/images/mock/gs25.png' }, // 등급별로 다른 혜택 예시
  { benefitId: 3, benefitName: '투루카', image: '/images/mock/turucar.png' }, // VIP 콕 예시
  { benefitId: 29, benefitName: 'CGV', image: '/images/mock/cgv.png' }, // 모든등급 같은 혜택 예시
  { benefitId: 42, benefitName: 'GS25', image: '/images/mock/gs25.png' }, // 등급별로 다른 혜택 예시
  { benefitId: 4, benefitName: '투루카', image: '/images/mock/turucar.png' }, // VIP 콕 예시
  { benefitId: 30, benefitName: 'CGV', image: '/images/mock/cgv.png' }, // 모든등급 같은 혜택 예시
];

// 현재 사용자 목업
export const mockUser = {
  userId: 123,
  name: '홍길동',
  membershipGrade: 'VVIP', // VVIP, VIP, BASIC
};
