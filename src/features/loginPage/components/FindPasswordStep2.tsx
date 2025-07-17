import { useState, useEffect } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import ErrorMessage from './ErrorMessage';
import AuthFooter from './AuthFooter';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import useValidation from '../hooks/UseValidation';

type Props = {
  password: string;
  passwordConfirm: string;
  onChangePassword: (val: string) => void;
  onChangeConfirm: (val: string) => void;
  onSubmit: () => void;
  errorMessage?: string;
};

const FindPasswordStep2 = ({
  password,
  passwordConfirm,
  onChangePassword,
  onChangeConfirm,
  onSubmit,
  errorMessage,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { errors, validateField } = useValidation();

  const [touched, setTouched] = useState({
    password: false,
    passwordConfirm: false,
  });

  // 비밀번호 입력 시 유효성 검사 수행
  useEffect(() => {
    validateField('password', password, {
      email: '',
      password,
      passwordConfirm,
    });
  }, [password, passwordConfirm, validateField]);

  // 비밀번호 확인 입력 시 유효성 검사 수행
  useEffect(() => {
    validateField('passwordConfirm', passwordConfirm, {
      email: '',
      password,
      passwordConfirm,
    });
  }, [passwordConfirm, password, validateField]);

  // 버튼 활성화 조건
  const isValid =
    password &&
    passwordConfirm &&
    password === passwordConfirm &&
    !errors.password &&
    !errors.passwordConfirm;

  return (
    <div className="flex flex-col items-center">
      {/* 안내 문구 */}
      <div className="text-title-4 text-left w-[320px]">
        <p>
          <span className="font-bold">새 비밀번호</span>를 입력해주세요
        </p>
      </div>

      {/* 비밀번호 입력 필드 */}
      <div className="mt-[50px] w-full max-w-[320px]">
        <div className="relative">
          <AuthInput
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              onChangePassword(e.target.value);
              setTouched((prev) => ({ ...prev, password: true }));
            }}
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

      {/* 비밀번호 확인 입력 필드 */}
      <div className="mt-[20px] w-full max-w-[320px]">
        <div className="relative">
          <AuthInput
            name="passwordConfirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => {
              onChangeConfirm(e.target.value);
              setTouched((prev) => ({ ...prev, passwordConfirm: true }));
            }}
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

      {/* 서버 응답 에러 메시지 */}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* 비밀번호 변경 버튼 */}
      <AuthButton
        className="w-[320px] mt-[100px] max-lg:w-full"
        label="비밀번호 변경"
        onClick={onSubmit}
        variant={isValid ? 'default' : 'disabled'}
      />

      {/* 로그인 링크 */}
      <AuthFooter
        leftText="비밀번호가 기억나셨다면?"
        rightText="로그인 하러 가기"
        onRightClick={onSubmit}
      />
    </div>
  );
};

export default FindPasswordStep2;
