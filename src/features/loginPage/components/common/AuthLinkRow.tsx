type Props = {
  onGoToPhoneAuth: () => void;
  onGoToFindEmail: () => void;
};

const AuthLinkRow = ({ onGoToPhoneAuth, onGoToFindEmail }: Props) => {
  return (
    <div className="w-[310px] max-xl:w-[265px] max-lg:w-[199px] flex justify-between text-body-3 max-xl:text-body-4 max-lg:text-body-5 text-grey03 mt-[12px] max-xl:mt-[10px] max-lg:mt-[8px] duration-150">
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
