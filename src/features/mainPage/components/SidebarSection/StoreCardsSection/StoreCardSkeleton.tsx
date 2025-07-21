import React from 'react';

const StoreCardSkeleton: React.FC = () => {
  return (
    <div className="w-[370px] px-5 bg-white">
      <div className="py-4">
        {/* 상단부: 가맹점 정보 + 로고 스켈레톤 */}
        <div className="flex justify-between items-start mb-4">
          {/* 왼쪽: 가맹점 정보 스켈레톤 */}
          <div className="flex flex-col">
            {/* 1줄: 가맹점명 + 카테고리 스켈레톤 */}
            <div className="flex items-center gap-4 mb-2">
              <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            {/* 2줄: 거리 + 주소 스켈레톤 */}
            <div className="flex items-center gap-3 mb-1">
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* 오른쪽: 브랜드 로고 스켈레톤 */}
          <div className="w-[45px] h-[45px] bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
        </div>

        {/* 하단부: 혜택 내용 박스 스켈레톤 */}
        <div className="rounded-[10px] p-3 w-[330px] bg-grey01">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>

          <div className="space-y-1">
            {[1, 2, 3].map((index) => (
              <div key={index} className="grid grid-cols-[20px_60px_1fr] gap-2 items-center">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCardSkeleton;
