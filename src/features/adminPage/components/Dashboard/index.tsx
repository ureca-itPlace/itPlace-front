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
} from './apis/partners';
import { RankingItem, ClickDataItem, WishlistItem } from './types';

// API 응답을 RankingItem으로 변환하는 함수
const convertToRankingItem = (apiData: PartnerSearchRankingItem[]): RankingItem[] => {
  return apiData.map((item) => ({
    name: item.partnerName,
    value: item.searchCount,
    trend: 'keep' as const, // API에서 trend 정보가 없으므로 기본값 설정
  }));
};

// API 응답을 ClickDataItem으로 변환하는 함수
const convertToClickDataItem = (apiData: MostClickedPartnerItem[]): ClickDataItem[] => {
  const colors = ['#250961', '#A175FF', '#CDB5FF', '#F0E8FF', '#E6D9FF'];
  return apiData.map((item, index) => ({
    name: item.partnerName,
    value: item.clickCount,
    color: colors[index % colors.length],
  }));
};

// API 응답을 WishlistItem으로 변환하는 함수
const convertToWishlistItem = (apiData: FavoriteBenefitItem[]): WishlistItem[] => {
  const colors = ['#250961', '#A175FF', '#CDB5FF', '#F0E8FF', '#E6D9FF'];
  return apiData.map((item, index) => ({
    name: item.partnerName,
    value: item.favoriteCount,
    color: colors[index % colors.length],
  }));
};

// 제휴처별 찜 통계 데이터 (기본 데이터)
const defaultHouseRegistrationData = [
  { name: '올리브영', value: 1200, color: '#250961' },
  { name: '롯데월드', value: 997, color: '#A175FF' },
  { name: '야놀자 클라우드...', value: 754, color: '#CDB5FF' },
  { name: 'CGV', value: 509, color: '#F0E8FF' },
];

// 가장 클릭한 제휴처 원그래프 데이터 (기본 데이터)
const defaultClickData = [
  { name: '야놀자 클라우드프로그램코리아', value: 50000, color: '#250961' },
  { name: '야놀자 클라우드프로그램코리아 (여행)', value: 32000, color: '#A175FF' },
  { name: '야놀자 클라우드프로그램코리아 (숙박)', value: 62000, color: '#CDB5FF' },
];

// 제휴처별 이용 통계 데이터 (기존 데이터 유지)
const usageData = [
  { name: 'CGV', vvip: 40, vip: 20, regular: 25 },
  { name: '야놀자글로벌...', vvip: 45, vip: 25, regular: 30 },
  { name: 'GS25', vvip: 45, vip: 8, regular: 15 },
  { name: '세븐일레븐', vvip: 35, vip: 30, regular: 50 },
  { name: '뽀로로파크', vvip: 50, vip: 10, regular: 50 },
];

// 이용 통계 범례 데이터 (기존 데이터 유지)
const usageLegends = [
  { key: 'vvip', label: 'VVIP', color: 'bg-purple04', fillColor: '#7638FA' },
  { key: 'vip', label: 'VIP', color: 'bg-purple03', fillColor: '#A175FF' },
  { key: 'regular', label: '우수', color: 'bg-purple02', fillColor: '#CDB5FF' },
];

const Dashboard = () => {
  const [searchRankingData, setSearchRankingData] = useState<RankingItem[]>([]);
  const [clickData, setClickData] = useState<ClickDataItem[]>(defaultClickData);
  const [wishlistData, setWishlistData] = useState<WishlistItem[]>(defaultHouseRegistrationData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 검색 순위 데이터 가져오기
        const searchResponse = await getPartnersSearchRanking('7d');
        const convertedSearchData = convertToRankingItem(searchResponse.data.searchRanking);
        setSearchRankingData(convertedSearchData);

        // 클릭 데이터 가져오기
        const clickResponse = await getMostClickedPartners(3);
        const convertedClickData = convertToClickDataItem(clickResponse.data.partners);
        setClickData(convertedClickData);

        // 즐겨찾기 데이터 가져오기
        const favoritesResponse = await getFavoritesStatistics(4);
        const convertedWishlistData = convertToWishlistItem(
          favoritesResponse.data.favoriteBenefits
        );
        setWishlistData(convertedWishlistData);
      } catch (err) {
        console.error('대시보드 데이터 조회 실패:', err);
        // 에러 발생 시 기본 데이터 사용
        setSearchRankingData([
          { name: 'CGV', value: 200, trend: 'up' as const },
          { name: '야놀자 클라우드프로그램코리아', value: 400, trend: 'keep' as const },
          { name: '롯데시네마', value: 50, trend: 'down' as const },
          { name: 'CU', value: 80, trend: 'up' as const },
          { name: '뽀로로랜드', value: 50, trend: 'keep' as const },
        ]);
        setClickData(defaultClickData);
        setWishlistData(defaultHouseRegistrationData);
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
          subtitle="회원이 가장 많이 찜한 제휴처 Top 4"
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
          legends={usageLegends}
        />
      </div>
    </div>
  );
};

export default Dashboard;
