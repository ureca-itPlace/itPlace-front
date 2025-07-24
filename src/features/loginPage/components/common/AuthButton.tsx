import clsx from 'clsx';

type AuthButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'kakao' | 'disabled';
  className?: string;
};

const AuthButton = ({ label, onClick, variant = 'default', className }: AuthButtonProps) => {
  const baseClasses =
    'w-[320px] max-xl:w-[274px] max-lg:w-[205px] h-[50px] max-xl:h-[43px] max-lg:h-[34px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] text-title-5 max-xl:text-title-6 max-lg:text-body-2 flex items-center justify-center transition-colors duration-200';

  const variantClasses = {
    default: 'bg-purple04 text-white hover:bg-purple05',
    kakao: 'bg-[#FEE500] text-black',
    disabled: 'bg-purple02 text-white cursor-not-allowed',
  };

  return (
    <button
      onClick={onClick}
      disabled={variant === 'disabled'}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {label}
    </button>
  );
};

export default AuthButton;
