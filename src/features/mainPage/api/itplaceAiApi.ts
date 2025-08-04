import api from '../../../apis/axiosInstance';
import { ItplaceAiResponse } from '../types/api';

export const getItplaceAiStores = async (
  partnerName: string,
  lat: number,
  lng: number,
  userLat?: number,
  userLng?: number
): Promise<ItplaceAiResponse> => {
  const response = await api.get(`/api/v1/maps/nearby/itplace-ai`, {
    params: { partnerName, lat, lng, userLat, userLng },
  });
  return response.data;
};
