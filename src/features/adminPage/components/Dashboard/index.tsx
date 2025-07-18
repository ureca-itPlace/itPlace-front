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

// 기본 데이터 (API 호출 실패 시 사용)
const defaultSearchRankingData = [
  { partnerName: 'CGV', searchCount: 200, trend: 'up' as const },
  { partnerName: '야놀자 클라우드프로그램코리아', searchCount: 400, trend: 'keep' as const },
  { partnerName: '롯데시네마', searchCount: 50, trend: 'down' as const },
  { partnerName: 'CU', searchCount: 80, trend: 'up' as const },
  { partnerName: '뽀로로랜드', searchCount: 50, trend: 'keep' as const },
];

// 제휴처별 찜 통계 기본 데이터
const defaultWishlistData = [
  { partnerName: '올리브영', favoriteCount: 1200, color: '#250961' },
  { partnerName: '롯데월드', favoriteCount: 997, color: '#530CC2' },
  { partnerName: '야놀자 클라우드...', favoriteCount: 754, color: '#7638FA' },
  { partnerName: 'CGV', favoriteCount: 509, color: '#A175FF' },
  { partnerName: '뽀로로파크', favoriteCount: 309, color: '#CDB5FF' },
];

// 자주 클릭한 제휴처 기본 데이터
const defaultClickData = [
  { partnerName: '야놀자 클라우드프로그램코리아', clickCount: 50000, color: '#250961' },
  { partnerName: '야놀자 클라우드프로그램코리아 (여행)', clickCount: 32000, color: '#A175FF' },
  { partnerName: '야놀자 클라우드프로그램코리아 (숙박)', clickCount: 62000, color: '#CDB5FF' },
];

// 제휴처별 이용 통계 기본 데이터
const defaultUsageData = [
  { partnerName: 'CGV', vvipUsageCount: 40, vipUsageCount: 20, basicUsageCount: 25 },
  { partnerName: '야놀자글로벌...', vvipUsageCount: 45, vipUsageCount: 25, basicUsageCount: 30 },
  { partnerName: 'GS25', vvipUsageCount: 45, vipUsageCount: 8, basicUsageCount: 15 },
  { partnerName: '세븐일레븐', vvipUsageCount: 35, vipUsageCount: 30, basicUsageCount: 50 },
  { partnerName: '뽀로로파크', vvipUsageCount: 50, vipUsageCount: 10, basicUsageCount: 50 },
];

// 이용 통계 범례 데이터
const usageStatisticsLegends = [
  { key: 'vvip', label: 'VVIP', color: 'bg-purple04', fillColor: '#7638FA' },
  { key: 'vip', label: 'VIP', color: 'bg-purple03', fillColor: '#A175FF' },
  { key: 'regular', label: '우수', color: 'bg-purple02', fillColor: '#CDB5FF' },
];

const Dashboard = () => {
  const [searchRankingData, setSearchRankingData] = useState<RankingItem[]>([]);
  const [clickData, setClickData] = useState<ClickDataItem[]>(defaultClickData);
  const [wishlistData, setWishlistData] = useState<WishlistItem[]>(defaultWishlistData);
  const [usageData, setUsageData] = useState<UsageDataItem[]>(defaultUsageData);

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
        // 에러 발생 시 기본 데이터 사용
        setSearchRankingData(defaultSearchRankingData);
        setClickData(defaultClickData);
        setWishlistData(defaultWishlistData);
        setUsageData(defaultUsageData);
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
