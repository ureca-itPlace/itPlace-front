import { useState, useEffect } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import CaptchaBox from './CaptchaBox';
import AuthFooter from './AuthFooter';
import VerificationCodeForm from './VerificationCodeForm';
import SignUpForm from './SignUpForm';
import SignUpFinalForm from './SignUpFinalForm';

type Props = {
  currentStep: 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal';
  onGoToLogin: () => void;
  onAuthComplete: (data: { name: string; phone: string }) => void;
  onVerified: () => void;
  onSignUpComplete: () => void;
  nameFromPhoneAuth: string;
  phoneFromPhoneAuth: string;
};

const generateRandomText = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const PhoneAuthForm = ({
  currentStep,
  onGoToLogin,
  onAuthComplete,
  onVerified,
  onSignUpComplete,
  nameFromPhoneAuth,
  phoneFromPhoneAuth,
}: Props) => {
  // ✅ 훅은 무조건 조건 밖에서 선언해야 함
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');

  useEffect(() => {
    setCaptchaText(generateRandomText());
  }, []);

  const isValid = name && phone && userCaptchaInput;

  const handleNext = () => {
    if (isValid) {
      onAuthComplete({ name, phone });
    }
  };

  // ✅ 렌더링은 조건에 따라 분기
  if (currentStep === 'verification') {
    return <VerificationCodeForm onGoToLogin={onGoToLogin} onVerified={onVerified} />;
  }

  if (currentStep === 'signUp') {
    return (
      <SignUpForm
        nameFromPhoneAuth={nameFromPhoneAuth}
        phoneFromPhoneAuth={phoneFromPhoneAuth}
        onGoToLogin={onGoToLogin}
        onNext={onSignUpComplete}
      />
    );
  }

  if (currentStep === 'signUpFinal') {
    return <SignUpFinalForm onGoToLogin={onGoToLogin} />;
  }

  // 기본 phoneAuth 화면
  return (
    <div className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="w-[320px] text-left">
        <p className="text-title-4">번호 인증을 위한</p>
        <p className="text-title-4">개인 정보를 입력해주세요</p>
      </div>

      {/* 이름 입력 */}
      <div className="mt-[20px]">
        <AuthInput
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* 휴대폰 번호 입력 */}
      <div className="mt-[20px]">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* 캡차 박스 */}
      <div className="mt-[20px]">
        <CaptchaBox
          captchaText={captchaText}
          onRefresh={() => setCaptchaText(generateRandomText())}
        />
      </div>

      {/* 캡차 입력 */}
      <div className="mt-[20px]">
        <AuthInput
          name="captcha"
          placeholder="보안문자 입력"
          value={userCaptchaInput}
          onChange={(e) => setUserCaptchaInput(e.target.value)}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-[20px]">
        <AuthButton label="다음" onClick={handleNext} variant={isValid ? 'default' : 'disabled'} />
      </div>

      {/* 하단 링크 */}
      <AuthFooter
        leftText="이미 회원이신가요?"
        rightText="로그인 하러 가기"
        onRightClick={onGoToLogin}
      />
    </div>
  );
};

export default PhoneAuthForm;
