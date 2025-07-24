const AuthDivider = () => {
  return (
    <div className="flex items-center justify-center w-[320px] max-xl:w-[274px] max-lg:w-[205px] my-[40px] max-xl:my-[34px] max-lg:my-[27px]">
      <div className="flex-1 h-px bg-grey02" />
      <span className="text-grey03 text-body-3 whitespace-nowrap">소셜 로그인</span>
      <div className="flex-1 h-px bg-grey02" />
    </div>
  );
};

export default AuthDivider;
