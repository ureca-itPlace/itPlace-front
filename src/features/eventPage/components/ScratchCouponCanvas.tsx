import { useEffect, useRef, useCallback } from 'react';
import * as ScratchCardLib from 'scratchcard-js';
import { showToast } from '../../../utils/toast';

const ScratchCard = ScratchCardLib.ScratchCard;
const SCRATCH_TYPE = ScratchCardLib.SCRATCH_TYPE;

interface ScratchCouponCanvasProps {
  onComplete: () => void;
  isLoggedIn: boolean;
  couponCount: number | null;
  showNoCoupon: () => void;
}

export default function ScratchCouponCanvas({
  onComplete,
  isLoggedIn,
  couponCount,
  showNoCoupon,
}: ScratchCouponCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scratchCardRef = useRef<InstanceType<typeof ScratchCard> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const couponCountRef = useRef(couponCount);
  const isLoggedInRef = useRef(isLoggedIn);

  // 최신값 유지
  useEffect(() => {
    couponCountRef.current = couponCount;
  }, [couponCount]);

  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  const initScratchCard = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const clearZoneRadius = window.innerWidth < 768 ? 8 : 24;

    const sc = new ScratchCard('#scratch-canvas', {
      scratchType: SCRATCH_TYPE.CIRCLE,
      containerWidth: width,
      containerHeight: height,
      imageForwardSrc: '/images/event/coupon-cover.webp',
      clearZoneRadius,
      nPoints: 30,
      pointSize: 4,
      callback: () => {
        const allowed =
          isLoggedInRef.current && couponCountRef.current !== null && couponCountRef.current > 0;

        if (allowed) {
          onComplete();
        }
      },
    });

    sc.init()
      .then(() => {
        scratchCardRef.current = sc;

        const canvasEl = sc.canvas;
        const currentIsLoggedIn = isLoggedInRef.current;
        const currentCouponCount = couponCountRef.current;
        const allowed = currentIsLoggedIn && currentCouponCount !== null && currentCouponCount > 0;

        // 커서 및 클릭 동작 설정
        if (!allowed) {
          if (canvasEl) canvasEl.style.pointerEvents = 'none';
          container.style.cursor = 'not-allowed';
          container.onclick = () => {
            if (!currentIsLoggedIn) {
              showToast('로그인 후 이용해주세요!', 'error');
            } else {
              showNoCoupon();
            }
          };
        } else {
          if (canvasEl) canvasEl.style.pointerEvents = 'auto';
          container.style.cursor = 'default';
          container.onclick = null;
        }
      })
      .catch(console.error);
  }, [onComplete, showNoCoupon]);

  useEffect(() => {
    initScratchCard();

    const container = containerRef.current;
    if (!container) return;

    const debounceTimeoutRef = { current: null as number | null };

    resizeObserverRef.current = new ResizeObserver(() => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = window.setTimeout(() => {
        initScratchCard();
      }, 300);
    });

    resizeObserverRef.current.observe(container);

    return () => {
      resizeObserverRef.current?.disconnect();
      scratchCardRef.current = null;
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [initScratchCard]);

  return (
    <div className="relative w-full aspect-[1014/267] mt-6">
      <picture>
        <source srcSet="/images/event/coupon-main.webp" type="image/webp" />
        <img
          src="/images/event/coupon-main.png"
          alt="쿠폰 베이스"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-[8px] z-0"
        />
      </picture>

      <div
        id="scratch-canvas"
        ref={containerRef}
        className="absolute z-10"
        style={{
          width: '79.9%', // 790 / 1014
          height: '47.6%', // 127 / 267
          top: '39%', // 66 / 267
          left: '16.2%', // 219 / 1014
        }}
      />
    </div>
  );
}
