import CouponUsageItem from './CouponUsageItem';
import { CouponHistory } from '../../../types/event';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface CouponUsagelistProps {
  usageHistory: CouponHistory[];
  loaderRef: React.RefObject<HTMLLIElement | null>;
  isLoading: boolean;
}

const CouponUsageList = ({ usageHistory, loaderRef, isLoading }: CouponUsagelistProps) => {
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
      {usageHistory.map((item) => (
        <CouponUsageItem
          key={item.historyId}
          isWin={item.result === 'SUCCESS'}
          message={item.result === 'SUCCESS' ? item.giftName : '다음 기회를 노려보세요!'}
          date={item.usedDate}
        />
      ))}

      {isLoading && (
        <li className="flex justify-center py-4">
          <LoadingSpinner />
        </li>
      )}

      <li ref={loaderRef}></li>
    </ul>
  );
};

export default CouponUsageList;
