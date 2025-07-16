import { useState, useEffect, useCallback, useMemo } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import CaptchaBox from './CaptchaBox';
import AuthFooter from './AuthFooter';
import VerificationCodeForm from './VerificationCodeForm';
import SignUpForm from './SignUpForm';
import SignUpFinalForm from './SignUpFinalForm';
import { loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
import { sendVerificationCode } from '../apis/verification';

type Props = {
  currentStep: 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal';
  onGoToLogin: () => void;
  onAuthComplete: (data: { name: string; phone: string }) => void;
  onVerified: () => void;
  onSignUpComplete: () => void;
  nameFromPhoneAuth: string;
  phoneFromPhoneAuth: string;
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
  // 입력 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');

  // 이름, 전화번호, 보안문자 입력 여부만 체크
  const isReadyToValidate = name.trim() && phone.trim() && userCaptchaInput.trim();

  // 캡차 새로고침 시 보안문자 재생성 + 입력 초기화
  const handleCaptchaRefresh = useCallback(() => {
    loadCaptchaEnginge(6);
    setUserCaptchaInput('');
  }, []);

  // 캡차 박스는 useMemo로 렌더 고정
  const memoizedCaptchaBox = useMemo(() => {
    return <CaptchaBox onRefresh={handleCaptchaRefresh} />;
  }, [handleCaptchaRefresh]);

  // 다음 버튼 클릭 시 처리 로직
  const handleNext = async () => {
    if (!isReadyToValidate) return;

    // 보안문자 검증
    const isCaptchaValid = validateCaptcha(userCaptchaInput.trim());
    if (!isCaptchaValid) {
      alert('보안문자가 일치하지 않습니다.');
      return;
    }

    try {
      await sendVerificationCode(name, phone);
      onAuthComplete({ name, phone });
    } catch (error) {
      // 실제 전송 실패 시에도 테스트를 위해 강제로 다음 단계로 넘어감
      onAuthComplete({ name, phone });
    }
  };

  // 단계별 폼 전환
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

  // 기본: 전화번호 인증 단계 UI
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

      {/* 전화번호 입력 */}
      <div className="mt-[20px]">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* 캡차 이미지 박스 */}
      <div className="mt-[20px]">{memoizedCaptchaBox}</div>

      {/* 보안문자 입력 */}
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
        <AuthButton
          label="다음"
          onClick={handleNext}
          variant={isReadyToValidate ? 'default' : 'disabled'}
        />
      </div>

      {/* 로그인 유도 문구 */}
      <AuthFooter
        leftText="이미 회원이신가요?"
        rightText="로그인 하러 가기"
        onRightClick={onGoToLogin}
      />
    </div>
  );
};

export default PhoneAuthForm;
