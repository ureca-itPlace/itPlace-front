// 지점 목록 API 타입 정의

export interface StoreApiResponse {
  code: string;
  status: string;
  message: string;
  data: StoreData[];
}

export interface StoreData {
  store: Store;
  partner: Partner;
  tierBenefit: TierBenefit[];
}

export interface Store {
  storeId: number;
  storeName: string;
  business: string;
  city: string;
  town: string;
  legalDong: string;
  address: string;
  roadName: string;
  roadAddress: string;
  postCode: string;
  latitude: number;
  longitude: number;
}

export interface Partner {
  partnerId: number;
  partnerName: string;
  image: string;
  category: string;
}

export interface TierBenefit {
  grade: string;
  context: string;
}

// 카카오 좌표→주소 변환 API 타입
export interface KakaoAddressResponse {
  meta: {
    total_count: number;
  };
  documents: KakaoAddress[];
}

export interface KakaoAddress {
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  } | null;
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
  };
}

// API 파라미터 타입
export interface StoreListParams {
  lat: number;
  lng: number;
  radiusMeters: number;
}
