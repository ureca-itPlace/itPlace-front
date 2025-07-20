import {
  PartnerSearchRankingItem,
  MostClickedPartnerItem,
  FavoriteBenefitItem,
  PartnerUsageStatsItem,
} from '../apis/DashboardApis';

// 검색 순위 더미 데이터
export const mockSearchRanking: PartnerSearchRankingItem[] = [
  {
    partnerName: 'CGV',
    searchCount: 1210,
    rank: 1,
    previousRank: 2,
    rankChange: 1,
    changeDerection: 'UP',
  },
  {
    partnerName: 'GS25',
    searchCount: 1180,
    rank: 2,
    previousRank: 1,
    rankChange: -1,
    changeDerection: 'DOWN',
  },
  {
    partnerName: '메가박스',
    searchCount: 1050,
    rank: 3,
    previousRank: 3,
    rankChange: 0,
    changeDerection: 'SAME',
  },
  {
    partnerName: '롯데월드',
    searchCount: 980,
    rank: 4,
    previousRank: 5,
    rankChange: 1,
    changeDerection: 'UP',
  },
  {
    partnerName: '배스킨라빈스',
    searchCount: 920,
    rank: 5,
    previousRank: 4,
    rankChange: -1,
    changeDerection: 'DOWN',
  },
];

// 즐겨찾기 순위 더미 데이터
export const mockWishlistRanking: FavoriteBenefitItem[] = [
  {
    benefitId: 1,
    partnerName: 'GS25',
    benefitName: 'GS25 할인',
    favoriteCount: 890,
    rank: 1,
  },
  {
    benefitId: 2,
    partnerName: 'CGV',
    benefitName: 'CGV 영화 할인',
    favoriteCount: 850,
    rank: 2,
  },
  {
    benefitId: 3,
    partnerName: '스타벅스',
    benefitName: '스타벅스 할인',
    favoriteCount: 780,
    rank: 3,
  },
  {
    benefitId: 4,
    partnerName: '메가박스',
    benefitName: '메가박스 영화 할인',
    favoriteCount: 720,
    rank: 4,
  },
  {
    benefitId: 5,
    partnerName: '올리브영',
    benefitName: '올리브영 할인',
    favoriteCount: 680,
    rank: 5,
  },
];

// 클릭 통계 더미 데이터
export const mockClickStatistics: MostClickedPartnerItem[] = [
  { partnerName: 'CGV', clickCount: 2450, rank: 1 },
  { partnerName: 'GS25', clickCount: 2280, rank: 2 },
  { partnerName: '메가박스', clickCount: 2150, rank: 3 },
  { partnerName: '스타벅스', clickCount: 1980, rank: 4 },
  { partnerName: '올리브영', clickCount: 1850, rank: 5 },
];

// 이용 통계 더미 데이터
export const mockUsageStatistics: PartnerUsageStatsItem[] = [
  {
    partnerName: 'CGV',
    vvipUsageCount: 650,
    vipUsageCount: 720,
    basicUsageCount: 480,
    totalUsageCount: 1850,
  },
  {
    partnerName: 'GS25',
    vvipUsageCount: 580,
    vipUsageCount: 650,
    basicUsageCount: 490,
    totalUsageCount: 1720,
  },
  {
    partnerName: '스타벅스',
    vvipUsageCount: 520,
    vipUsageCount: 580,
    basicUsageCount: 550,
    totalUsageCount: 1650,
  },
  {
    partnerName: '메가박스',
    vvipUsageCount: 480,
    vipUsageCount: 520,
    basicUsageCount: 580,
    totalUsageCount: 1580,
  },
  {
    partnerName: '올리브영',
    vvipUsageCount: 420,
    vipUsageCount: 480,
    basicUsageCount: 550,
    totalUsageCount: 1450,
  },
];

// 대시보드 통계 더미 데이터
export const mockDashboardStatistics = {
  totalPartners: 150,
  totalMembers: 25480,
  totalBenefitUsage: 18750,
  averageMonthlyUsage: 1562,
  lastUpdated: new Date()
    .toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/,/g, ' '),
};

// 월별 사용 통계 더미 데이터 (차트용)
export const mockMonthlyUsageData = [
  { month: '1월', usage: 1200 },
  { month: '2월', usage: 1350 },
  { month: '3월', usage: 1480 },
  { month: '4월', usage: 1620 },
  { month: '5월', usage: 1750 },
  { month: '6월', usage: 1680 },
  { month: '7월', usage: 1850 },
];

// 등급별 사용 비율 더미 데이터 (차트용)
export const mockGradeUsageData = [
  { grade: 'VVIP', percentage: 35, count: 6562 },
  { grade: 'VIP', percentage: 40, count: 7500 },
  { grade: 'BASIC', percentage: 25, count: 4688 },
];
