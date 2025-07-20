// src/features/myPage/apis/uplus.ts
import axiosInstance from '../../../apis/axiosInstance';

/**
 * LG U+ 회원정보를 불러오는 API
 * @param phone 휴대폰 번호 (01012345678 형식)
 */
export async function loadUplusData(phone: string) {
  try {
    const response = await axiosInstance.get(`/uplus/user`, {
      params: {
        phoneNumber: phone,
      },
    });
    return response; // response.data 에서 code, message, data 접근 가능
  } catch (error) {
    console.error('❌ [loadUplusData] API 호출 실패:', error);
    throw error;
  }
}
