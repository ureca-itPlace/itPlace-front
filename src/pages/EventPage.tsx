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
  const username = useSelector((state: RootState) => state.auth.user?.name || '');
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);
  const [page, setPage] = useState(1);
  const size = 6;
  const [hasMore, setHasMore] = useState(true);
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
      if (sliced.length >= data.length) setHasMore(false);
    } catch (err) {
      console.error('이력 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onlySuccess, page]);

  useEffect(() => {
    if (!isLoggedIn) return;
    setPage(1);
    setHasMore(true);
  }, [onlySuccess, isLoggedIn]);

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
      setPage(1);
      setHasMore(true);
      const data = await fetchCouponHistory(onlySuccess ? 'SUCCESS' : undefined);
      const sliced = data.slice(0, size);
      setHistoryList(sliced);
      if (sliced.length >= data.length) setHasMore(false);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message = axiosError?.response?.data?.message ?? '쿠폰 긁기에 실패했습니다.';
      showToast(message, 'error');
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((prev) => prev + 1);
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
        <>
          <div className="fixed top-0 left-0 w-full z-[9999] max-md:block">
            <MobileHeader title="이벤트" />
          </div>
          <TipBanner />
        </>
      )}
      <main className="flex justify-center items-center min-h-screen bg-white px-[28px] py-7 max-md:px-5">
        <div className="w-full max-w-[1783px] flex flex-col justify-center h-full">
          {!isMobile && <TipBanner />}

          <div className="flex gap-11 max-xl:gap-6 max-xlg:flex-col max-md:gap-8">
            {/* 왼쪽 */}
            <div className="flex-1 flex flex-col gap-8 max-xl:gap-6 max-w-[1080px]">
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

            {/* 오른쪽 */}
            <aside className="max-w-[666px] max-h-[779px] max-xlg:max-w-none shrink-0 max-md:w-full flex flex-col">
              <section
                className="bg-white rounded-[18px] p-7 flex-1 flex flex-col h-full"
                style={{ boxShadow: '0px 3px 12px rgba(0, 0, 0, 0.1)' }}
              >
                <h3 className="text-title-3 text-grey05 font-semibold text-center mt-5 mb-2 max-xl:text-title-5 max-md:text-title-4">
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
                <div className="flex-1 mt-12 overflow-y-auto">
                  {!isLoggedIn ? (
                    <NoResult
                      message1="로그인 후 확인할 수 있어요!"
                      message2="로그인하고 행운의 스크래치 쿠폰을 긁어보세요."
                      buttonText="로그인하기"
                      buttonRoute="/login"
                      isLoginRequired
                    />
                  ) : historyList.length === 0 ? (
                    <NoResult
                      message1="앗! 내역을 찾을 수 없어요!"
                      message2="지도에서 별을 찾아 행운 쿠폰을 긁어보세요."
                    />
                  ) : (
                    <CouponUsageList
                      usageHistory={historyList}
                      loaderRef={hasMore ? loader : undefined}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>

        {showResult &&
          modalInfo &&
          (modalInfo.isWin ? (
            <WinModal
              isOpen={showResult}
              onClose={() => setShowResult(false)}
              username={username}
              giftName={modalInfo.giftName!}
              productImageUrl={modalInfo.giftImageUrl!}
            />
          ) : (
            <FailModal isOpen={showResult} onClose={() => setShowResult(false)} />
          ))}
      </main>
    </>
  );
}
