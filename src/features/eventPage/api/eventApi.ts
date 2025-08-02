// src/apis/eventApi.ts
import api from '../../../apis/axiosInstance';

// ✅ 1. 보유 쿠폰 개수 조회
export const fetchCouponCount = async () => {
  const res = await api.get('api/v1/users/coupon');
  return res.data.data; // number
};

// ✅ 2. 상품 리스트 조회
export const fetchGiftList = async () => {
  const res = await api.get('api/v1/gifts');
  return res.data.data; // giftName만 배열로
};

// ✅ 3. 복권 긁기
export const postScratchCoupon = async () => {
  const res = await api.post('api/v1/gifts/scratch');
  return res.data.data; // success, message, gift
};

// ✅ 4. 쿠폰 사용 이력 조회
export const fetchCouponHistory = async (type?: 'SUCCESS') => {
  const res = await api.get('/api/v1/gifts/history', {
    ...(type ? { params: { type } } : {}), // type이 있을 때만 params 포함
  });
  return res.data.data;
};
