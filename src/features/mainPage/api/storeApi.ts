import api from '../../../apis/axiosInstance';
import {
  StoreApiResponse,
  StoreListParams,
  KakaoAddressResponse,
  SearchStoresParams,
} from '../types/api';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY; // Vite 환경변수에서 카카오 REST API 키 가져오기

/**
 * 사용자 위치 기반 전체 지점 목록 조회
 */
export const getStoreList = async (
  params: StoreListParams & { userLat?: number; userLng?: number }
): Promise<StoreApiResponse> => {
  const response = await api.get('/api/v1/maps/nearby', {
    params: {
      lat: params.lat,
      lng: params.lng,
      radiusMeters: params.radiusMeters,
      userLat: params.userLat,
      userLng: params.userLng,
    },
  });

  return response.data;
};

/**
 * 사용자 위치 기반 카테고리별 지점 목록 조회
 */
export const getStoreListByCategory = async (
  params: StoreListParams & { category?: string; userLat?: number; userLng?: number }
): Promise<StoreApiResponse> => {
  const response = await api.get('/api/v1/maps/nearby/category', {
    params: {
      lat: params.lat,
      lng: params.lng,
      radiusMeters: params.radiusMeters,
      category: params.category,
      userLat: params.userLat,
      userLng: params.userLng,
    },
  });

  return response.data;
};

/**
 * 키워드 검색을 통한 지점 목록 조회
 */
export const searchStores = async (
  params: SearchStoresParams & { userLat?: number; userLng?: number }
): Promise<StoreApiResponse> => {
  const response = await api.get('/api/v1/maps/nearby/search', {
    params: {
      lat: params.lat,
      lng: params.lng,
      category: params.category,
      keyword: params.keyword,
      userLat: params.userLat,
      userLng: params.userLng,
    },
  });

  return response.data;
};

/**
 * 카카오 API를 사용한 좌표→주소 변환
 */
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  if (!KAKAO_API_KEY) {
    return '현재 위치';
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return '현재 위치'; // 401 오류 시 기본값 반환
    }

    const data: KakaoAddressResponse = await response.json();

    if (data.documents.length > 0) {
      const address = data.documents[0];
      const roadAddress = address.road_address;
      const jibunAddress = address.address;

      // 도로명 주소가 있으면 도로명 주소 사용, 없으면 지번 주소 사용
      const targetAddress = roadAddress || jibunAddress;

      // 시/구/동까지 표시
      const region1 = targetAddress.region_1depth_name; // 부산, 서울 등
      const region2 = targetAddress.region_2depth_name; // 남구, 강남구 등
      const region3 = targetAddress.region_3depth_name; // 대연동, 역삼동 등

      return `${region1} ${region2} ${region3}`;
    }

    return '현재 위치';
  } catch {
    return '현재 위치'; // 에러 시에도 기본값 반환
  }
};

/**
 * 브라우저에서 현재 위치 가져오기
 */
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation이 지원되지 않는 브라우저입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`위치 정보 가져오기 실패: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      }
    );
  });
};
