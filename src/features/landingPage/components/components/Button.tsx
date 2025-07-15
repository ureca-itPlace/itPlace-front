import { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  children: string;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, variant = 'primary', onClick }: ButtonProps) => {
  const baseClass =
    'w-[354px] px-20 pt-5 pb-4 rounded-full text-title-4 transition-colors duration-200 max-sm:w-[280px] max-sm:text-title-7';

  const variants = {
    primary: 'bg-purple04 text-white',
    outline: 'border-2 border-purple04 text-purple04 bg-white',
  };

  return (
    <button className={`${baseClass} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
