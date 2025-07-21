import React from 'react';

const FeatureCard = () => {
  return (
    <div className="bg-gray-600 flex flex-col items-center justify-center h-screen w-[1100px] ml-auto">
      <div className="flex items-center justify-center mb-20 mt-24 w-[964px] h-[476px]">
        <img
          src="/images/landing/landing-feature-1.png"
          alt="기능-소개1"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-14 ml-16 mr-20">
        <h1 className="text-title-1">지도에서 주변 제휴처를 한눈에!</h1>
        <h4 className="text-2xl leading-loose font-light pb-20">
          이제 복잡한 검색 없이 지도에서 내 주변의 제휴 매장과 혜택을 바로 확인하세요. 현재 위치를
          기준으로 가까운 제휴처들을 표시해 빠르게 찾고 편리하게 이용할 수 있습니다.
        </h4>
      </div>
    </div>
  );
};

export default FeatureCard;
