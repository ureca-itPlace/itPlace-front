type Props = {
  onGoToPhoneAuth: () => void;
  onGoToFindEmail: () => void;
};

const AuthLinkRow = ({ onGoToPhoneAuth, onGoToFindEmail }: Props) => {
  return (
    <div className="w-[310px] flex justify-between text-body-3 text-grey03 mt-[12px] duration-150">
      <span onClick={onGoToPhoneAuth} className="text-purple04 hover:text-purple05 cursor-pointer">
        계정이 없으신가요?
      </span>
      <span onClick={onGoToFindEmail} className="hover:text-grey04 cursor-pointer">
        아이디/비밀번호 찾기
      </span>
    </div>
  );
};

export default AuthLinkRow;
