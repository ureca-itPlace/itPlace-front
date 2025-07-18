import {
  mockSearchRanking,
  mockWishlistRanking,
  mockClickStatistics,
  mockUsageStatistics,
} from '../data/mockData';

// 제휴처 검색 순위 관련 타입
export interface PartnerSearchRankingItem {
  partnerName: string;
  searchCount: number;
  rank: number;
  previousRank: number | null;
  rankChange: number | null;
  changeDerection: 'UP' | 'DOWN' | 'SAME' | 'NEW';
}

export interface PartnerSearchRankingResponse {
  searchRanking: PartnerSearchRankingItem[];
}

// 자주 클릭한 제휴처 관련 타입
export interface MostClickedPartnerItem {
  partnerName: string;
  clickCount: number;
  rank: number;
}

export interface MostClickedPartnersResponse {
  partners: MostClickedPartnerItem[];
}

// 즐겨찾기 통계 관련 타입
export interface FavoriteBenefitItem {
  benefitId: number;
  partnerName: string;
  benefitName: string;
  favoriteCount: number;
  rank: number;
}

export interface FavoritesStatisticsResponse {
  favoriteBenefits: FavoriteBenefitItem[];
}

// 제휴처별 이용 통계 관련 타입
export interface PartnerUsageStatsItem {
  partnerName: string;
  vvipUsageCount: number;
  vipUsageCount: number;
  basicUsageCount: number;
  totalUsageCount: number;
}

export interface PartnerUsageStatsResponse {
  usageStats: PartnerUsageStatsItem[];
}

export interface ApiResponse<T = unknown> {
  code: string;
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

// 제휴처 검색 순위 조회 함수
export const getPartnersSearchRanking = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _period: '12h' | '1d' | '7d' = '1d',
  limit: number = 5
): Promise<ApiResponse<PartnerSearchRankingResponse>> => {
  // 더미 데이터 사용
  const limitedData = mockSearchRanking.slice(0, limit);
  return {
    code: '200',
    status: 'SUCCESS',
    message: '성공',
    data: { searchRanking: limitedData },
    timestamp: new Date().toISOString(),
  };
};

// 자주 클릭한 제휴처 조회 함수
export const getMostClickedPartners = async (
  limit: number = 3
): Promise<ApiResponse<MostClickedPartnersResponse>> => {
  // 더미 데이터 사용
  const limitedData = mockClickStatistics.slice(0, limit);
  return {
    code: '200',
    status: 'SUCCESS',
    message: '성공',
    data: { partners: limitedData },
    timestamp: new Date().toISOString(),
  };
};

// 즐겨찾기 통계 조회 함수
export const getFavoritesStatistics = async (
  limit: number = 5
): Promise<ApiResponse<FavoritesStatisticsResponse>> => {
  // 더미 데이터 사용
  const limitedData = mockWishlistRanking.slice(0, limit);
  return {
    code: '200',
    status: 'SUCCESS',
    message: '성공',
    data: { favoriteBenefits: limitedData },
    timestamp: new Date().toISOString(),
  };
};

// 제휴처별 이용 통계 조회 함수
export const getPartnerUsageStats = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _period: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<ApiResponse<PartnerUsageStatsResponse>> => {
  // 더미 데이터 사용
  return {
    code: '200',
    status: 'SUCCESS',
    message: '성공',
    data: { usageStats: mockUsageStatistics },
    timestamp: new Date().toISOString(),
  };
};
