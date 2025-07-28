import api from '../../../apis/axiosInstance';
import { BenefitDetailRequest, BenefitDetailResponse } from '../types/api';

// 전역 중복 호출 방지
let isGlobalBenefitDetailLoading = false;

export const getBenefitDetail = async (
  params: BenefitDetailRequest
): Promise<BenefitDetailResponse> => {
  // 전역 중복 호출 방지
  if (isGlobalBenefitDetailLoading) {
    throw new Error('Duplicate request prevented');
  }
  
  isGlobalBenefitDetailLoading = true;
  
  try {
    const response = await api.get('/api/v1/benefit/map-detail', {
      params: {
        storeId: params.storeId,
        partnerId: params.partnerId,
        mainCategory: params.mainCategory,
      },
    });

    return response.data;
  } catch (error) {
    console.error('상세 혜택 정보 조회 실패:', error);
    throw error;
  } finally {
    isGlobalBenefitDetailLoading = false;
  }
};
