// components/common/PhoneAuth.tsx
import React from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFooter from './AuthFooter';
import CaptchaBox from '../verification/CaptchaBox';

type Props = {
  headerSlot?: React.ReactNode;
  name: string;
  phone: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePhone: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRecaptchaChange?: (isValid: boolean) => void;
  onSubmit: () => void;
  showCaptcha?: boolean;
  submitLabel?: string;
  showFooter?: boolean;
  onClickLogin?: () => void;
  loading?: boolean;
  recaptchaValid?: boolean;
};

const PhoneAuth = ({
  headerSlot,
  name,
  phone,
  onChangeName,
  onChangePhone,
  onRecaptchaChange,
  onSubmit,
  showCaptcha = true,
  submitLabel = '다음',
  showFooter = false,
  onClickLogin,
  loading = false,
  recaptchaValid = false,
}: Props) => {
  return (
    <div className="w-full flex flex-col items-center">
      {headerSlot}

      <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] max-md:mt-[16px] max-sm:mt-[16px] w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full">
        <AuthInput name="name" placeholder="이름" value={name} onChange={onChangeName} />
      </div>

      <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] max-md:mt-[16px] max-sm:mt-[16px] w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호 (Ex: 01012345678)"
          value={phone}
          onChange={onChangePhone}
        />
      </div>

      {showCaptcha && (
        <>
          <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] max-md:mt-[16px] max-sm:mt-[16px] w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full">
            <CaptchaBox onCaptchaChange={onRecaptchaChange} />
          </div>
        </>
      )}

      <div className="mt-[40px] max-xl:mt-[34px] max-lg:mt-[27px] max-md:mt-[32px] max-sm:mt-[32px] w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full">
        <AuthButton
          label={submitLabel}
          onClick={onSubmit}
          variant={loading || (showCaptcha && !recaptchaValid) ? 'disabled' : 'default'}
        />
      </div>

      {showFooter && onClickLogin && (
        <AuthFooter
          leftText="이미 회원이신가요?"
          rightText="로그인 하러 가기"
          onRightClick={onClickLogin}
        />
      )}
    </div>
  );
};

export default PhoneAuth;
