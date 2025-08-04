import CouponUsageItem from './CouponUsageItem';
import { CouponHistory } from '../../../types/event';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface CouponUsagelistProps {
  usageHistory: CouponHistory[];
  loaderRef?: React.RefObject<HTMLLIElement | null>;
  scrollContainerRef?: React.RefObject<HTMLUListElement | null>;
  isLoading: boolean;
}

const CouponUsageList = ({ usageHistory, isLoading }: CouponUsagelistProps) => {
  return (
    <ul className="space-y-5 overflow-y-auto max-h-[600px] pr-1 scrollArea">
      {usageHistory
        .slice()
        .reverse()
        .map((item) => (
        <CouponUsageItem
          key={item.historyId}
          isWin={item.result === 'SUCCESS'}
          message={item.result === 'SUCCESS' ? (item.giftName ?? '') : '다음 기회를 노려보세요!'}
          date={item.usedDate}
        />
      ))}
      {isLoading && (
        <li className="flex justify-center items-center py-6">
          <LoadingSpinner />
        </li>
      )}
    </ul>
  );
};

export default CouponUsageList;
