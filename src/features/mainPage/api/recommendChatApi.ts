// src/apis/recommend.ts
import api from '../../../apis/axiosInstance';
import {
  RecommendRequest,
  RecommendSuccessResponse,
  RecommendErrorResponse,
} from '../../../types/recommend';

export class RecommendationError extends Error {
  constructor(
    public code: string,
    public status: string,
    message: string
  ) {
    super(message);
    this.name = 'RecommendationError';
  }
}

export const getRecommendation = async ({
  question,
  lat,
  lng,
}: RecommendRequest): Promise<RecommendSuccessResponse> => {
  try {
    console.log('API 호출 시작:', { question, lat, lng });

    const response = await api.get<RecommendSuccessResponse>('/api/v1/questions/recommend', {
      params: {
        question,
        lat,
        lng,
      },
    });

    console.log('API 응답 성공:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.log('API 오류 발생:', error);

    // axios 오류 처리
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: RecommendErrorResponse;
          status?: number;
        };
      };
      console.log('Axios 오류 상세:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;

        // 서버 내부 오류인 경우 더 친화적인 메시지로 변경
        if (errorData.code === 'INTERNAL_SERVER_ERROR') {
          throw new Error(
            '현재 AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        }

        throw new RecommendationError(errorData.code, errorData.status, errorData.message);
      }

      // HTTP 상태 코드별 처리
      if (axiosError.response?.status === 500) {
        throw new Error('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      if (axiosError.response?.status === 401) {
        throw new Error('인증에 문제가 발생했습니다. 다시 로그인해주세요.');
      }

      if (axiosError.response?.status === 400) {
        throw new Error('잘못된 요청입니다. 질문을 다시 확인해주세요.');
      }
    }

    // 네트워크 오류 등 기타 오류
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};
