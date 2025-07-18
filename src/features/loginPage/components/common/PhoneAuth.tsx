// components/common/PhoneAuth.tsx
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFooter from './AuthFooter';
import CaptchaBox from '../verification/CaptchaBox';
import ToggleTab from './FindToggleTab';
import { loadCaptchaEnginge } from 'react-simple-captcha';

type Props = {
  name: string;
  phone: string;
  captcha?: string;
  onChangeName: (val: string) => void;
  onChangePhone: (val: string) => void;
  onChangeCaptcha?: (val: string) => void;
  onSubmit: () => void;
  showTab?: boolean;
  showCaptcha?: boolean;
  title?: string;
  submitLabel?: string;
  onClickTabEmail?: () => void;
  onClickTabPassword?: () => void;
  showFooter?: boolean;
  onClickLogin?: () => void;
};

const PhoneAuth = ({
  name,
  phone,
  captcha = '',
  onChangeName,
  onChangePhone,
  onChangeCaptcha,
  onSubmit,
  showTab = false,
  showCaptcha = true,
  title = '번호 인증을 위한 개인 정보를 입력해주세요',
  submitLabel = '다음',
  onClickTabEmail,
  onClickTabPassword,
  showFooter = false,
  onClickLogin,
}: Props) => {
  const handleCaptchaRefresh = () => {
    loadCaptchaEnginge(6);
  };
  return (
    <div className="w-full flex flex-col items-center">
      {showTab && (
        <ToggleTab
          active="email"
          onClickEmail={onClickTabEmail || (() => {})}
          onClickPassword={onClickTabPassword || (() => {})}
        />
      )}

      {title && title.trim() !== '' && (
        <div className="w-[320px] text-left mt-[20px]">
          <p className="text-title-4 whitespace-pre-line">{title}</p>
        </div>
      )}

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
