// components/common/PhoneAuth.tsx
import React from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFooter from './AuthFooter';
import CaptchaBox from '../verification/CaptchaBox';
import { loadCaptchaEnginge } from 'react-simple-captcha';

type Props = {
  headerSlot?: React.ReactNode;
  name: string;
  phone: string;
  captcha?: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePhone: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeCaptcha?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  showCaptcha?: boolean;
  submitLabel?: string;
  showFooter?: boolean;
  onClickLogin?: () => void;
  loading?: boolean;
};

const PhoneAuth = ({
  headerSlot,
  name,
  phone,
  captcha = '',
  onChangeName,
  onChangePhone,
  onChangeCaptcha,
  onSubmit,
  showCaptcha = true,
  submitLabel = '다음',
  showFooter = false,
  onClickLogin,
  loading = false,
}: Props) => {
  const handleCaptchaRefresh = () => {
    loadCaptchaEnginge(6);
  };
  return (
    <div className="w-full flex flex-col items-center">
      {headerSlot}

      <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] w-[320px] max-xl:w-[274px] max-lg:w-[205px]">
        <AuthInput name="name" placeholder="이름" value={name} onChange={onChangeName} />
      </div>

      <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] w-[320px] max-xl:w-[274px] max-lg:w-[205px]">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호 (Ex: 01012345678)"
          value={phone}
          onChange={onChangePhone}
        />
      </div>

      {showCaptcha && (
        <>
          <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] w-[320px] max-xl:w-[274px] max-lg:w-[205px]">
            <CaptchaBox onRefresh={handleCaptchaRefresh} />
          </div>
          <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] w-[320px] max-xl:w-[274px] max-lg:w-[205px]">
            <AuthInput
              name="captcha"
              placeholder="보안문자 입력"
              value={captcha}
              onChange={onChangeCaptcha}
            />
          </div>
        </>
      )}

      <div className="mt-[40px] max-xl:mt-[34px] max-lg:mt-[27px] w-[320px] max-xl:w-[274px] max-lg:w-[205px]">
        <AuthButton
          label={submitLabel}
          onClick={onSubmit}
          variant={loading ? 'disabled' : 'default'}
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
