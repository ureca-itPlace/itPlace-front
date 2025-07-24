import { FiRefreshCw } from 'react-icons/fi';
import { LoadCanvasTemplateNoReload, loadCaptchaEnginge } from 'react-simple-captcha';
import { useEffect } from 'react';

type Props = {
  onRefresh: () => void;
};

const CaptchaBox = ({ onRefresh }: Props) => {
  useEffect(() => {
    loadCaptchaEnginge(6); // 캔버스는 아래 컴포넌트가 생성해줌
  }, []);

  return (
    <div className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] h-[120px] max-xl:h-[103px] max-lg:h-[81px] border border-grey03 rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] flex items-center justify-between px-[16px] max-xl:px-[14px] max-lg:px-[11px]">
      <div className="flex items-center justify-center flex-1 gap-[43px] max-xl:gap-[37px] max-lg:gap-[29px]">
        {/* 캔버스를 자동 생성해주는 컴포넌트 */}
        <div className="w-[172px] max-xl:w-[147px] max-lg:w-[116px] h-[80px] max-xl:h-[69px] max-lg:h-[54px] flex items-center justify-center border bg-white">
          <LoadCanvasTemplateNoReload reloadColor="transparent" />
        </div>

        <div
          className="flex flex-col items-center justify-center text-grey03 hover:text-black cursor-pointer"
          onClick={() => {
            loadCaptchaEnginge(6);
            onRefresh();
          }}
        >
          <FiRefreshCw size={20} className="max-xl:text-[17px] max-lg:text-[14px]" />
          <span className="text-[12px] max-xl:text-[10px] max-lg:text-[8px] mt-[2px] max-xl:mt-[2px] max-lg:mt-[1px]">
            새로고침
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaptchaBox;
