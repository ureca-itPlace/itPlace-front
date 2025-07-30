import api from '../../../apis/axiosInstance';
import { ItplaceAiResponse } from '../types/api';

export const getItplaceAiStores = async (
  partnerName: string,
  lat: number,
  lng: number
): Promise<ItplaceAiResponse> => {
  const response = await api.get(`/api/v1/maps/nearby/itplace-ai`, {
    params: { partnerName, lat, lng },
  });
  return response.data;
};
