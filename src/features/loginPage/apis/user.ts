// features/loginPage/apis/user.ts
import api from '../../../apis/axiosInstance';

export const signUpFinal = async (payload: {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  birthday: string;
  membershipId: string;
}) => {
  return await api.post('api/v1/auth/signUp', payload);
};

// 인증번호 요청
export const sendFindEmailCode = async ({
  name,
  phoneNumber,
}: {
  name: string;
  phoneNumber: string;
}) => {
  return await api.post('/api/v1/auth/findEmail', {
    name,
    phoneNumber,
  });
};

// 인증번호 확인 → 이메일 반환
export const confirmFindEmail = async ({
  name,
  phoneNumber,
  verificationCode,
}: {
  name: string;
  phoneNumber: string;
  verificationCode: string;
}) => {
  return await api.post(
    '/api/v1/users/findEmail/confirm',
    {
      name,
      phoneNumber,
      verificationCode,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

//비밀번호
export const sendFindPasswordEmail = async (email: string) => {
  return await api.post('/api/v1/users/findPassword', { email });
};

// /api/v1/users/findPassword
// 이메일만 넘겨주면 됨
