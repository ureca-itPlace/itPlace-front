import api from '../../../apis/axiosInstance';
import axios from 'axios';

// refresh API용 별도 axios 인스턴스 (interceptor 없음)
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
});

//refresh token API
export const refreshToken = () => {
  return refreshApi.post(
    '/api/v1/auth/reissue',
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

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
  return api.post('/api/v1/auth/loadUplusData', {
    phoneNumber,
  });
};

export const kakaoOAuthLogin = (code: string) => {
  console.log('🟡 카카오 OAuth 코드를 백엔드로 전송:', code);
  return api.post('/api/v1/auth/oauth/kakao', { code });
};
