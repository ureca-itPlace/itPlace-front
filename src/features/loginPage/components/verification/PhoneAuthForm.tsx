import { useState } from 'react';
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
    verifiedType:
      | 'new'
      | 'uplus'
      | 'local'
      | 'oauth'
      | 'oauth-new'
      | 'oauth-to-local-merge'
      | 'local-to-oauth-merge',
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
  const [verifiedType, setVerifiedType] = useState<
    'new' | 'uplus' | 'oauth-to-local-merge' | 'local-to-oauth-merge'
  >('new');

  const isReadyToValidate = name.trim() && phone.trim() && userCaptchaInput.trim();

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
        onVerified={(receivedVerifiedType, user) => {
          console.log('🟡 PhoneAuthForm: onVerified received:', { receivedVerifiedType, user });
          setName(user.name);
          setPhone(user.phone);
          setBirthday(user.birthday);
          setGender(user.gender);
          setMembershipId(user.membershipId);

          // verifiedType 상태 업데이트
          if (
            receivedVerifiedType === 'oauth-to-local-merge' ||
            receivedVerifiedType === 'local-to-oauth-merge' ||
            receivedVerifiedType === 'uplus'
          ) {
            setVerifiedType(receivedVerifiedType);
          } else {
            setVerifiedType('new');
          }

          // Pass the correct parameters to parent
          onVerified(receivedVerifiedType, user);
        }}
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
        verifiedType={verifiedType}
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
        verifiedType={verifiedType}
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
      onChangeName={(e) => setName(e.target.value)}
      onChangePhone={(e) => setPhone(e.target.value)}
      onChangeCaptcha={(e) => setUserCaptchaInput(e.target.value)}
      onSubmit={handleNext}
      showCaptcha={true}
      showFooter={true}
      onClickLogin={onGoToLogin}
      loading={loading}
    />
  );
};

export default PhoneAuthForm;
