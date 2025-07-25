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
  return await api.post('/api/v1/auth/signUp', payload);
};

// 인증번호 요청
export const sendFindEmailCode = async ({
  name,
  phoneNumber,
}: {
  name: string;
  phoneNumber: string;
}) => {
  return await api.post('/api/v1/users/findEmail', {
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
// 1. 인증번호 전송
export const sendFindPasswordEmail = async (email: string) => {
  return await api.post('/api/v1/users/findPassword', { email });
};

// 2. 인증번호 확인
export const checkResetEmailVerificationCode = async (email: string, verificationCode: string) => {
  return await api.post<{ code: string; message: string; data: { resetPasswordToken: string } }>(
    '/api/v1/users/findPassword/confirm',
    { email, verificationCode }
  );
};

// 3. 비밀번호 재설정 (추후 사용)
export const resetPassword = async ({
  email,
  resetPasswordToken,
  newPassword,
  newPasswordConfirm,
}: {
  email: string;
  resetPasswordToken: string;
  newPassword: string;
  newPasswordConfirm: string;
}) => {
  return await api.post('/api/v1/users/resetPassword', {
    email,
    resetPasswordToken,
    newPassword,
    newPasswordConfirm,
  });
};

export const oauthSignUp = (data: {
  name: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  membershipId: string;
}) => {
  return api.post('/api/v1/auth/oauth/signUp', data);
};

// reCAPTCHA 토큰 검증
export const verifyRecaptcha = async (recaptchaToken: string) => {
  return await api.post('/api/v1/auth/verify-recaptcha', {
    recaptchaToken,
  });
};

// /api/v1/users/findPassword
// 이메일만 넘겨주면 됨

// 이메일 인증확인
// /api/v1/users/findPassword/confirm
// email, verificationCode : request
// resetPasswordToken : response

// 비밀번호 변경
// /api/v1/users/resetPassword
// resetPasswordToken, email, newPassword, newPasswordConfirm
