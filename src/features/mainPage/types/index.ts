export interface Platform {
  id: string;
  name: string;
  category: string;
  address: string;
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