import api from '../../../../../apis/axiosInstance';

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
  period: '12h' | '1d' | '7d' = '1d',
  limit: number = 5
): Promise<ApiResponse<PartnerSearchRankingResponse>> => {
  const response = await api.get('/partners/search-ranking', {
    params: { period, limit },
  });
  return response.data;
};

// 자주 클릭한 제휴처 조회 함수
export const getMostClickedPartners = async (
  limit: number = 3
): Promise<ApiResponse<MostClickedPartnersResponse>> => {
  const response = await api.get('/benefits/most-clicked', {
    params: { limit },
  });
  return response.data;
};

// 즐겨찾기 통계 조회 함수
export const getFavoritesStatistics = async (
  limit: number = 5
): Promise<ApiResponse<FavoritesStatisticsResponse>> => {
  const response = await api.get('/benefits/favorites', {
    params: { limit },
  });
  return response.data;
};

// 제휴처별 이용 통계 조회 함수
export const getPartnerUsageStats = async (
  period: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<ApiResponse<PartnerUsageStatsResponse>> => {
  const response = await api.get('/partners/usage-stats', {
    params: { period },
  });
  return response.data;
};
