// components/common/ToggleTab.tsx
type Props = {
  active: 'email' | 'password';
  onClickEmail: () => void;
  onClickPassword: () => void;
};

const ToggleTab = ({ active, onClickEmail, onClickPassword }: Props) => {
  return (
    <div className="relative w-[320px] max-xl:w-[274px] max-lg:w-[205px] h-[50px] max-xl:h-[43px] max-lg:h-[34px] flex justify-between items-center bg-grey01 rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] p-[4px] max-xl:p-[3px] max-lg:p-[3px]">
      <button
        className={`w-[153px] max-xl:w-[131px] max-lg:w-[98px] h-[42px] max-xl:h-[37px] max-lg:h-[28px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] text-title-6 max-xl:text-title-7 max-lg:text-title-8 ${
          active === 'email' ? 'bg-white text-purple04' : 'text-grey05'
        }`}
        onClick={onClickEmail}
      >
        아이디 찾기
      </button>
      <button
        className={`w-[153px] max-xl:w-[131px] max-lg:w-[98px] h-[42px] max-xl:h-[37px] max-lg:h-[28px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] text-title-6 max-xl:text-title-7 max-lg:text-title-8 ${
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
