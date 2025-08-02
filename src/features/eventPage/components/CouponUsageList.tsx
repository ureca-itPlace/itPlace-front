import CouponUsageItem from './CouponUsageItem';

interface CouponUsagelistProps {
  usageHistory: string[];
  loaderRef: React.RefObject<HTMLLIElement | null>;
}

const CouponUsageList = ({ usageHistory, loaderRef }: CouponUsagelistProps) => {
  return (
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
      <li ref={loaderRef}></li>
    </ul>
  );
};

export default CouponUsageList;
