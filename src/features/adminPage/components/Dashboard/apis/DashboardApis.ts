import api from '../../../../../apis/axiosInstance';
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
  period: '12h' | '1d' | '7d' = '1d',
  limit: number = 5
): Promise<ApiResponse<PartnerSearchRankingResponse>> => {
  try {
    const params = new URLSearchParams({
      period,
      limit: limit.toString(),
    });

    const response = await api.get(`/api/v1/partners/search-ranking?${params}`);
    return response.data;
  } catch (error) {
    console.error('제휴처 검색 순위 조회 실패:', error);
    // 에러 시 더미 데이터 반환
    const limitedData = mockSearchRanking.slice(0, limit);
    return {
      code: '200',
      status: 'SUCCESS',
      message: '성공',
      data: { searchRanking: limitedData },
      timestamp: new Date().toISOString(),
    };
  }
};

// 자주 클릭한 제휴처 조회 함수
export const getMostClickedPartners = async (
  limit: number = 3
): Promise<ApiResponse<MostClickedPartnersResponse>> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await api.get(`/api/v1/benefits/most-clicked?${params}`);
    return response.data;
  } catch (error) {
    console.error('자주 클릭한 제휴처 조회 실패:', error);
    // 에러 시 더미 데이터 반환
    const limitedData = mockClickStatistics.slice(0, limit);
    return {
      code: '200',
      status: 'SUCCESS',
      message: '성공',
      data: { partners: limitedData },
      timestamp: new Date().toISOString(),
    };
  }
};

// 즐겨찾기 통계 조회 함수
export const getFavoritesStatistics = async (
  limit: number = 5
): Promise<ApiResponse<FavoritesStatisticsResponse>> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await api.get(`/api/v1/benefits/favorites?${params}`);
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 통계 조회 실패:', error);
    // 에러 시 더미 데이터 반환
    const limitedData = mockWishlistRanking.slice(0, limit);
    return {
      code: '200',
      status: 'SUCCESS',
      message: '성공',
      data: { favoriteBenefits: limitedData },
      timestamp: new Date().toISOString(),
    };
  }
};

// 제휴처별 이용 통계 조회 함수
export const getPartnerUsageStats = async (
  period: '7d' | '30d' | '90d' | '1y' = '30d'
): Promise<ApiResponse<PartnerUsageStatsResponse>> => {
  try {
    const params = new URLSearchParams({
      period,
    });

    const response = await api.get(`/api/v1/partners/usage?${params}`);
    return response.data;
  } catch (error) {
    console.error('제휴처별 이용 통계 조회 실패:', error);
    // 에러 시 더미 데이터 반환
    return {
      code: '200',
      status: 'SUCCESS',
      message: '성공',
      data: { usageStats: mockUsageStatistics },
      timestamp: new Date().toISOString(),
    };
  }
};
