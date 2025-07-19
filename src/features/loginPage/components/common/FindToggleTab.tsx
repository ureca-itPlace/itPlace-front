// components/common/ToggleTab.tsx
type Props = {
  active: 'email' | 'password';
  onClickEmail: () => void;
  onClickPassword: () => void;
};

const ToggleTab = ({ active, onClickEmail, onClickPassword }: Props) => {
  return (
    <div className="relative w-[320px] h-[50px] flex justify-between items-center bg-grey01 rounded-[18px] p-[4px]">
      <button
        className={`w-[153px] h-[42px] rounded-[18px] text-title-6 ${
          active === 'email' ? 'bg-white text-purple04' : 'text-grey05'
        }`}
        onClick={onClickEmail}
      >
        아이디 찾기
      </button>
      <button
        className={`w-[153px] h-[42px] rounded-[18px] text-title-6 ${
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
