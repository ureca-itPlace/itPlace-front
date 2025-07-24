import { useState } from 'react';
import AuthInput from './AuthInput';
import ErrorMessage from './ErrorMessage';
import { TbEye, TbEyeOff } from 'react-icons/tb';

type Props = {
  password: string;
  passwordConfirm: string;
  onChangePassword: (val: string) => void;
  onChangeConfirm: (val: string) => void;
  passwordError?: string;
  passwordConfirmError?: string;
};

const PasswordInputForm = ({
  password,
  passwordConfirm,
  onChangePassword,
  onChangeConfirm,
  passwordError,
  passwordConfirmError,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    passwordConfirm: false,
  });

  return (
    <>
      {/* 비밀번호 입력 필드 */}
      <div className="w-full max-w-[320px] max-xl:max-w-[274px] max-lg:max-w-[205px]">
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
            className="absolute right-[12px] max-xl:right-[10px] max-lg:right-[8px] top-[12px] max-xl:top-[10px] max-lg:top-[8px] text-grey04"
          >
            {showPassword ? (
              <TbEyeOff size={20} className="max-xl:text-[17px] max-lg:text-[14px]" />
            ) : (
              <TbEye size={20} className="max-xl:text-[17px] max-lg:text-[14px]" />
            )}
          </button>
        </div>
        {touched.password && passwordError && <ErrorMessage message={passwordError} />}
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] w-full max-w-[320px] max-xl:max-w-[274px] max-lg:max-w-[205px]">
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
            className="absolute right-[12px] max-xl:right-[10px] max-lg:right-[8px] top-[12px] max-xl:top-[10px] max-lg:top-[8px] text-grey04"
          >
            {showPasswordConfirm ? (
              <TbEyeOff size={20} className="max-xl:text-[17px] max-lg:text-[14px]" />
            ) : (
              <TbEye size={20} className="max-xl:text-[17px] max-lg:text-[14px]" />
            )}
          </button>
        </div>
        {touched.passwordConfirm && passwordConfirmError && (
          <ErrorMessage message={passwordConfirmError} />
        )}
      </div>
    </>
  );
};

export default PasswordInputForm;
