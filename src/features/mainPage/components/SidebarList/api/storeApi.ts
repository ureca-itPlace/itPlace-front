import api from '../../../../../apis/axiosInstance';
import { StoreApiResponse, StoreListParams, KakaoAddressResponse } from '../../../types/api';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY; // Vite 환경변수에서 카카오 REST API 키 가져오기

/**
 * 사용자 위치 기반 전체 지점 목록 조회
 */
export const getStoreList = async (params: StoreListParams): Promise<StoreApiResponse> => {
  const response = await api.get('/api/v1/maps/nearby', {
    params: {
      lat: params.lat,
      lng: params.lng,
      radiusMeters: params.radiusMeters,
    },
  });

  return response.data;
};

/**
 * 사용자 위치 기반 카테고리별 지점 목록 조회
 */
export const getStoreListByCategory = async (
  params: StoreListParams & { category?: string }
): Promise<StoreApiResponse> => {
  const response = await api.get('/api/v1/maps/nearby/category', {
    params: {
      lat: params.lat,
      lng: params.lng,
      radiusMeters: params.radiusMeters,
      category: params.category,
    },
  });

  return response.data;
};

/**
 * 카카오 API를 사용한 좌표→주소 변환
 */
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  console.log('카카오 API 키:', KAKAO_API_KEY ? '설정됨' : '설정되지 않음');
  console.log('API 키 앞 4자리:', KAKAO_API_KEY ? KAKAO_API_KEY.substring(0, 4) : 'undefined');
  console.log(
    '요청 URL:',
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`
  );

  if (!KAKAO_API_KEY) {
    console.warn('카카오 API 키가 설정되지 않았습니다.');
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
      console.warn(`카카오 API 요청 실패: ${response.status} - 임시로 기본 위치 사용`);
      return '현재 위치'; // 401 오류 시 기본값 반환
    }

    const data: KakaoAddressResponse = await response.json();

    if (data.documents.length > 0) {
      const address = data.documents[0];
      const roadAddress = address.road_address;
      const jibunAddress = address.address;

      // 도로명 주소가 있으면 도로명 주소 사용, 없으면 지번 주소 사용
      const targetAddress = roadAddress || jibunAddress;

      // 디버깅용 로그
      console.log('카카오 API 응답:', targetAddress);
      console.log('region_1depth_name:', targetAddress.region_1depth_name);
      console.log('region_2depth_name:', targetAddress.region_2depth_name);
      console.log('region_3depth_name:', targetAddress.region_3depth_name);

      // 시/구/동까지 표시
      const region1 = targetAddress.region_1depth_name; // 부산, 서울 등
      const region2 = targetAddress.region_2depth_name; // 남구, 강남구 등
      const region3 = targetAddress.region_3depth_name; // 대연동, 역삼동 등

      return `${region1} ${region2} ${region3}`;
    }

    return '현재 위치';
  } catch (error) {
    console.warn('주소 변환 실패 - 임시로 기본 위치 사용:', error);
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
