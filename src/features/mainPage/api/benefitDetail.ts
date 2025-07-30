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
  } finally {
    isGlobalBenefitDetailLoading = false;
  }
};

export const submitUsageAmount = (benefitId: number, amount: number) => {
  return api.post('/api/v1/membership-history/use', {
    benefitId,
    amount,
  });
};
