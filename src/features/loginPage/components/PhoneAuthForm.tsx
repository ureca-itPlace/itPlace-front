// 주요 라이브러리 및 컴포넌트 임포트
import { useState, useCallback, useMemo } from 'react';
import Modal from '../../../components/Modal';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import CaptchaBox from './CaptchaBox';
import AuthFooter from './AuthFooter';
import VerificationCodeForm from './VerificationCodeForm';
import SignUpForm from './SignUpForm';
import SignUpFinalForm from './SignUpFinalForm';
import { showToast } from '../../../utils/toast';
import { loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
import { sendVerificationCode } from '../apis/verification';
import { loadUplusData } from '../apis/auth';

type Props = {
  mode: 'signup' | 'find';
  currentStep: 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal';
  onGoToLogin: () => void;
  onAuthComplete: (data: { name: string; phone: string; registrationId: string }) => void;
  onVerified: (verifiedType: 'new' | 'uplus' | 'local' | 'oauth') => void; // 인증 결과 타입을 상위로 전달
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

  /**
   * 인증 성공 후 (확인 버튼 클릭 이후)
   * U+ 회원일 경우 U+ 데이터 불러오고 상태에 저장,
   * 그 외는 기존 값 그대로 유지
   */
  const handleVerified = async ({
    name,
    phone,
    registrationId,
    isUplus,
    verifiedType, // VerificationCodeForm에서 전달받은 유저 타입
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

    // 다음 폼에서 사용할 상태 저장
    setBirthday(birthday);
    setGender(gender);
    setMembershipId(membershipId);

    // 인증 결과를 상위로 전달하여 흐름 분기
    onVerified(verifiedType);
  };

  // 보안문자 캡차 박스 메모이제이션
  const memoizedCaptchaBox = useMemo(() => {
    return <CaptchaBox onRefresh={handleCaptchaRefresh} />;
  }, [handleCaptchaRefresh]);

  /**
   * '다음' 버튼 클릭 시:
   * - 보안문자 유효성 확인
   * - 유효하면 인증번호 전송 및 registrationId 저장
   */
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

  /**
   * 단계별 렌더링
   */

  // 1단계: 인증번호 입력
  if (currentStep === 'verification') {
    return (
      <VerificationCodeForm
        mode={mode}
        onGoToLogin={onGoToLogin}
        onVerified={handleVerified} // 인증 결과를 포함해 전달받음
        name={nameFromPhoneAuth}
        phone={phoneFromPhoneAuth}
        registrationId={registrationIdFromPhoneAuth}
      />
    );
  }

  // 2단계: 기본 정보 입력
  if (currentStep === 'signUp') {
    return (
      <SignUpForm
        nameFromPhoneAuth={name}
        phoneFromPhoneAuth={phone}
        onGoToLogin={onGoToLogin}
        onNext={({ birthday, gender, membershipId }) => {
          setBirthday(birthday);
          setGender(gender);
          setMembershipId(membershipId);
          onSignUpComplete(); // 다음 단계 (signUpFinal)로 전환
        }}
      />
    );
  }

  // 3단계: 이메일, 비밀번호 입력
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

  /**
   * 초기 단계: 이름 + 전화번호 + 보안문자 입력
   */
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

      {/* 보안문자 오류 모달 */}
      <Modal
        isOpen={isModalOpen}
        title="보안문자 오류"
        message="입력하신 보안문자가 이미지와 
        일치하지 않습니다."
        buttons={[
          {
            label: '확인',
            type: 'primary',
            onClick: handleCloseModal,
          },
        ]}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PhoneAuthForm;
