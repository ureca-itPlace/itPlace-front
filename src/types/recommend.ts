// src/types/recommend.ts
export interface Partner {
  partnerName: string;
  imgUrl: string;
}

export interface RecommendData {
  reason: string;
  partners: Partner[];
}

export interface RecommendSuccessResponse {
  code: 'QUESTION_SUCCESS';
  status: 'OK';
  message: string;
  data: RecommendData;
  timestamp: string;
}

export interface RecommendErrorResponse {
  code: 'FORBIDDEN_WORD_DETECTED' | 'NO_STORE_FOUND' | string;
  status: 'BAD_REQUEST' | 'NOT_FOUND' | string;
  message: string;
  data: null;
  timestamp: string;
}

export interface RecommendRequest {
  question: string;
  lat: number;
  lng: number;
}
