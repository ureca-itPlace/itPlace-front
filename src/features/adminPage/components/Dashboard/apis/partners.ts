import api from '../../../../../apis/axiosInstance';

// 제휴처 검색 순위 관련 타입
export interface PartnerSearchRankingItem {
  partnerName: string;
  searchCount: number;
  rank: number;
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

export interface ApiResponse<T = unknown> {
  code: string;
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

// 제휴처 검색 순위 조회 함수
export const getPartnersSearchRanking = async (
  period: '1d' | '7d' | '30d' = '7d'
): Promise<ApiResponse<PartnerSearchRankingResponse>> => {
  const response = await api.get('/partners/search-ranking', {
    params: { period },
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
