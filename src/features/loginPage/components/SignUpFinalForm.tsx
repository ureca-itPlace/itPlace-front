import { useState } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import ErrorMessage from './ErrorMessage';
import AuthFooter from './AuthFooter';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import useValidation from '../hooks/UseValidation';
import { signUpFinal } from '../apis/user';
import { sendEmailVerificationCode, checkEmailVerificationCode } from '../apis/verification';

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
  // 입력 데이터
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    verificationCode: '',
  });

  // 유효성 터치 여부
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  });

  // 이메일 인증 관련 상태
  const [emailSent, setEmailSent] = useState(false); // 인증번호 요청 여부
  const [emailVerified, setEmailVerified] = useState(false); // 인증 완료 여부
  const [verificationCodeError, setVerificationCodeError] = useState(''); // 인증 실패 메시지

  // 비밀번호 보기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 유효성 검사 훅
  const { errors, emailChecked, checkEmail, validateAll, validateField } = useValidation();

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (name === 'email' || name === 'password' || name === 'passwordConfirm') {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // 타입 단언으로 오류 방지
      validateField(name as 'email' | 'password' | 'passwordConfirm', value, updated);
    }
  };

  // 이메일 인증 요청
  const handleSendEmailCode = async () => {
    try {
      await sendEmailVerificationCode({ registrationId: registrationId, email: formData.email });
      setEmailSent(true);
      setVerificationCodeError('');
      alert('이메일로 인증번호가 전송되었습니다.');
    } catch (err: any) {
      console.error('이메일 인증 요청 실패:', err?.response?.data || err.message);
      alert(err?.response?.data?.message || '이메일 인증 요청 실패');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      await checkEmailVerificationCode(formData.email, formData.verificationCode, registrationId);
      setEmailVerified(true);
      setVerificationCodeError('');
      alert('이메일 인증이 완료되었습니다.');
    } catch (err: any) {
      console.error('인증 실패:', err?.response?.data || err.message);
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

  // 최종 회원가입 요청
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

        await signUpFinal(payload);
        onGoToLogin();
      } catch (error) {
        console.error('회원가입 실패', error);
      }
    }
  };

  // 버튼 활성화 조건
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

      {/* 이메일 입력 */}
      <div className="w-full max-w-[320px] mt-[51px]">
        <div className="relative">
          <AuthInput
            name="email"
            value={formData.email}
            placeholder="이메일"
            onChange={handleChange}
            disabled={emailVerified}
          />
          {!emailVerified && (
            <button
              type="button"
              onClick={handleSendEmailCode}
              className="absolute right-[12px] top-[12px] w-[69px] h-[26px] bg-purple04 text-white text-body-4 rounded-[10px]"
            >
              인증하기
            </button>
          )}
        </div>
        {touched.email && errors.email && <ErrorMessage message={errors.email} />}
      </div>

      {/* 인증번호 입력 */}
      {emailSent && !emailVerified && (
        <div className="w-full max-w-[320px] mt-[15px]">
          <div className="relative">
            <AuthInput
              name="verificationCode"
              placeholder="인증번호 입력"
              value={formData.verificationCode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, verificationCode: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className="absolute right-[12px] top-[12px] w-[69px] h-[26px] bg-purple04 text-white text-body-4 rounded-[10px]"
            >
              확인
            </button>
          </div>
          {verificationCodeError && <ErrorMessage message={verificationCodeError} />}
        </div>
      )}

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

      {/* 비밀번호 확인 */}
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
    </div>
  );
};

export default SignUpFinalForm;
