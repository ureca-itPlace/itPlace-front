import api from '../../../apis/axiosInstance';

export const login = (email: string, password: string) => {
  return api.post('api/v1/auth/login', { email, password });
};

export const loadUplusData = (registrationId: string, name: string, phoneNumber: string) => {
  return api.post('api/v1/auth/loadUplusData', {
    registrationId,
    name,
    phoneNumber,
  });
};
