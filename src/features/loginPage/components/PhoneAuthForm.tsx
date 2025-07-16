import { useState, useCallback, useMemo } from 'react';
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
  mode: 'signup' | 'find';
  currentStep: 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal';
  onGoToLogin: () => void;
  onAuthComplete: (data: { name: string; phone: string; registrationId: string }) => void;
  onVerified: () => void;
  onSignUpComplete: () => void;
  nameFromPhoneAuth: string;
  phoneFromPhoneAuth: string;
  registrationIdFromPhoneAuth: string;
};

const PhoneAuthForm = ({
  mode,
  currentStep,
  onGoToLogin,
  onAuthComplete,
  onVerified,
  onSignUpComplete,
  nameFromPhoneAuth,
  phoneFromPhoneAuth,
  registrationIdFromPhoneAuth,
}: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [membershipId, setMembershipId] = useState('');

  // 보안문자 외 입력 유효성만 확인
  const isReadyToValidate = name.trim() && phone.trim() && userCaptchaInput.trim();

  // 새로고침 핸들러
  const handleCaptchaRefresh = useCallback(() => {
    loadCaptchaEnginge(6); // 새 캡차 생성
    setUserCaptchaInput('');
  }, []);

  // CaptchaBox는 useMemo로 고정 렌더링
  const memoizedCaptchaBox = useMemo(() => {
    return <CaptchaBox onRefresh={handleCaptchaRefresh} />;
  }, [handleCaptchaRefresh]);

  const handleNext = async () => {
    if (!isReadyToValidate) return;

    const isCaptchaValid = validateCaptcha(userCaptchaInput.trim());
    if (!isCaptchaValid) {
      alert('보안문자가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await sendVerificationCode(name, phone);
      const registrationId = res.data.registrationId;
      onAuthComplete({ name, phone, registrationId });
    } catch (error: any) {
      console.error('전송 실패:', error.response?.data || error.message);
    }
  };

  if (currentStep === 'verification') {
    return (
      <VerificationCodeForm
        mode={mode}
        onGoToLogin={onGoToLogin}
        onVerified={onVerified}
        name={nameFromPhoneAuth}
        phone={phoneFromPhoneAuth}
        registrationId={registrationIdFromPhoneAuth}
      />
    );
  }

  if (currentStep === 'signUp') {
    return (
      <SignUpForm
        nameFromPhoneAuth={nameFromPhoneAuth}
        phoneFromPhoneAuth={phoneFromPhoneAuth}
        onGoToLogin={onGoToLogin}
        onNext={({ birthday, gender, membershipId }) => {
          setBirthday(birthday);
          setGender(gender);
          setMembershipId(membershipId);
          onSignUpComplete(); // currentStep을 'signUpFinal'로 바꾸는 로직
        }}
      />
    );
  }

  if (currentStep === 'signUpFinal') {
    return (
      <SignUpFinalForm
        onGoToLogin={onGoToLogin}
        registrationId={registrationIdFromPhoneAuth}
        name={nameFromPhoneAuth}
        phoneNumber={phoneFromPhoneAuth}
        birthday={birthday}
        gender={gender}
        membershipId={membershipId}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[320px] text-left">
        <p className="text-title-4">번호 인증을 위한</p>
        <p className="text-title-4">개인 정보를 입력해주세요</p>
      </div>

      <div className="mt-[20px]">
        <AuthInput
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mt-[20px]">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="mt-[20px]">{memoizedCaptchaBox}</div>

      <div className="mt-[20px]">
        <AuthInput
          name="captcha"
          placeholder="보안문자 입력"
          value={userCaptchaInput}
          onChange={(e) => setUserCaptchaInput(e.target.value)}
        />
      </div>

      <div className="mt-[20px]">
        <AuthButton
          label="다음"
          onClick={handleNext}
          variant={isReadyToValidate ? 'default' : 'disabled'}
        />
      </div>

      <AuthFooter
        leftText="이미 회원이신가요?"
        rightText="로그인 하러 가기"
        onRightClick={onGoToLogin}
      />
    </div>
  );
};

export default PhoneAuthForm;
