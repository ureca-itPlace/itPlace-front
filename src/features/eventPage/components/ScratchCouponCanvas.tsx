import { useEffect, useRef, useCallback } from 'react';
import * as ScratchCardLib from 'scratchcard-js';
import { showToast } from '../../../utils/toast';

const ScratchCard = ScratchCardLib.ScratchCard;
const SCRATCH_TYPE = ScratchCardLib.SCRATCH_TYPE;

interface ScratchCouponCanvasProps {
  onComplete: () => void;
  isLoggedIn: boolean;
  couponCount: number | null;
}

export default function ScratchCouponCanvas({
  onComplete,
  isLoggedIn,
  couponCount,
}: ScratchCouponCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scratchCardRef = useRef<InstanceType<typeof ScratchCard> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const initScratchCard = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = ''; // 초기화
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const isUserAllowed = isLoggedIn && !!couponCount && couponCount > 0;
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
        if (isUserAllowed) {
          onComplete();
        }
      },
    });

    sc.init()
      .then(() => {
        scratchCardRef.current = sc;

        // ❌ 긁기 권한 없음 → canvas 클릭 시 토스트만
        if (!isUserAllowed) {
          const canvasEl = sc.canvas;
          canvasEl.style.pointerEvents = 'none';
          container.style.cursor = 'not-allowed';

          container.onclick = () => {
            showToast(
              !isLoggedIn ? '로그인 후 이용해주세요!' : '쿠폰이 부족합니다. 별을 모아보세요!',
              'error'
            );
          };
        }
      })
      .catch(console.error);
  }, [onComplete, isLoggedIn, couponCount]);

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
      {/* ✅ 쿠폰 아래 이미지 */}
      <picture>
        <source srcSet="/images/event/coupon-main.webp" type="image/webp" />
        <img
          src="/images/event/coupon-main.png"
          alt="쿠폰 베이스"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-[8px] z-0"
        />
      </picture>

      {/* ✅ 긁는 캔버스 (스크래치 영역) */}
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
