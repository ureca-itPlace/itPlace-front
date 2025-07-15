import React from 'react';
import clsx from 'clsx';

type AuthInputProps = {
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  bgColor?: string; // 기본값: grey01
  textColor?: string; // 기본값: black
  placeholderColor?: string; // 기본값: grey03
  disabled?: boolean;
  disableFocusEffect?: boolean;
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
  disableFocusEffect = false, // 기본값 false
}: AuthInputProps) => {
  const focusClass = disableFocusEffect
    ? 'focus:outline-none'
    : 'focus:outline focus:outline-[1px] focus:outline-purple04';

  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={disabled ? undefined : onChange}
      disabled={disabled}
      className={clsx(
        'w-[320px] h-[50px] rounded-[18px] px-[16px] text-body-2 placeholder:text-body-2',
        bgColor,
        textColor,
        placeholderColor,
        focusClass,
        disabled && 'bg-grey02 text-grey04 placeholder:text-grey04',
        className
      )}
    />
  );
};

export default AuthInput;
