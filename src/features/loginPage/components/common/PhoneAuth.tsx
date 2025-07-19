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
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onChangeCaptcha?: (val: string) => void;
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

      <div className="mt-[20px] w-[320px]">
        <AuthInput
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
        />
      </div>

      <div className="mt-[20px] w-[320px]">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호 (Ex: 01012345678)"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
        />
      </div>

      {showCaptcha && (
        <>
          <div className="mt-[20px] w-[320px]">
            <CaptchaBox onRefresh={handleCaptchaRefresh} />
          </div>
          <div className="mt-[20px] w-[320px]">
            <AuthInput
              name="captcha"
              placeholder="보안문자 입력"
              value={captcha}
              onChange={(e) => onChangeCaptcha?.(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="mt-[40px] w-[320px]">
        <AuthButton label={submitLabel} onClick={onSubmit} />
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
