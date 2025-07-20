export interface RankingItem {
  partnerName: string;
  searchCount: number;
  trend: 'up' | 'down' | 'keep';
  rankChange: number | null;
}

export interface WishlistItem {
  partnerName: string;
  favoriteCount: number;
  color: string;
}

export interface ClickDataItem {
  partnerName: string;
  clickCount: number;
  color: string;
}

export interface UsageDataItem {
  partnerName: string;
  vvipUsageCount: number;
  vipUsageCount: number;
  basicUsageCount: number;
}

export interface LegendItem {
  key: string;
  label: string;
  color: string;
  fillColor: string;
}
