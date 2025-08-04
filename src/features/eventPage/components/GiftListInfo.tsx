import { useEffect, useState } from 'react';
import { fetchGiftList } from '../api/eventApi';

const GiftListInfo = () => {
  const [giftList, setGiftList] = useState<string[]>([]);

  useEffect(() => {
    const getGifts = async () => {
      try {
        const gifts = await fetchGiftList();
        const names = gifts.map((gift: { giftName: string }) => gift.giftName);
        setGiftList(names);
      } catch (error) {
        console.error('상품 리스트 조회 실패:', error);
      }
    };

    getGifts();
  }, []);

  return (
    <div
      className="bg-white rounded-[18px] p-9 max-xl:p-6 max-md:p-9 text-center h-full"
      style={{
        boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 className="text-title-3 text-grey05 font-semibold mb-2 max-xl:text-title-5 max-xl:font-semibold max-md:font-semibold max-sm:font-semibold max-md:text-title-4 max-sm:text-title-7">
        상품 리스트
      </h3>
      <p className="text-purple04 text-body-1 mb-9 max-xl:mb-6 max-xl:text-body-3 max-sm:text-body-3">
        행운 쿠폰으로 받을 수 있는 선물이에요!
      </p>

      <ul className="space-y-3 text-title-5 text-grey05 max-xl:text-title-8 max-sm:text-title-8 text-left inline-block">
        {giftList.map((item, index) => (
          <li key={index}>
            <span className="text-purple04 mr-5 max-sm:mr-1">{index + 1}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GiftListInfo;
