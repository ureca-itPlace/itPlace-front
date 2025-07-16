import { useState } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import ErrorMessage from './ErrorMessage';
import AuthFooter from './AuthFooter';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import useValidation from '../hooks/UseValidation';
import { signUpFinal } from '../apis/user';

type SignUpFinalFormProps = {
  onGoToLogin: () => void;
};

const SignUpFinalForm = ({ onGoToLogin }: SignUpFinalFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { errors, emailChecked, checkEmail, validateAll, validateField } = useValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof typeof formData, value, updated);
  };

  const handleCheckEmail = () => {
    console.log('중복 확인 요청:', formData.email);
    checkEmail();
  };

  const handleNext = async () => {
    const valid = validateAll(formData);
    if (valid && emailChecked) {
      try {
        console.log('회원가입 최종 요청 중...');
        await signUpFinal(formData.email, formData.password);
        console.log('회원가입 성공');
        onGoToLogin();
      } catch (error) {
        console.error('회원가입 실패:', error);
        console.warn('백엔드 없음. 강제로 이동');
        onGoToLogin();
      }
    }
  };

  // 버튼 활성화 조건: 실시간 계산 (상태 사용 X)
  const isValid =
    formData.email &&
    formData.password &&
    formData.passwordConfirm &&
    formData.password === formData.passwordConfirm &&
    !errors.email &&
    !errors.password &&
    !errors.passwordConfirm &&
    emailChecked;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[320px] text-left">
        <p className="text-title-4">개인정보를 입력해주세요</p>
      </div>

      {/* 이메일 */}
      <div className="w-full max-w-[320px] mt-[51px]">
        <div className="relative">
          <AuthInput
            name="email"
            value={formData.email}
            placeholder="이메일"
            onChange={handleChange}
            disabled={emailChecked}
          />
          {!emailChecked && (
            <button
              type="button"
              onClick={handleCheckEmail}
              className="absolute right-[12px] top-[12px] w-[69px] h-[26px] bg-purple04 text-white text-body-4 rounded-[10px]"
            >
              중복 확인
            </button>
          )}
        </div>
        {touched.email && errors.email && <ErrorMessage message={errors.email} />}
      </div>

      {/* 비밀번호 */}
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

      {/* 확인 버튼 */}
      <AuthButton
        label="확인"
        onClick={handleNext}
        variant={isValid ? 'default' : 'disabled'}
        className="w-[320px] mt-[100px] max-lg:w-full"
      />

      {/* 하단 링크 */}
      <AuthFooter
        leftText="이미 회원이신가요?"
        rightText="로그인 하러 가기"
        onRightClick={onGoToLogin}
      />
    </div>
  );
};

export default SignUpFinalForm;
