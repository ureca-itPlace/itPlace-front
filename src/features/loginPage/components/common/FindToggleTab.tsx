// components/common/ToggleTab.tsx
type Props = {
  active: 'email' | 'password';
  onClickEmail: () => void;
  onClickPassword: () => void;
};

const ToggleTab = ({ active, onClickEmail, onClickPassword }: Props) => {
  return (
    <div className="relative w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full h-[50px] max-xl:h-[43px] max-lg:h-[34px] max-md:h-[48px] max-sm:h-[48px] flex justify-between items-center bg-grey01 rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[16px] max-sm:rounded-[16px] p-[4px] max-xl:p-[3px] max-lg:p-[3px] max-md:p-[3px] max-sm:p-[3px]">
      <button
        className={`flex-1 w-[153px] max-xl:w-[131px] max-lg:w-[98px] max-md:flex-1 max-sm:flex-1 h-[42px] max-xl:h-[37px] max-lg:h-[28px] max-md:h-[42px] max-sm:h-[42px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[14px] max-sm:rounded-[14px] text-title-6 max-xl:text-title-7 max-lg:text-title-8 max-md:text-body-2 max-sm:text-body-2 ${
          active === 'email' ? 'bg-white text-purple04' : 'text-grey05'
        }`}
        onClick={onClickEmail}
      >
        아이디 찾기
      </button>
      <button
        className={`flex-1 w-[153px] max-xl:w-[131px] max-lg:w-[98px] max-md:flex-1 max-sm:flex-1 h-[42px] max-xl:h-[37px] max-lg:h-[28px] max-md:h-[42px] max-sm:h-[42px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[14px] max-sm:rounded-[14px] text-title-6 max-xl:text-title-7 max-lg:text-title-8 max-md:text-body-2 max-sm:text-body-2 ${
          active === 'password' ? 'bg-white text-purple04' : 'text-grey05'
        }`}
        onClick={onClickPassword}
      >
        비밀번호 찾기
      </button>
    </div>
  );
};

export default ToggleTab;
