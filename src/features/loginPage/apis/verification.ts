// features/loginPage/apis/verification.ts
import axiosInstance from '../../../apis/axiosInstance';

export const sendVerificationCode = (name: string, phone: string) => {
  return axiosInstance.post('/auth/send-code', { name, phone });
};

export const checkVerificationCode = (phone: string, code: string) => {
  return axiosInstance.post('/auth/verify-code', { phone, code });
};
