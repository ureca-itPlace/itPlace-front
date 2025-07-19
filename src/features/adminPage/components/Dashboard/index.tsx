import { useState, useEffect } from 'react';
import RankingList from '../../../../components/common/RankingList';
import WishlistChart from './WishlistChart';
import ClickStatistics from './ClickStatistics';
import UsageStatistics from './UsageStatistics';
import {
  getPartnersSearchRanking,
  PartnerSearchRankingItem,
  getMostClickedPartners,
  MostClickedPartnerItem,
  getFavoritesStatistics,
  FavoriteBenefitItem,
  getPartnerUsageStats,
  PartnerUsageStatsItem,
} from './apis/DashboardApis';
import { RankingItem, ClickDataItem, WishlistItem, UsageDataItem } from './types';

// API 응답을 RankingItem으로 변환하는 함수
const convertToRankingItem = (apiData: PartnerSearchRankingItem[]): RankingItem[] => {
  return apiData.map((item) => {
    let trend: 'up' | 'down' | 'keep' = 'keep';

    // API 응답의 changeDerection 필드를 기반으로 트렌드 설정
    switch (item.changeDerection) {
      case 'UP':
        trend = 'up';
        break;
      case 'DOWN':
        trend = 'down';
        break;
      case 'SAME':
      case 'NEW':
      default:
        trend = 'keep';
        break;
    }

    return {
      partnerName: item.partnerName,
      searchCount: item.searchCount,
      trend: trend,
      rankChange: item.rankChange,
    };
  });
};

// API 응답을 ClickDataItem으로 변환하는 함수
const convertToClickDataItem = (apiData: MostClickedPartnerItem[]): ClickDataItem[] => {
  const colors = ['#250961', '#A175FF', '#CDB5FF', '#F0E8FF', '#E6D9FF'];

  return apiData.map((item, index) => ({
    partnerName: item.partnerName,
    clickCount: item.clickCount,
    color: colors[index % colors.length],
  }));
};

// API 응답을 WishlistItem으로 변환하는 함수
const convertToWishlistItem = (apiData: FavoriteBenefitItem[]): WishlistItem[] => {
  const colors = ['#250961', '#A175FF', '#CDB5FF', '#F0E8FF', '#E6D9FF'];

  return apiData.map((item, index) => ({
    partnerName: item.partnerName,
    favoriteCount: item.favoriteCount,
    color: colors[index % colors.length],
  }));
};

// API 응답을 UsageDataItem으로 변환하는 함수
const convertToUsageDataItem = (apiData: PartnerUsageStatsItem[]): UsageDataItem[] => {
  return apiData.map((item) => ({
    partnerName: item.partnerName,
    vvipUsageCount: item.vvipUsageCount,
    vipUsageCount: item.vipUsageCount,
    basicUsageCount: item.basicUsageCount,
  }));
};

// 이용 통계 범례 데이터
const usageStatisticsLegends = [
  { key: 'vvip', label: 'VVIP', color: 'bg-purple04', fillColor: '#7638FA' },
  { key: 'vip', label: 'VIP', color: 'bg-purple03', fillColor: '#A175FF' },
  { key: 'regular', label: '우수', color: 'bg-purple02', fillColor: '#CDB5FF' },
];

const Dashboard = () => {
  const [searchRankingData, setSearchRankingData] = useState<RankingItem[]>([]);
  const [clickData, setClickData] = useState<ClickDataItem[]>([]);
  const [wishlistData, setWishlistData] = useState<WishlistItem[]>([]);
  const [usageData, setUsageData] = useState<UsageDataItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 제휴처 검색 순위 데이터 조회
        const searchRankingResponse = await getPartnersSearchRanking('7d', 5);
        const searchRankingItems = convertToRankingItem(searchRankingResponse.data.searchRanking);
        setSearchRankingData(searchRankingItems);

        // 자주 클릭한 제휴처 데이터 조회
        const mostClickedResponse = await getMostClickedPartners(3);
        const clickDataItems = convertToClickDataItem(mostClickedResponse.data.partners);
        setClickData(clickDataItems);

        // 즐겨찾기 통계 데이터 조회
        const favoritesResponse = await getFavoritesStatistics(5);
        const wishlistItems = convertToWishlistItem(favoritesResponse.data.favoriteBenefits);
        setWishlistData(wishlistItems);

        // 제휴처별 이용 통계 데이터 조회
        const usageStatsResponse = await getPartnerUsageStats('30d');
        const usageDataItems = convertToUsageDataItem(usageStatsResponse.data.usageStats);
        setUsageData(usageDataItems);
      } catch (err) {
        console.error('대시보드 데이터 조회 실패:', err);
        // 에러 발생 시 빈 배열로 초기화
        setSearchRankingData([]);
        setClickData([]);
        setWishlistData([]);
        setUsageData([]);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="pl-[28px] pt-[32px] pr-[28px] h-full">
      <h2 className="text-title-3 mb-[40px]">대시 보드</h2>

      {/* 상단 섹션 */}
      <div className="flex gap-[28px] mb-[28px]">
        <RankingList
          title="제휴처 검색 순위"
          subtitle="회원이 가장 많이 검색한 제휴처 Top 5"
          data={searchRankingData}
        />
        <WishlistChart
          title="제휴처별 찜 통계"
          subtitle="회원이 가장 많이 찜한 제휴처 Top 5"
          data={wishlistData}
          height={345}
        />
      </div>

      {/* 하단 섹션 */}
      <div className="flex gap-[28px]">
        <ClickStatistics
          title="자주 클릭한 제휴처"
          subtitle="회원 행동 기반 클릭 통계 집계 결과"
          data={clickData}
        />
        <UsageStatistics
          title="제휴처별 이용 통계"
          subtitle="회원이 가장 많이 이용한 제휴처 Top 5"
          data={usageData}
          legends={usageStatisticsLegends}
        />
      </div>
    </div>
  );
};

export default Dashboard;
