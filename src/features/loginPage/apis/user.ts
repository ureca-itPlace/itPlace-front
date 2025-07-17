// features/loginPage/apis/user.ts
import api from '../../../apis/axiosInstance';

export const getUserInfo = async () => {
  return api.get('/user/info');
};

export const signUpFinal = async (payload: {
  registrationId: string;
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
