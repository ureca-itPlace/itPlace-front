import api from '../../../apis/axiosInstance';

export const login = (email: string, password: string) => {
  return api.post(
    '/api/v1/auth/login',
    { email, password },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const loadUplusData = (phoneNumber: string) => {
  return api.post('api/v1/auth/loadUplusData', {
    phoneNumber,
  });
};

export const kakaoOAuthLogin = (code: string) => {
  return api.post('api/v1/oauth2/authorization/kakao', { code });
};
