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

interface SimpleRankingProps {
  className?: string;
}

const SimpleRanking: React.FC<SimpleRankingProps> = ({ className = '' }) => {
  const [data, setData] = useState<RankingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // 모바일 슬라이드용
  const title = '지금 많이 검색되고 있어요 !';

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

  // 모바일에서만 슬라이드(롤링) 동작
  useEffect(() => {
    if (data.length <= 1) return;
    // matchMedia로 모바일(max-md) 여부 체크
    const mq = window.matchMedia('(max-width: 768px)');
    if (!mq.matches) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 2500); // 2.5초마다 변경
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div
      className={`bg-orange01 rounded-[18px] drop-shadow-basic p-6 max-md:pt-4 w-[555px] h-[250px] max-md:w-[350px] max-md:h-[100px] ${className}`}
    >
      {/* PC: 전체 리스트, 모바일: 슬라이드 */}
      <h3 className="text-title-3 text-black mb-6 max-md:text-title-6 max-md:mb-4">{title}</h3>
      {/* PC (md 이상) */}
      <div className="space-y-6 max-md:hidden">
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
      {/* 모바일 (md 이하): 슬라이드로 1개씩 */}
      <div className="hidden max-md:block">
        {data.length > 0 && (
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4">
              <span className="text-title-8 text-orange04">{currentIndex + 1}</span>
              <span className="text-body-2 text-black">{data[currentIndex].partnerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-body-2  w-4 text-center transition-all duration-200 ${
                  data[currentIndex].trend === 'up'
                    ? 'text-orange04'
                    : data[currentIndex].trend === 'down'
                      ? 'text-grey03'
                      : 'text-grey03'
                }`}
              >
                {data[currentIndex].trend === 'up'
                  ? '▲'
                  : data[currentIndex].trend === 'down'
                    ? '▼'
                    : '-'}
              </span>
              <span
                className={`text-body-2  w-8 text-right  transition-all duration-200 ${
                  data[currentIndex].trend === 'up'
                    ? 'text-orange04'
                    : data[currentIndex].trend === 'down'
                      ? 'text-grey03'
                      : 'text-grey03'
                }`}
              >
                {data[currentIndex].rankChange ? Math.abs(data[currentIndex].rankChange) : '-'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleRanking;
