import api from '../../../../../apis/axiosInstance';
import { getMockPartnersPage, searchMockPartners, mockPartnerStatistics } from '../data/mockData';

// API 응답 타입
export interface ApiResponse<T = unknown> {
  code: string;
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

// 페이지네이션 응답 타입
export interface PagedResponse<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

// 제휴처 데이터 타입 (API 응답 구조에 맞춤)
export interface Partner {
  benefitId: number;
  partnerName: string;
  mainCategory: string;
  category: string;
  type: '증정' | '할인';
  image: string;
  searchRank: number;
  favoriteRank: number;
  usageRank: number;
}

// 혜택 등급별 상세 정보 타입
export interface TierBenefit {
  grade: 'BASIC' | 'VIP' | 'VVIP';
  context: string;
  isAll: boolean;
}

// 혜택 상세 정보 타입
export interface BenefitDetail {
  benefitId: number;
  benefitName: string;
  description: string;
  benefitLimit: string;
  manual: string;
  url: string;
  partnerName: string;
  image: string;
  tierBenefit: TierBenefit[];
}

// 배치 갱신 결과 타입
export interface BenefitBatchRefreshResult {
  totalProcessed: number;
  newBenefits: number;
  updatedBenefits: number;
  failedBenefits: number;
  conflictResolutions: number;
  processingTime: string;
  startTime: string;
  endTime: string;
}

// 전체 제휴처 수 조회 API
export const getTotalBenefitCount = async (): Promise<ApiResponse<number>> => {
  const response = await api.get('/api/v1/benefits/total');
  return response.data;
};

// 전체 제휴처 목록 조회 API
export const getAllPartners = async (
  category?: string,
  type?: '증정' | '할인',
  page: number = 0,
  size: number = 8,
  sort: string = 'id,asc'
): Promise<ApiResponse<PagedResponse<Partner>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  if (category) params.append('category', category);
  if (type) params.append('type', type);

  const response = await api.get(`/api/v1/benefits?${params}`);
  return response.data;
};

// 제휴처 검색 API
export const searchBenefits = async (
  keyword: string,
  page: number = 0,
  size: number = 8,
  sort: string = 'id,asc'
): Promise<ApiResponse<PagedResponse<Partner>>> => {
  const params = new URLSearchParams({
    keyword,
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  const response = await api.get(`/api/v1/benefits/search?${params}`);
  return response.data;
};

// 혜택 상세 조회 API
export const getBenefitDetail = async (benefitId: number): Promise<ApiResponse<BenefitDetail>> => {
  const response = await api.get(`/api/v1/benefit/${benefitId}`);
  return response.data;
};

// 혜택 정보 수정 API
export const updateBenefit = async (
  benefitId: number,
  benefitData: Partial<BenefitDetail>
): Promise<ApiResponse<BenefitDetail>> => {
  const response = await api.put(`/api/v1/benefit/${benefitId}`, benefitData);
  return response.data;
};

// 혜택 정보 배치 갱신 API
export const refreshBenefitBatch = async (): Promise<
  ApiResponse<{ batchResult: BenefitBatchRefreshResult }>
> => {
  const response = await api.post('/api/v1/benefits/batch-refresh', {});
  return response.data;
};

// 기존 함수들을 더미 데이터로 동작하도록 래핑
export const getPartnersWithPagination = async (
  page: number = 1,
  itemsPerPage: number = 8,
  category?: string,
  benefitType?: string
): Promise<{
  data: Partner[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}> => {
  // 더미 데이터 사용
  return getMockPartnersPage(page, itemsPerPage, category, benefitType);
};

export const searchPartnersWithPagination = async (
  keyword: string,
  page: number = 1,
  itemsPerPage: number = 8
): Promise<{
  data: Partner[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}> => {
  // 더미 데이터 사용
  return searchMockPartners(keyword, page, itemsPerPage);
};

export const getPartnerStatistics = async (): Promise<{
  totalPartners: number;
  lastUpdated: string;
}> => {
  // 더미 데이터 사용
  return mockPartnerStatistics;
};
