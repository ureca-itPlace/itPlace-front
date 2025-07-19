import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import VerificationCodeForm from './VerificationCodeForm';
import SignUpForm from '../signup/SignUpForm';
import SignUpFinalForm from '../signup/SignUpFinalForm';
import { showToast } from '../../../../utils/toast';
import { validateCaptcha } from 'react-simple-captcha';
import { sendVerificationCode } from '../../apis/verification';
import PhoneAuth from '../common/PhoneAuth';

type Props = {
  mode: 'signup' | 'find';
  currentStep: 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal';
  onGoToLogin: () => void;
  onAuthComplete: (data: { name: string; phone: string }) => void;
  onVerified: (
    verifiedType: 'new' | 'uplus' | 'local' | 'oauth',
    user: {
      name: string;
      phone: string;
      birthday: string;
      gender: string;
      membershipId: string;
      title?: string;
    }
  ) => void;
  onSignUpComplete: () => void;
  nameFromPhoneAuth: string;
  phoneFromPhoneAuth: string;
  showTab?: boolean;
  title?: string;
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
  title,
}: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [loading, setLoading] = useState(false);

  const isReadyToValidate = name.trim() && phone.trim() && userCaptchaInput.trim();

  const handleVerified = ({ name, phone, birthday, gender, membershipId }: any) => {
    setName(name);
    setPhone(phone);
    setBirthday(birthday);
    setGender(gender);
    setMembershipId(membershipId);

    if (mode === 'find') {
      onVerified('new', { name, phone, birthday, gender, membershipId });
    } else {
      onVerified('uplus', { name, phone, birthday, gender, membershipId });
    }
  };

  const handleNext = async () => {
    if (!isReadyToValidate) return;

    const isCaptchaValid = validateCaptcha(userCaptchaInput.trim());
    if (!isCaptchaValid) {
      showToast('입력하신 보안문자가 이미지와 일치하지 않습니다.', 'error');
      return;
    }

    setLoading(true);
    try {
      await sendVerificationCode(name, phone);
      onAuthComplete({ name, phone });
      console.log('인증번호 전송이 완료되었습니다. ');
    } catch (error) {
      const axiosError = error as AxiosError<{ code?: string; message?: string }>;
      const res = axiosError.response?.data;
      let message = '인증번호 전송에 실패했습니다. 다시 시도해주세요.';

      if (res) {
        switch (res.code) {
          case 'INVALID_INPUT':
            message = '잘못된 번호 형식입니다.';
            break;
          case 'DUPLICATE_PHONE_NUMBER':
            message = res.message || '이미 사용 중인 전화번호입니다.';
            break;
          default:
            message = res.message || message;
        }
      }

      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === 'verification') {
    return (
      <VerificationCodeForm
        mode={mode}
        onGoToLogin={onGoToLogin}
        onVerified={handleVerified}
        name={nameFromPhoneAuth}
        phone={phoneFromPhoneAuth}
      />
    );
  }

  if (currentStep === 'signUp') {
    return (
      <SignUpForm
        nameFromPhoneAuth={name}
        phoneFromPhoneAuth={phone}
        birthdayFromPhoneAuth={birthday}
        genderFromPhoneAuth={gender}
        membershipIdFromPhoneAuth={membershipId}
        onGoToLogin={onGoToLogin}
        onNext={({ birthday, gender, membershipId }) => {
          setBirthday(birthday);
          setGender(gender);
          setMembershipId(membershipId);
          onSignUpComplete();
        }}
      />
    );
  }

  if (currentStep === 'signUpFinal') {
    return (
      <SignUpFinalForm
        onGoToLogin={onGoToLogin}
        name={name}
        phoneNumber={phone}
        birthday={birthday}
        gender={gender}
        membershipId={membershipId}
      />
    );
  }

  return (
    <PhoneAuth
      headerSlot={
        title ? (
          <div className="w-[320px] text-left mt-[20px]">
            <p className="text-title-4 whitespace-pre-line">{title}</p>
          </div>
        ) : null
      }
      name={name}
      phone={phone}
      captcha={userCaptchaInput}
      onChangeName={setName}
      onChangePhone={setPhone}
      onChangeCaptcha={setUserCaptchaInput}
      onSubmit={handleNext}
      showCaptcha={true}
      showFooter={true}
      onClickLogin={onGoToLogin}
      loading={loading}
    />
  );
};

export default PhoneAuthForm;
