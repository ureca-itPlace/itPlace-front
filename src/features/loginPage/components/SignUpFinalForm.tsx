import { useState } from 'react';
import Modal from '../../../components/Modal';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import ErrorMessage from './ErrorMessage';
import AuthFooter from './AuthFooter';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import useValidation from '../hooks/UseValidation';
import { signUpFinal } from '../apis/user';
import { sendEmailVerificationCode, checkEmailVerificationCode } from '../apis/verification';
import EmailVerificationBox from './EmailVerificationBox'; // 이메일 인증 컴포넌트 임포트

type SignUpFinalFormProps = {
  onGoToLogin: () => void;
  registrationId: string;
  name: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  membershipId: string;
};

const SignUpFinalForm = ({
  onGoToLogin,
  registrationId,
  name,
  phoneNumber,
  birthday,
  gender,
  membershipId,
}: SignUpFinalFormProps) => {
  // 사용자 입력값
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    verificationCode: '',
  });

  // 입력 필드 터치 여부
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  });

  // 이메일 인증 상태
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCodeError, setVerificationCodeError] = useState('');

  // 비밀번호 보기 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 로딩 모달 상태
  const [modal, setModal] = useState({
    open: false,
    title: '',
    loading: false,
  });

  // 유효성 검사 훅
  const { errors, validateAll, validateField } = useValidation();

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (name === 'email' || name === 'password' || name === 'passwordConfirm') {
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name as 'email' | 'password' | 'passwordConfirm', value, updated);
    }
  };

  // 이메일 인증 요청
  const handleSendEmailCode = async () => {
    if (!formData.email || errors.email) return;

    setModal({
      open: true,
      title: '인증 메일을 전송 중입니다.',
      loading: true,
    });

    try {
      const res = await sendEmailVerificationCode({
        registrationId,
        email: formData.email,
      });

      setModal({ open: false, title: '', loading: false });
      setEmailSent(true);
      setVerificationCodeError('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || '이메일 인증 요청 실패';
      setModal({ open: false, title: '', loading: false });
      setVerificationCodeError(msg);
      setEmailSent(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      await checkEmailVerificationCode(formData.email, formData.verificationCode, registrationId);
      setEmailVerified(true);
      setVerificationCodeError('');
    } catch (err: any) {
      const errorCode = err?.response?.data?.code;
      if (errorCode === 'EMAIL_CODE_MISMATCH') {
        setVerificationCodeError('인증번호가 일치하지 않습니다.');
      } else if (errorCode === 'EMAIL_CODE_EXPIRED') {
        setVerificationCodeError('인증번호가 만료되었습니다.');
      } else {
        setVerificationCodeError('인증에 실패했습니다.');
      }
      setEmailVerified(false);
    }
  };

  // 최종 회원가입 처리
  const handleNext = async () => {
    const valid = validateAll(formData);
    if (valid && emailVerified) {
      try {
        const payload = {
          registrationId,
          name,
          email: formData.email,
          phoneNumber,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          gender,
          birthday,
          membershipId,
        };

        const response = await signUpFinal(payload);
        console.log('응답결과 ', response.data);
        onGoToLogin();
      } catch (error) {
        console.error('회원가입 실패', error);
      }
    }
  };

  // 회원가입 버튼 활성화 조건
  const isValid =
    formData.email &&
    formData.password &&
    formData.passwordConfirm &&
    formData.password === formData.passwordConfirm &&
    !errors.email &&
    !errors.password &&
    !errors.passwordConfirm &&
    emailVerified;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 안내 문구 */}
      <div className="w-[320px] text-left">
        <p className="text-title-4">개인정보를 입력해주세요</p>
      </div>

      {/* 이메일 인증 컴포넌트 */}
      <div className="w-full max-w-[320px] mt-[51px]">
        <EmailVerificationBox
          email={formData.email}
          onChangeEmail={(val) =>
            handleChange({
              target: { name: 'email', value: val },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          verificationCode={formData.verificationCode}
          onChangeCode={(val) => setFormData((prev) => ({ ...prev, verificationCode: val }))}
          onSendCode={handleSendEmailCode}
          onVerifyCode={handleVerifyCode}
          emailSent={emailSent}
          emailVerified={emailVerified}
          errorMessage={(touched.email && errors.email) || verificationCodeError || undefined}
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="w-full max-w-[320px] mt-[15px]">
        <div className="relative">
          <AuthInput
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            placeholder="비밀번호"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-[12px] top-[12px] text-grey04"
          >
            {showPassword ? <TbEyeOff size={20} /> : <TbEye size={20} />}
          </button>
        </div>
        {touched.password && errors.password && <ErrorMessage message={errors.password} />}
      </div>

      {/* 비밀번호 확인 입력 */}
      <div className="w-full max-w-[320px] mt-[15px]">
        <div className="relative">
          <AuthInput
            name="passwordConfirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            value={formData.passwordConfirm}
            placeholder="비밀번호 확인"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm((prev) => !prev)}
            className="absolute right-[12px] top-[12px] text-grey04"
          >
            {showPasswordConfirm ? <TbEyeOff size={20} /> : <TbEye size={20} />}
          </button>
        </div>
        {touched.passwordConfirm && errors.passwordConfirm && (
          <ErrorMessage message={errors.passwordConfirm} />
        )}
      </div>

      {/* 회원가입 버튼 */}
      <AuthButton
        label="회원가입"
        onClick={handleNext}
        variant={isValid ? 'default' : 'disabled'}
        className="w-[320px] mt-[100px] max-lg:w-full"
      />

      {/* 로그인 링크 */}
      <AuthFooter
        leftText="이미 회원이신가요?"
        rightText="로그인 하러 가기"
        onRightClick={onGoToLogin}
      />

      {/* 이메일 인증 로딩 모달 */}
      <Modal
        isOpen={modal.open}
        title={modal.title}
        onClose={() => setModal({ open: false, title: '', loading: false })}
      >
        {modal.loading && (
          <div className="w-full flex justify-center mt-[16px]">
            <div className="w-[32px] h-[32px] border-4 border-purple04 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SignUpFinalForm;
