import { useState, useCallback, useMemo } from 'react';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import CaptchaBox from './CaptchaBox';
import AuthFooter from '../common/AuthFooter';
import VerificationCodeForm from './VerificationCodeForm';
import SignUpForm from '../signup/SignUpForm';
import SignUpFinalForm from '../signup/SignUpFinalForm';
import { showToast } from '../../../../utils/toast';
import { loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
import { sendVerificationCode } from '../../apis/verification';
import { loadUplusData } from '../../apis/auth';

type Props = {
  mode: 'signup' | 'find';
  currentStep: 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal';
  onGoToLogin: () => void;
  onAuthComplete: (data: { name: string; phone: string; registrationId: string }) => void;
  onVerified: (
    verifiedType: 'new' | 'uplus' | 'local' | 'oauth',
    user: {
      name: string;
      phone: string;
      registrationId: string;
      birthday: string;
      gender: string;
      membershipId: string;
    }
  ) => void;
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
  // 입력 필드 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');

  // 이후 단계에 전달할 추가 정보
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [membershipId, setMembershipId] = useState('');

  // 보안문자 오류 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 입력 유효성 여부
  const isReadyToValidate = name.trim() && phone.trim() && userCaptchaInput.trim();

  // 보안문자 새로고침 핸들러
  const handleCaptchaRefresh = useCallback(() => {
    loadCaptchaEnginge(6);
    setUserCaptchaInput('');
  }, []);

  // 보안문자 오류 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserCaptchaInput('');
  };

  // 인증 성공 후 사용자 정보 처리 및 분기 전달
  const handleVerified = async ({
    name,
    phone,
    registrationId,
    isUplus,
    verifiedType,
  }: {
    name: string;
    phone: string;
    registrationId: string;
    isUplus: boolean;
    verifiedType: 'new' | 'uplus' | 'local' | 'oauth';
  }) => {
    let birthday = '';
    let gender = '';
    let membershipId = '';

    // 기본 정보 저장
    setName(name);
    setPhone(phone);

    // U+ 회원이면 추가 정보 불러오기
    if (isUplus) {
      try {
        const res = await loadUplusData(registrationId);
        birthday = res.data.birthday;
        gender = res.data.gender;
        membershipId = res.data.membershipId;
      } catch (error) {
        console.error('U+ 데이터 로딩 실패:', error);
      }
    }

    // 상태 업데이트
    setBirthday(birthday);
    setGender(gender);
    setMembershipId(membershipId);

    // 상위로 인증 결과와 사용자 정보 함께 전달
    onVerified(verifiedType, {
      name,
      phone,
      registrationId,
      birthday,
      gender,
      membershipId,
    });
  };

  // 보안문자 캡차 박스 메모이제이션
  const memoizedCaptchaBox = useMemo(() => {
    return <CaptchaBox onRefresh={handleCaptchaRefresh} />;
  }, [handleCaptchaRefresh]);

  // 다음 버튼 클릭 시 처리
  const handleNext = async () => {
    if (!isReadyToValidate) return;

    const isCaptchaValid = validateCaptcha(userCaptchaInput.trim());
    if (!isCaptchaValid) {
      showToast('입력하신 보안문자가 이미지와 일치하지 않습니다.', 'error', {
        position: 'bottom-center',
      });
      return;
    }

    try {
      const res = await sendVerificationCode(name, phone);
      const registrationId = res.data.registrationId;
      onAuthComplete({ name, phone, registrationId });
    } catch (error: any) {
      const res = error?.response?.data;
      let message = '인증번호 전송에 실패했습니다. 다시 시도해주세요.';

      if (res) {
        switch (res.code) {
          case 'INVALID_INPUT':
            message = '잘못된 번호 형식입니다. 010을 포함한 11자리 전화번호를 입력해주세요.';
            break;
          case 'DUPLICATE_PHONE_NUMBER':
            message = res.message || '이미 사용 중인 전화번호입니다.';
            break;
          default:
            message = res.message || message;
        }
      }

      showToast(message, 'error', {
        position: 'bottom-center',
      });
    }
  };

  // 단계별 렌더링 분기

  // 1단계: 인증번호 입력 화면
  if (currentStep === 'verification') {
    return (
      <VerificationCodeForm
        mode={mode}
        onGoToLogin={onGoToLogin}
        onVerified={handleVerified}
        name={nameFromPhoneAuth}
        phone={phoneFromPhoneAuth}
        registrationId={registrationIdFromPhoneAuth}
      />
    );
  }

  // 2단계: 기본 정보 입력 화면
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

  // 3단계: 이메일, 비밀번호 입력 화면
  if (currentStep === 'signUpFinal') {
    return (
      <SignUpFinalForm
        onGoToLogin={onGoToLogin}
        registrationId={registrationIdFromPhoneAuth}
        name={name}
        phoneNumber={phone}
        birthday={birthday}
        gender={gender}
        membershipId={membershipId}
      />
    );
  }

  // 초기 단계: 이름 + 전화번호 + 보안문자 입력 화면
  return (
    <div className="w-full flex flex-col items-center">
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
          placeholder="휴대폰 번호 ( Ex : 01000000000 )"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* 보안문자 캡차 */}
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

      {/* 로그인 링크 */}
      <AuthFooter
        leftText="이미 회원이신가요?"
        rightText="로그인 하러 가기"
        onRightClick={onGoToLogin}
      />
    </div>
  );
};

export default PhoneAuthForm;
