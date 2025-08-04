interface CouponUsageItemProps {
  isWin: boolean;
  message: string;
  date: string;
}

const CouponUsageItem = ({ isWin, message, date }: CouponUsageItemProps) => {
  return (
    <li className="border border-purple02 rounded-[18px] p-7 max-xl:p-5 max-sm:p-4">
      <div className="flex max-md:flex-col max-md:items-center items-center justify-between gap-3">
        {/* 왼쪽 당첨/꽝 텍스트 */}
        <p
          className={`w-[90px] font-bold text-title-4 max-xl:text-title-5 max-xl:font-bold max-sm:text-title-6 max-sm:font-bold text-center ${
            isWin ? 'text-purple04' : 'text-black'
          }`}
        >
          {isWin ? '당첨🎉' : '꽝!'}
        </p>

        {/* 가운데 메시지 */}
        <p className="text-body-1 max-sm:text-body-2 text-grey05 w-[320px] max-sm:w-full max-md:text-center max-md:mt-2 max-sm:mt-0">
          {message}
        </p>

        {/* 오른쪽 날짜 */}
        <p className="text-body-2 text-grey04 mt-1 max-sm:mt-0 min-w-[100px] text-right max-md:text-center max-sm:text-body-3">
          {date}
        </p>
      </div>
    </li>
  );
};

export default CouponUsageItem;
