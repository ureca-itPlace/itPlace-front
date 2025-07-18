// features/loginPage/apis/verification.ts
import api from '../../../apis/axiosInstance';

//인증번호 요청
export const sendVerificationCode = async (name: string, phoneNumber: string) => {
  const response = await api.post('/api/v1/verification/sms', { name, phoneNumber });
  return response.data;
};

//인증번호 확인
export const checkVerificationCode = async ({
  registrationId,
  phoneNumber,
  verificationCode,
}: {
  registrationId: string;
  phoneNumber: string;
  verificationCode: string;
}) => {
  return await api.post('api/v1/verification/sms/confirm', {
    registrationId,
    phoneNumber,
    verificationCode,
  });
};

//이메일 인증번호 전송 요청
export const sendEmailVerificationCode = async ({
  email,
  registrationId,
}: {
  email: string;
  registrationId: string;
}) => {
  return await api.post('api/v1/verification/email', {
    registrationId,
    email,
  });
};

//이메일 인증번호 확인인
export const checkEmailVerificationCode = async (
  email: string,
  verificationCode: string,
  registrationId: string
) => {
  return await api.post('api/v1/verification/email/confirm', {
    registrationId,
    email,
    verificationCode,
  });
};
