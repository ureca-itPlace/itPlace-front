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

// 상세 혜택 API 타입 정의
export interface BenefitDetailRequest {
  storeId: number;
  partnerId: number;
  mainCategory: 'VIP_COCK' | 'BASIC_BENEFIT';
}

export interface BenefitDetailResponse {
  code: string;
  status: string;
  message: string;
  timestamp: string;
  data: BenefitDetailData;
}

export interface BenefitDetailData {
  benefitId: string;
  benefitName: string;
  mainCategory: string;
  manual: string;
  url: string;
  tierBenefits: DetailTierBenefit[];
  isFavorite: boolean;
}

export interface DetailTierBenefit {
  grade: string;
  context: string;
  isAll: boolean;
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

// 즐겨찾기 API 타입
export interface FavoriteRequest {
  benefitId: number;
}

export interface FavoriteResponse {
  code: string;
  status: string;
  message: string;
  data: null;
  timestamp: string;
}

// 검색 API 타입
export interface SearchStoresParams {
  lat: number;
  lng: number;
  radiusMeters: number;
  category?: string;
  keyword: string;
}

// 즐겨찾기 목록 조회 API 타입
export interface FavoritesListRequest {
  category?: string;
}

export interface FavoriteBenefit {
  benefitId: number;
  benefitName: string;
  partnerName: string;
  partnerImage: string;
}
