const AuthDivider = () => {
  return (
    <div className="flex items-center justify-center w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-sm:w-full my-[40px] max-xl:my-[34px] max-lg:my-[27px] max-sm:my-[32px]">
      <div className="flex-1 h-px bg-grey02" />
      <span className="text-grey03 text-body-3 max-xl:text-body-4 max-lg:text-body-4 max-sm:text-body-4 whitespace-nowrap">
        소셜 로그인
      </span>
      <div className="flex-1 h-px bg-grey02" />
    </div>
  );
};

export default AuthDivider;
