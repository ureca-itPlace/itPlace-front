import api from '../../../../../apis/axiosInstance';
import { getMockMembersPage, searchMockMembers, mockMemberStatistics } from '../data/mockData';

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

// 회원 데이터 타입 (API 응답 구조에 맞춤)
export interface Member {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  grade: 'VVIP' | 'VIP' | 'BASIC' | null;
  userType: 'LINKED' | 'STANDARD';
}

// 회원 통계 응답 타입
export interface MemberStatistics {
  totalUsers: number;
  lastUpdated: string;
}

// 배치 갱신 결과 타입
export interface BatchRefreshResult {
  totalProcessed: number;
  newUsers: number;
  updatedUsers: number;
  deactivatedUsers: number;
  failedUsers: number;
  processingTime: string;
  startTime: string;
  endTime: string;
}

// 사용자 혜택 이용내역 타입
export interface UserBenefitUsage {
  benefitId: number;
  benefitName?: string;
  partnerName?: string;
  usageDate: string;
  discountAmount: number;
}

export interface UserDetail {
  userId: number;
  userName: string;
  grade: string;
  membershipId: number;
  membershipUsage: UserBenefitUsage[];
}

// 전체 사용자 수 조회 API
export const getTotalUserCount = async (): Promise<ApiResponse<number>> => {
  const response = await api.get('/api/v1/users/total');
  return response.data;
};

// 전체 사용자 목록 조회 API
export const getAllUsers = async (
  userType?: 'LINKED' | 'STANDARD',
  grade?: 'VVIP' | 'VIP' | 'BASIC',
  page: number = 0,
  size: number = 8,
  sort: string = 'id,asc'
): Promise<ApiResponse<PagedResponse<Member>>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
  });

  if (userType) params.append('userType', userType);
  if (grade) params.append('grade', grade);

  const response = await api.get(`/api/v1/users?${params}`);
  return response.data;
};

// 사용자 검색 API
export const searchUsers = async (
  keyword: string,
  page: number = 0,
  size: number = 8
): Promise<ApiResponse<PagedResponse<Member>>> => {
  const params = new URLSearchParams({
    keyword,
    page: page.toString(),
    size: size.toString(),
  });

  const response = await api.get(`/api/v1/users/search?${params}`);
  return response.data;
};

// 사용자 혜택 이용내역 조회 API
export const getUserBenefitUsage = async (userId: number): Promise<ApiResponse<UserDetail>> => {
  const response = await api.get(`/api/v1/users/${userId}`);
  return response.data;
};

// 사용자 정보 배치 갱신 API
export const refreshUserBatch = async (): Promise<
  ApiResponse<{ batchResult: BatchRefreshResult }>
> => {
  const response = await api.post('/api/v1/users/batch-refresh', {});
  return response.data;
};

// 기존 함수들을 새로운 API 구조에 맞게 래핑
export const getMembersWithPagination = async (
  page: number = 1,
  itemsPerPage: number = 8,
  userType?: string,
  grade?: string
): Promise<{
  data: Member[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}> => {
  // 더미 데이터 사용
  return getMockMembersPage(page, itemsPerPage, userType, grade);
};

export const searchMembersWithPagination = async (
  keyword: string,
  page: number = 1,
  itemsPerPage: number = 8
): Promise<{
  data: Member[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}> => {
  // 더미 데이터 사용
  return searchMockMembers(keyword, page, itemsPerPage);
};

export const getMemberStatistics = async (): Promise<{
  totalMembers: number;
  lastUpdated: string;
}> => {
  // 더미 데이터 사용
  return mockMemberStatistics;
};
