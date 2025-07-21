export interface Platform {
  id: string;
  storeId: number;
  partnerId: number;
  name: string;
  category: string;
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
  benefits: string[];
  rating: number;
  distance: number;
  imageUrl?: string;
  phone?: string;
  hours?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
}
