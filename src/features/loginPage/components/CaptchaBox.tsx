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
    <div className="w-[320px] h-[120px] border border-grey03 rounded-[18px] flex items-center justify-between px-[16px]">
      <div className="flex items-center justify-center flex-1 gap-[43px]">
        {/* ✅ 캔버스를 자동 생성해주는 컴포넌트 */}
        <div className="w-[172px] h-[80px] flex items-center justify-center border bg-white">
          <LoadCanvasTemplateNoReload reloadColor="transparent" />
        </div>

        <div
          className="flex flex-col items-center justify-center text-grey03 hover:text-black cursor-pointer"
          onClick={() => {
            loadCaptchaEnginge(6);
            onRefresh();
          }}
        >
          <FiRefreshCw size={20} />
          <span className="text-[12px] mt-[2px]">새로고침</span>
        </div>
      </div>
    </div>
  );
};

export default CaptchaBox;
