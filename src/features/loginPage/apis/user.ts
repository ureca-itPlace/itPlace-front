// features/loginPage/apis/user.ts
import axiosInstance from '../../../apis/axiosInstance';

export const getUserInfo = async () => {
  return axiosInstance.get('/user/info');
};

export const signUpFinal = (email: string, password: string) => {
  return axiosInstance.post('/auth/signup-final', {
    email,
    password,
  });
};
