import React from 'react';
import clsx from 'clsx';

type AuthInputProps = {
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  bgColor?: string; // 기본값: grey01
  textColor?: string; // 기본값: black
  placeholderColor?: string; // 기본값: grey03
  disabled?: boolean;
};

const AuthInput = ({
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className,
  bgColor = 'bg-grey01',
  textColor = 'text-black',
  placeholderColor = 'placeholder-grey03',
  disabled = false,
}: AuthInputProps) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={clsx(
        'w-[320px] h-[50px] rounded-[18px] px-4',
        'text-body-2',
        'placeholder:text-body-2',
        bgColor,
        textColor,
        placeholderColor,
        className
      )}
    />
  );
};

export default AuthInput;
