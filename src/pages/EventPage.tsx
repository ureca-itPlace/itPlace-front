import { useEffect, useRef, useState } from 'react';
import { BiSolidMegaphone } from 'react-icons/bi';
import ScratchCouponCanvas from '../features/eventPage/components/ScratchCouponCanvas';
import { Modal } from '../components';
import MobileHeader from '../components/MobileHeader';

export default function EventPage() {
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState<boolean | null>(null);
  const [usageHistory, setUsageHistory] = useState<string[]>(Array(10).fill(''));
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const handleScratchComplete = () => {
    const win = Math.random() > 0.5;
    setIsWinner(win);
    setShowResult(true);
  };

  //mockData
  const productList = [
    'CU 편의점 모바일 상품권 5,000원권',
    '스타벅스 아메리카노 T',
    '이디야 커피 쿠폰',
    'BHC 뿌링클 치킨',
    '배스킨라빈스 파인트 아이스크림',
  ];

  // ✅ 무한스크롤 로직
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setUsageHistory((prev) => [...prev, ...Array(5).fill('')]);
            setPage((prev) => prev + 1);
          }, 500);
        }
      },
      { threshold: 1.0 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, []);

  return (
    <>
      {/* ✅ 모바일 헤더 */}
      <div className="hidden fixed top-0 left-0 w-full z-[9999] max-md:block">
        <MobileHeader title="이벤트" />
      </div>

      {/* ✅ 모바일 Tip 영역 */}
      <section className="bg-grey01 p-5 gap-2 mb-1 hidden max-md:block">
        <div className="flex flex-row">
          <BiSolidMegaphone className="text-title-5 text-purple04 mr-2 animate-floating" />
          <span className="text-black mr-2 font-semibold text-title-7 animate-floating">Tip!</span>
        </div>
        <p className=" text-grey05 text-body-4 animate-floating mt-2">
          멤버십 혜택 사용 후, 사용 내역을 기록하면 행운의 스크래치 쿠폰을 얻을 수 있어요! 지금 바로{' '}
          <span className="text-purple04 font-medium">잇플맵에서 혜택을 기록</span>
          해보세요 🐰
        </p>
      </section>

      <main className="px-[28px] py-7 max-md:px-5 min-h-screen flex flex-col">
        {/* ✅ Tip 영역 */}
        <section className="bg-grey01 rounded-[10px] p-6 flex items-start gap-2 mb-8 max-md:hidden">
          <BiSolidMegaphone className="text-title-5 text-purple04 animate-floating" />
          <span className="text-black mr-2 font-semibold text-title-5 animate-floating">Tip!</span>
          <p className="text-body-0 text-grey05  animate-floating">
            멤버십 혜택 사용 후, 사용 내역을 기록하면 행운의 스크래치 쿠폰을 얻을 수 있어요!
            <br className="hidden max-md:block" />
            지금 바로 <span className="text-purple04 font-medium">잇플맵에서 혜택을 기록</span>
            해보세요 🐰
          </p>
        </section>

        {/* ✅ 메인 콘텐츠 영역 */}
        <div className="flex-1 flex gap-11 max-xlg:flex-col">
          {/* ✅ 좌측 영역 */}
          <div className="flex-1 flex flex-col gap-8 max-w-[1080px]">
            {/* ✅ 스크래치 쿠폰 */}
            <section className="bg-[#ECFBE6] rounded-[18px] drop-shadow-basic px-7 py-6">
              <picture className="max-md:mx-auto">
                <source srcSet="/images/event/coupon-title.webp" type="image/webp" />
                <img src="/images/event/coupon-title.png" alt="쿠폰 타이틀" />
              </picture>
              <ScratchCouponCanvas onComplete={handleScratchComplete} />
            </section>

            {/* ✅ 보유 쿠폰 + 상품 리스트 */}
            <section className="grid grid-cols-2 max-md:grid-cols-1 gap-7 flex-1">
              <div className="bg-white -mb-2 rounded-[18px] drop-shadow-basic p-9 text-center h-full">
                <h3 className="text-title-3 text-grey05 font-semibold mb-2 max-md:text-title-7">
                  내가 보유한 쿠폰 개수
                </h3>
                <p className="text-purple04 text-body-1 mb-4 max-md:text-body-3">
                  보유한 쿠폰 개수만큼 도전할 수 있어요!
                </p>
                <div className="relative w-full flex justify-center items-center">
                  <picture>
                    <source srcSet="/images/event/coupon-count.webp" type="image/webp" />
                    <img
                      src="/images/event/coupon-count.png"
                      alt="쿠폰 수 이미지"
                      className="w-[310px]"
                    />
                  </picture>
                  <div className="absolute top-[6.5rem] text-[48px] font-bold text-white">3개</div>
                </div>
              </div>

              <div className="bg-white rounded-[18px] p-9 drop-shadow-basic text-center h-full">
                <h3 className="text-title-3 text-grey05 font-semibold mb-2 max-md:text-title-7">
                  상품 리스트
                </h3>
                <p className="text-purple04 text-body-1 mb-9 max-md:text-body-3">
                  행운 쿠폰으로 받을 수 있는 선물이에요!
                </p>

                <ul className="space-y-3 text-title-5 text-grey05 text-left inline-block">
                  {productList.map((item, index) => (
                    <li key={index}>
                      <span className="text-purple04 mr-5">{index + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* ✅ 우측 쿠폰 사용 내역 */}
          <aside className="w-[666px] drop-shadow-basic shrink-0 max-md:w-full">
            <section className="bg-white rounded-[12px] p-7 h-full flex flex-col">
              <div className="items-center justify-between mt-5 mb-2">
                <div className="mb-2">
                  {/* 중앙 정렬된 제목 */}
                  <h3 className="text-title-3 text-grey05 font-semibold text-center">
                    나의 쿠폰 사용 내역
                  </h3>

                  {/* 오른쪽 정렬된 체크박스 */}
                  <div className="flex justify-end mt-8">
                    <label className="text-body-1 text-grey05">
                      <input type="checkbox" className="mr-2" />
                      당첨 내역만 모아보기
                    </label>
                  </div>
                </div>
              </div>

              {/* ✅ 내역 스크롤 영역 */}
              <ul
                className="space-y-5 overflow-y-auto pr-1"
                style={{
                  maxHeight: 'calc(100vh - 360px)', // 반응형 높이 조절
                }}
              >
                {usageHistory.map((_, index) => {
                  const isWin = index % 3 === 0;

                  return (
                    <li key={index} className="border border-purple02 rounded-[8px] p-7">
                      <div className="flex flex-row items-center gap-3">
                        {/* ✅ 당첨/꽝 텍스트 고정 너비 + 조건별 색상 */}
                        <p
                          className={`w-[90px] font-bold text-title-4 ${
                            isWin ? 'text-purple04' : 'text-black'
                          }`}
                        >
                          {isWin ? '당첨🎉' : '꽝!'}
                        </p>

                        {/* ✅ 결과 설명 및 날짜 영역 */}
                        <div className="flex w-[320px]">
                          <p className="text-body-1 text-grey05">
                            {isWin ? '[쿠쿠전자] 공기청정기' : '다음 기회를 노려보세요!'}
                          </p>
                        </div>
                        <p className="text-body-2 text-grey04 mt-1">
                          2025-07-{(index + 1).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </li>
                  );
                })}

                <li ref={loader}></li>
              </ul>
            </section>
          </aside>
        </div>

        {/* ✅ 결과 모달 */}
        {showResult && (
          <Modal
            isOpen={showResult}
            onClose={() => setShowResult(false)}
            title={isWinner ? '🎉 당첨!' : '😢 꽝!'}
            message={
              isWinner ? 'W8200 타워형 공기청정기에 당첨되셨습니다!' : '다음 기회를 노려보세요!'
            }
            buttons={[{ label: '확인', onClick: () => setShowResult(false) }]}
          />
        )}
      </main>
    </>
  );
}
