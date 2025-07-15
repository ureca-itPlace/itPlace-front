const AuthLinkRow = () => {
  return (
    <div className="w-[310px] flex justify-between text-body-3 text-grey03 mt-[12px] duration-150">
      <a href="/signup" className="text-purple04 hover:text-purple05">
        계정이 없으신가요?
      </a>
      <a href="/find" className="hover:text-grey04">
        아이디/비밀번호 찾기
      </a>
    </div>
  );
};

export default AuthLinkRow;
