export interface RankingItem {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'keep';
}

export interface WishlistItem {
  name: string;
  value: number;
  color: string;
}

export interface ClickDataItem {
  name: string;
  value: number;
  color: string;
}

export interface UsageDataItem {
  name: string;
  vvip: number;
  vip: number;
  regular: number;
}

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  fillColor: string;
}
