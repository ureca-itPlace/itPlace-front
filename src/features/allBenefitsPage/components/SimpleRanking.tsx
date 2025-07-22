import React, { useState, useEffect } from 'react';
import { getPartnersSearchRanking, PartnerSearchRankingItem } from '../apis/allBenefitsApi';
import { mockSearchRanking } from '../data/mockData';

// 로컬 RankingItem 타입 정의
interface RankingItem {
  partnerName: string;
  searchCount: number;
  trend: 'up' | 'down' | 'keep';
  rankChange: number | null;
}

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

const SimpleRanking: React.FC = () => {
  const [data, setData] = useState<RankingItem[]>([]);
  const title = '지금 많이 검색되고 있어요 !';
  const width = 555;
  const height = 250;

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        // 제휴처 검색 순위 데이터 조회 (상위 3개)
        const searchRankingResponse = await getPartnersSearchRanking('7d', 3);
        const searchRankingItems = convertToRankingItem(searchRankingResponse.data.searchRanking);
        setData(searchRankingItems);
      } catch (err) {
        console.error('랭킹 데이터 조회 실패:', err);
        // 에러 발생 시 mock 데이터 사용
        const mockItems = convertToRankingItem(mockSearchRanking.slice(0, 3));
        setData(mockItems);
      }
    };

    fetchRankingData();
  }, []);
  return (
    <div className="bg-orange01 rounded-[18px] drop-shadow-basic p-6" style={{ width, height }}>
      <h3 className="text-title-3 text-black mb-6">{title}</h3>
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between ">
            <div className="flex items-center gap-4">
              <span className="text-title-5 text-orange04">{index + 1}</span>
              <span className="text-body-0 text-black">{item.partnerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-body-2  w-4 text-center transition-all duration-200 ${
                  item.trend === 'up'
                    ? 'text-orange04'
                    : item.trend === 'down'
                      ? 'text-grey03'
                      : 'text-grey03'
                }`}
              >
                {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '-'}
              </span>
              <span
                className={`text-body-2  w-8 text-right  transition-all duration-200 ${
                  item.trend === 'up'
                    ? 'text-orange04'
                    : item.trend === 'down'
                      ? 'text-grey03'
                      : 'text-grey03'
                }`}
              >
                {item.rankChange ? Math.abs(item.rankChange) : '-'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleRanking;
