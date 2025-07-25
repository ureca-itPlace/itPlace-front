import { useState } from 'react';
import { AxiosError } from 'axios';
import VerificationCodeForm from './VerificationCodeForm';
import SignUpForm from '../signup/SignUpForm';
import SignUpFinalForm from '../signup/SignUpFinalForm';
import { showToast } from '../../../../utils/toast';
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
  const [recaptchaValid, setRecaptchaValid] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifiedType, setVerifiedType] = useState<
    'new' | 'uplus' | 'oauth-to-local-merge' | 'local-to-oauth-merge'
  >('new');

  const isReadyToValidate = name.trim() && phone.trim() && recaptchaValid;

  const handleNext = async () => {
    if (!isReadyToValidate) return;

    if (!recaptchaValid) {
      showToast('reCAPTCHA 인증을 완료해주세요.', 'error');
      return;
    }

    setLoading(true);
    try {
      await sendVerificationCode(name, phone);
      onAuthComplete({ name, phone });
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
          <div className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full text-left mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] max-md:mt-[15px] max-sm:mt-[16px]">
            <p className="text-title-4 max-xl:text-title-5 max-lg:text-title-6 max-md:text-title-6 max-sm:text-title-5 whitespace-pre-line">
              {title}
            </p>
          </div>
        ) : null
      }
      name={name}
      phone={phone}
      onChangeName={(e) => setName(e.target.value)}
      onChangePhone={(e) => setPhone(e.target.value)}
      onRecaptchaChange={setRecaptchaValid}
      onSubmit={handleNext}
      showCaptcha={true}
      showFooter={true}
      onClickLogin={onGoToLogin}
      loading={loading}
      recaptchaValid={recaptchaValid}
    />
  );
};

export default PhoneAuthForm;
