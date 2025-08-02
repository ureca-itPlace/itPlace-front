import React, { useEffect, useState } from 'react';
import { fetchCouponCount } from '../api/eventApi';

const OwnedCouponCount = () => {
  const [couponCount, setCouponCount] = useState<number>(0);

  useEffect(() => {
    const getCouponCount = async () => {
      try {
        const count = await fetchCouponCount();
        setCouponCount(count);
      } catch (err) {
        console.error('쿠폰 개수 조회 실패:', err);
      }
    };

    getCouponCount();
  }, []);
  return (
    <div
      className="bg-white -mb-2 rounded-[18px] p-9 max-xl:p-6 text-center h-full"
      style={{
        boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 className="text-title-3 text-grey05 font-semibold max-xl:text-title-5 max-xl:font-semibold max-md:font-semibold max-sm:font-semibold mb-2 max-md:text-title-4 max-sm:text-title-7">
        내가 보유한 쿠폰 개수
      </h3>
      <p className="text-purple04 text-body-1 mb-4 max-xl:text-body-3 max-sm:text-body-3">
        보유한 쿠폰 개수만큼 도전할 수 있어요!
      </p>
      <div className="relative w-full flex justify-center items-center">
        <picture>
          <source srcSet="/images/event/coupon-count.webp" type="image/webp" />
          <img
            src="/images/event/coupon-count.png"
            alt="쿠폰 수 이미지"
            className="w-[310px] max-xl:w-[230px] max-sm:w-[240px]"
          />
        </picture>
        <div className="absolute top-[50%] text-[48px] font-bold max-xl:text-[42px] max-xl:font-bold max-sm:text-[38px] max-sm:font-bold text-white">
          {couponCount}개
        </div>
      </div>
    </div>
  );
};

export default OwnedCouponCount;
