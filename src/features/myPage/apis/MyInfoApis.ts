// src/features/myPage/apis/MyInfoApis.ts
import axiosInstance from '../../../apis/axiosInstance';

export const getUserInfo = async (userId: number) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data.data; // { id, name, email, phoneNumber, gender, birthday, membershipId, grade }
};
