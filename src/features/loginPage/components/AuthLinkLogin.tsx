type Props = {
  onClick: () => void;
};

const AuthLinkLogin = ({ onClick }: Props) => {
  return (
    <div className="text-body-3 text-grey03 mt-[12px]">
      이미 회원이신가요?{' '}
      <span onClick={onClick} className="text-purple04 hover:text-purple05 cursor-pointer">
        로그인 하러 가기
      </span>
    </div>
  );
};

export default AuthLinkLogin;
