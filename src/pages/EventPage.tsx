import { useEffect, useRef, useState } from 'react';
import ScratchCouponCanvas from '../features/eventPage/components/ScratchCouponCanvas';
import MobileHeader from '../components/MobileHeader';
import { useMediaQuery } from 'react-responsive';
import TipBanner from '../features/eventPage/components/TipBanner';
import OwnedCouponCountInfo from '../features/eventPage/components/OwnedCouponCountInfo';
import GiftListInfo from '../features/eventPage/components/GiftListInfo';
import CouponUsageItem from '../features/eventPage/components/CouponUsageItem';
// import WinModal from '../features/eventPage/components/Modal/WinModal';
// import FailModal from '../features/eventPage/components/Modal/FailModal';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store';

export default function EventPage() {
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState<boolean | null>(null);
  const [usageHistory, setUsageHistory] = useState<string[]>(Array(10).fill(''));
  const loader = useRef(null);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // const username = useSelector((state: RootState) => state.auth.user?.name || '');

  const handleScratchComplete = () => {
    const win = Math.random() > 0.5;
    setIsWinner(win);
    setShowResult(true);
  };

  // ✅ 무한스크롤 로직
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setUsageHistory((prev) => [...prev, ...Array(5).fill('')]);
          }, 500);
        }
      },
      { threshold: 1.0 }
    );

    const current = loader.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <>
      {/* ✅ 모바일 헤더 */}
      <div className="hidden fixed top-0 left-0 w-full z-[9999] max-md:block">
        <MobileHeader title="이벤트" />
      </div>

      {/* ✅ 모바일 Tip 영역 */}
      {isMobile && <TipBanner />}

      <main className="px-[28px] py-7 max-md:px-5 min-h-screen flex flex-col">
        {/* ✅ Tip 영역 */}
        {!isMobile && <TipBanner />}

        {/* ✅ 메인 콘텐츠 영역 */}
        <div className="flex-1 flex gap-11 max-xl:gap-6 max-xlg:flex-col max-md:gap-8">
          {/* ✅ 좌측 영역 */}
          <div className="flex-1 flex flex-col gap-8 max-xl:gap-6 max-w-[1080px]">
            {/* ✅ 스크래치 쿠폰 */}
            <section
              className="bg-[#ECFBE6] rounded-[18px] px-7 py-6 max-xl:py-4 max-md:mb-7"
              style={{
                boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <picture className="max-md:mx-auto">
                <source srcSet="/images/event/coupon-title.webp" type="image/webp" />
                <img src="/images/event/coupon-title.png" alt="쿠폰 타이틀" loading="lazy" />
              </picture>
              <ScratchCouponCanvas onComplete={handleScratchComplete} />
            </section>

            {/* ✅ 보유 쿠폰 + 상품 리스트 */}
            <section className="grid grid-cols-2 max-md:grid-cols-1 gap-7 max-xl:gap-6 flex-1 max-md:gap-7">
              <OwnedCouponCountInfo />
              <GiftListInfo />
            </section>
          </div>

          {/* ✅ 우측 쿠폰 사용 내역 */}
          <aside
            className="rounded-[18px] max-w-[666px] max-xlg:max-w-none shrink-0 max-md:w-full"
            style={{
              boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <section className="bg-white rounded-[18px] p-7 max-xl:px-7 max-xl:py-4 h-full flex flex-col">
              <div className="items-center justify-between mt-5 mb-2">
                <div className="mb-2">
                  {/* 중앙 정렬된 제목 */}
                  <h3 className="text-title-3 text-grey05 font-semibold text-center max-xl:text-title-4 max-xl:font-semibold max-md:font-semibold max-sm:font-semibold max-md:text-title-4 max-sm:text-title-7">
                    나의 쿠폰 사용 내역
                  </h3>

                  {/* 오른쪽 정렬된 체크박스 */}
                  <div className="flex justify-end mt-8">
                    <label className="text-body-1 text-grey05 max-sm:text-body-3">
                      <input type="checkbox" className="mr-2" />
                      당첨 내역만 모아보기
                    </label>
                  </div>
                </div>
              </div>

              {/* ✅ 내역 스크롤 영역 */}
              <ul
                className="
              space-y-5
              overflow-y-auto
              pr-1
              max-h-[calc(100vh-360px)]
              max-xl:max-h-[calc(100vh-310px)]
              max-xlg:max-h-[calc(100vh-760px)]
              max-md:max-h-[calc(100vh-560px)]
              scrollArea"
              >
                {usageHistory.map((_, index) => {
                  const isWin = index % 3 === 0;
                  return (
                    <CouponUsageItem
                      key={index}
                      isWin={isWin}
                      message={isWin ? '[쿠쿠전자] 공기청정기' : '다음 기회를 노려보세요!'}
                      date={`2025-07-${(index + 1).toString().padStart(2, '0')}`}
                    />
                  );
                })}
                <li ref={loader}></li>
              </ul>
            </section>
          </aside>
        </div>

        {/* ✅ 결과 모달 api 연결 후 주석 해제 */}
        {/* {showResult && (
          <>
            {isWinner ? (
              <WinModal
                isOpen={showResult}
                onClose={() => setShowResult(false)}
                username={username}
                giftName={giftName}
                productImageUrl={giftImageUrl}
              />
            ) : (
              <FailModal isOpen={showResult} onClose={() => setShowResult(false)} />
            )}
          </>
        )} */}
      </main>
    </>
  );
}
