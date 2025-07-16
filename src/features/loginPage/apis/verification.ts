// features/loginPage/apis/verification.ts
import axiosInstance from '../../../apis/axiosInstance';

export const sendVerificationCode = (name: string, phone: string) => {
  return axiosInstance.post('/auth/send-code', { name, phone });
};

export const checkVerificationCode = async ({
  name,
  phoneNumber,
  code,
}: {
  name: string;
  phoneNumber: string;
  code: string;
}) => {
  return await axiosInstance.post('/verification/sms/confirm', {
    name,
    phoneNumber,
    code,
  });
};
