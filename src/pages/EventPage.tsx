import { BiSolidMegaphone } from 'react-icons/bi';

const EventPage = () => {
  return (
    <main className="px-[28px] pt-5 max-md:px-5 pb-10">
      {/* Tip 영역 */}
      <section className="bg-grey01 rounded-[10px] p-5 flex items-start gap-2 mb-6">
        <BiSolidMegaphone className="text-title-5 text-purple04 animate-floating" />
        <span className="text-black mr-2 font-semibold text-title-5 max-md:text-title-7 animate-floating">
          Tip!
        </span>
        <p className="text-body-0 text-grey05 max-md:text-body-4 animate-floating">
          멤버십 혜택 사용 후, 사용 내역을 기록하면 행운의 스크래치 쿠폰을 얻을 수 있어요!{' '}
          <br className="hidden max-md:block animate-floating" /> 지금 바로{' '}
          <span className="text-purple04 font-medium animate-floating">잇플맵에서 혜택을 기록</span>
          해보세요 🐰
        </p>
      </section>

      {/* 스크래치 쿠폰 */}
      <section className="bg-[#ECFBE6] rounded-[12px] px-6 py-6 mb-6 text-center">
        <h2 className="text-[20px] font-bold text-green-700 mb-3">
          행운의 스크래치 쿠폰을 긁어라! 🍀
        </h2>
        <div className="bg-white rounded-[8px] h-[120px] flex items-center justify-center text-green-500 text-[18px] tracking-wide">
          마우스를 움직여 쿠폰을 긁어주세요!
        </div>
      </section>

      {/* 내가 보유한 쿠폰 개수 & 상품 리스트 */}
      <section className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-6">
        {/* 보유 쿠폰 */}
        <div className="bg-white rounded-[12px] p-5 text-center shadow-sm">
          <h3 className="text-title-6 font-semibold mb-1">내가 보유한 쿠폰 개수</h3>
          <p className="text-purple04 text-body-2 mb-4">보유한 쿠폰 개수만큼 도전할 수 있어요!</p>
          <div className="text-[32px] font-bold text-purple04">3개</div>
        </div>

        {/* 상품 리스트 */}
        <div className="bg-white rounded-[12px] p-5 shadow-sm">
          <h3 className="text-title-6 font-semibold mb-1">상품 리스트</h3>
          <p className="text-purple04 text-body-2 mb-4">행운 쿠폰으로 받을 수 있는 선물이에요!</p>
          <ol className="list-decimal list-inside text-body-2 space-y-1 text-grey06">
            <li>상품명이 들어가요</li>
            <li>상품명이 들어가요</li>
            <li>상품명이 들어가요</li>
            <li>상품명이 들어가요</li>
            <li>상품명이 들어가요</li>
          </ol>
        </div>
      </section>

      {/* 쿠폰 사용 내역 */}
      <section className="bg-white rounded-[12px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-title-6 font-semibold">나의 쿠폰 사용 내역</h3>
          <label className="text-sm text-grey06">
            <input type="checkbox" className="mr-2" /> 당첨 내역만 모아보기
          </label>
        </div>

        <ul className="space-y-3">
          <li className="border border-purple04 rounded-[8px] p-3">
            <p className="text-purple04 font-bold mb-1">꽝!</p>
            <p className="text-sm text-grey06">다음 기회를 노려보세요!</p>
            <p className="text-xs text-grey04 mt-1">2025-07-03</p>
          </li>
          <li className="border border-purple04 rounded-[8px] p-3">
            <p className="text-purple04 font-bold mb-1">당첨 🎉</p>
            <p className="text-sm">[쿠쿠전자] W8200 타워형 공기청정기</p>
            <p className="text-xs text-grey04 mt-1">2025-07-01</p>
          </li>
          {/* 더미 항목 생략 가능 */}
        </ul>
      </section>
    </main>
  );
};

export default EventPage;
