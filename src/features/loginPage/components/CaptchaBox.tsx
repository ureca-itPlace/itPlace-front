import { FiRefreshCw } from 'react-icons/fi';

type Props = {
  captchaText: string;
  onRefresh: () => void;
};

const CaptchaBox = ({ captchaText, onRefresh }: Props) => {
  return (
    <div className="w-[320px] h-[120px] border border-grey03 rounded-[18px] flex items-center justify-between px-[16px]">
      {/* 왼쪽: 보안문자 텍스트 + 입력창 */}
      <div className="flex items-center justify-center flex-1 gap-[43px]">
        <div className="flex items-center gap-[8px]">
          {/* 캡챠 텍스트 */}
          <div className="w-[172px] h-[80px] bg-white flex items-center justify-center text-[24px] font-bold tracking-widest border">
            {captchaText}
          </div>
        </div>

        {/* 오른쪽: 새로고침 아이콘 + 텍스트 */}
        <div
          className="flex flex-col items-center justify-center text-grey03 hover:text-black cursor-pointer"
          onClick={onRefresh}
        >
          <FiRefreshCw size={20} />
          <span className="text-[12px] mt-[2px]">새로고침</span>
        </div>
      </div>
    </div>
  );
};

export default CaptchaBox;
