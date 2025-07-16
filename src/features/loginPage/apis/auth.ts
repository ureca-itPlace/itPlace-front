import axiosInstance from '../../../apis/axiosInstance';

export const login = (email: string, password: string) => {
  return axiosInstance.post('/login', { email, password });
};
