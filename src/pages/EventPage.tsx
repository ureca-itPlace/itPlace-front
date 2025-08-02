import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useMediaQuery } from 'react-responsive';
import ScratchCouponCanvas from '../features/eventPage/components/ScratchCouponCanvas';
import OwnedCouponCountInfo from '../features/eventPage/components/OwnedCouponCountInfo';
import GiftListInfo from '../features/eventPage/components/GiftListInfo';
import CouponUsageList from '../features/eventPage/components/CouponUsageList';
import WinModal from '../features/eventPage/components/Modal/WinModal';
import FailModal from '../features/eventPage/components/Modal/FailModal';
import MobileHeader from '../components/MobileHeader';
import TipBanner from '../features/eventPage/components/TipBanner';
import {
  fetchCouponCount,
  fetchCouponHistory,
  postScratchCoupon,
} from './../features/eventPage/api/eventApi';
import { showToast } from '../utils/toast';
import { AxiosError } from 'axios';
import { CouponHistory } from '../types/event';
import NoResult from '../components/NoResult';

export default function EventPage() {
  const [isLoading, setIsLoading] = useState(false);
  // ✅ 사용자 정보
  const username = useSelector((state: RootState) => state.auth.user?.name || '');
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);

  // ✅ 무한 스크롤용 상태
  const [page, setPage] = useState(1);
  const size = 6;
  const [hasMore, setHasMore] = useState(true);

  // ✅ 로컬 상태
  const [couponCount, setCouponCount] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [modalInfo, setModalInfo] = useState<{
    isWin: boolean;
    giftName?: string;
    giftImageUrl?: string;
  } | null>(null);
  const [historyList, setHistoryList] = useState<CouponHistory[]>([]);
  const [onlySuccess, setOnlySuccess] = useState(false);

  const loader = useRef<HTMLLIElement | null>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const getCouponCount = async () => {
    try {
      const count = await fetchCouponCount();
      setCouponCount(count);
    } catch {
      setCouponCount(null);
    }
  };

  const getHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCouponHistory(onlySuccess ? 'SUCCESS' : undefined);
      const sliced = data.slice(0, page * size);

      setHistoryList(sliced);

      if (sliced.length >= data.length) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('이력 조회 실패:', err);
    }
  }, [onlySuccess, page]);

  // ✅ 필터 바뀌거나 로그인 상태 바뀌면 page 초기화
  useEffect(() => {
    if (!isLoggedIn) return;

    setPage(1);
    setHasMore(true);
  }, [onlySuccess, isLoggedIn]);

  // ✅ 진입 시 데이터 로딩
  useEffect(() => {
    if (!isLoggedIn) return;
    getCouponCount();
    getHistory();
  }, [isLoggedIn, getHistory]);

  const handleScratchComplete = async () => {
    if (!isLoggedIn) {
      showToast('로그인 후 이용해주세요!', 'error');
      return;
    }

    try {
      const result = await postScratchCoupon();

      if (result.success) {
        setModalInfo({
          isWin: true,
          giftName: result.gift.giftName,
          giftImageUrl: result.gift.imgUrl,
        });
      } else {
        setModalInfo({ isWin: false });
      }

      setShowResult(true);
      await getCouponCount();
      await getHistory();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message = axiosError?.response?.data?.message ?? '쿠폰 긁기에 실패했습니다.';
      showToast(message, 'error');
    }
  };

  // ✅ loader가 보이면 page를 1 증가시키는 무한스크롤 로직
  useEffect(() => {
    if (!isLoggedIn || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const target = loader.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoggedIn]);

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 w-full z-[9999] max-md:block">
          <MobileHeader title="이벤트" />
        </div>
      )}

      <main className="px-[28px] py-7 max-md:px-5 min-h-screen flex flex-col">
        {!isMobile && <TipBanner />}

        <div className="flex-1 flex gap-11 max-xl:gap-6 max-xlg:flex-col max-md:gap-8">
          <div className="flex-1 flex flex-col gap-8 max-xl:gap-6 max-w-[1080px]">
            {/* ✅ 긁기 영역 */}
            <section
              className="bg-[#ECFBE6] rounded-[18px] px-7 py-6 max-xl:py-4 max-md:mb-7"
              style={{ boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.1)' }}
            >
              <picture className="max-md:mx-auto">
                <source srcSet="/images/event/coupon-title.webp" type="image/webp" />
                <img src="/images/event/coupon-title.png" alt="쿠폰 타이틀" loading="lazy" />
              </picture>
              <ScratchCouponCanvas
                onComplete={handleScratchComplete}
                isLoggedIn={isLoggedIn}
                couponCount={couponCount}
              />
            </section>

            <section className="grid grid-cols-2 max-md:grid-cols-1 gap-7 max-xl:gap-6 flex-1 max-md:gap-7">
              <OwnedCouponCountInfo couponCount={couponCount} />
              <GiftListInfo />
            </section>
          </div>

          {/* ✅ 이력 영역 */}
          <aside
            className="rounded-[18px] max-w-[666px] w-full max-xlg:max-w-none shrink-0 max-md:w-full"
            style={{ boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.1)' }}
          >
            <section className="bg-white rounded-[18px] p-7 h-full flex flex-col">
              <h3 className="text-title-3 text-grey05 font-semibold text-center mt-5 mb-2 max-xl:text-title-5 max-xl:font-semibold max-md:font-semibold max-sm:font-semibold max-md:text-title-4 max-sm:text-title-7">
                나의 쿠폰 사용 내역
              </h3>
              <div className="flex justify-end mt-8">
                <label className="text-body-1 text-grey05 max-sm:text-body-3">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={onlySuccess}
                    onChange={(e) => setOnlySuccess(e.target.checked)}
                  />
                  당첨 내역만 모아보기
                </label>
              </div>

              <div className="flex-1 mt-24 max-lg:mt-12">
                {!isLoggedIn ? (
                  <NoResult
                    message1="로그인 후 확인할 수 있어요!"
                    message2="로그인하고 행운의 스크래치 쿠폰을 긁어보세요."
                    buttonText="로그인하기"
                    buttonRoute="/login"
                    isLoginRequired
                    message1FontSize="max-xl:text-title-6"
                    message2FontSize="max-xl:text-body-3"
                  />
                ) : historyList.length === 0 ? (
                  <NoResult
                    message1="앗! 내역을 찾을 수 없어요!"
                    message2="지도에서 별을 찾아 행운 쿠폰을 긁어보세요."
                    message1FontSize="max-xl:text-title-6"
                    message2FontSize="max-xl:text-body-3"
                  />
                ) : (
                  <CouponUsageList
                    usageHistory={historyList}
                    loaderRef={loader}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </section>
          </aside>
        </div>

        {/* ✅ 결과 모달 */}
        {showResult && modalInfo && (
          <>
            {modalInfo.isWin ? (
              <WinModal
                isOpen={showResult}
                onClose={() => setShowResult(false)}
                username={username}
                giftName={modalInfo.giftName!}
                productImageUrl={modalInfo.giftImageUrl!}
              />
            ) : (
              <FailModal isOpen={showResult} onClose={() => setShowResult(false)} />
            )}
          </>
        )}
      </main>
    </>
  );
}
