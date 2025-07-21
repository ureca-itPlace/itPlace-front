import axiosInstance from '../../../apis/axiosInstance';

// API 응답 타입 정의
export interface TierBenefit {
  grade: 'BASIC' | 'VIP' | 'VVIP';
  context: string;
  isAll: boolean;
}

export interface BenefitItem {
  benefitId: number;
  benefitName: string;
  mainCategory: 'VIP_COCK' | 'BASIC_BENEFIT';
  usageType: 'ONLINE' | 'OFFLINE';
  category: string;
  image: string;
  tierBenefits: TierBenefit[];
  isFavorite: boolean;
  favoriteCount: number;
}

export interface BenefitResponse {
  content: BenefitItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface BenefitApiParams {
  mainCategory: 'VIP_COCK' | 'BASIC_BENEFIT';
  page?: number;
  size?: number;
  keyword?: string;
  category?: string;
  filter?: 'ONLINE' | 'OFFLINE';
  sort?: string;
}

// 즐겨찾기 요청 타입
export interface FavoriteRequest {
  benefitId: number;
}

// 혜택 상세 정보 타입
export interface BenefitDetailResponse {
  benefitId: number;
  benefitName: string;
  description: string;
  benefitLimit: string;
  manual: string;
  url: string;
  partnerName: string;
  image: string;
  tierBenefits: TierBenefit[];
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  code: string;
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

// 혜택 목록 조회 API
export const getBenefits = async (params: BenefitApiParams): Promise<BenefitResponse> => {
  try {
    // 기본값 설정
    const queryParams = {
      mainCategory: params.mainCategory,
      page: params.page ?? 0,
      size: params.size ?? 12,
      sort: params.sort ?? 'POPULARITY',
      ...(params.category && { category: params.category }),
      ...(params.filter && { filter: params.filter }),
      ...(params.keyword && { keyword: params.keyword }),
    };

    const response = await axiosInstance.get('/api/v1/benefit', { params: queryParams });
    return response.data.data;
  } catch (error) {
    console.error('혜택 데이터 로드 실패:', error);
    throw error;
  }
};

// 즐겨찾기 추가 API
export const addFavorite = async (benefitId: number): Promise<void> => {
  try {
    const requestBody: FavoriteRequest = { benefitId };
    await axiosInstance.post('/api/v1/favorites', requestBody);
  } catch (error) {
    console.error('즐겨찾기 추가 실패:', error);
    throw error;
  }
};

// 즐겨찾기 삭제 API
export const removeFavorite = async (benefitId: number): Promise<void> => {
  try {
    const requestBody: FavoriteRequest = { benefitId };
    await axiosInstance.delete('/api/v1/favorites', { data: requestBody });
  } catch (error) {
    console.error('즐겨찾기 삭제 실패:', error);
    throw error;
  }
};

// 혜택 상세 조회 API
export const getBenefitDetail = async (benefitId: number): Promise<BenefitDetailResponse> => {
  try {
    const response = await axiosInstance.get(`/api/v1/benefit/${benefitId}`);
    return response.data.data;
  } catch (error) {
    console.error('혜택 상세 정보 로드 실패:', error);
    throw error;
  }
};
