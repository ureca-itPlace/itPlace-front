import { useEffect, useRef } from 'react';
import * as ScratchCardLib from 'scratchcard-js';
import { useCallback } from 'react';

const ScratchCard = ScratchCardLib.ScratchCard;
const SCRATCH_TYPE = ScratchCardLib.SCRATCH_TYPE;

interface ScratchCouponCanvasProps {
  onComplete: () => void;
}

export default function ScratchCouponCanvas({ onComplete }: ScratchCouponCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scratchCardRef = useRef<InstanceType<typeof ScratchCard> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const initScratchCard = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const sc = new ScratchCard('#scratch-canvas', {
      scratchType: SCRATCH_TYPE.CIRCLE,
      containerWidth: width,
      containerHeight: height,
      imageForwardSrc: '/images/event/coupon-cover.webp',
      clearZoneRadius: 24,
      nPoints: 30,
      pointSize: 4,
      callback: onComplete,
    });

    sc.init()
      .then(() => {
        scratchCardRef.current = sc;
      })
      .catch(console.error);
  }, [onComplete]);

  useEffect(() => {
    initScratchCard(); // 초기 mount 시 1번 실행

    const container = containerRef.current;
    if (!container) return;

    // ✅ debounce timeout ref 정의
    const debounceTimeoutRef = { current: null as number | null };

    // ✅ ResizeObserver 내부에서 debounce 적용
    resizeObserverRef.current = new ResizeObserver(() => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = window.setTimeout(() => {
        initScratchCard();
      }, 300); // 300ms 동안 resize 안 들어오면 실행
    });

    resizeObserverRef.current.observe(container);

    return () => {
      resizeObserverRef.current?.disconnect();
      scratchCardRef.current = null;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current); // ✅ clean up도 필요
      }
    };
  }, [initScratchCard]);

  return (
    <div className="relative  w-full aspect-[1014/267] mt-6">
      {/* ✅ 아래: 쿠폰 베이스 이미지 */}
      <picture>
        <source srcSet="/images/event/coupon-main.webp" type="image/webp" />
        <img
          src="/images/event/coupon-main.png"
          alt="쿠폰 베이스"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-[8px] z-0"
        />
      </picture>

      {/* ✅ 위에 긁는 캔버스 (DOM 하나만) */}
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
