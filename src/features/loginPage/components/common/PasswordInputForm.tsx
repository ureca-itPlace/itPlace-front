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
    <div className="w-full flex flex-col items-center">
      {/* 비밀번호 입력 필드 */}
      <div className="w-full max-w-[320px] max-xl:max-w-[274px] max-lg:max-w-[205px] max-md:max-w-none max-sm:max-w-none">
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
            className="absolute right-[12px] max-xl:right-[10px] max-lg:right-[8px] max-md:right-[11px] max-sm:right-[12px] top-[12px] max-xl:top-[10px] max-lg:top-[8px] max-md:top-[11px] max-sm:top-[12px] text-grey04"
          >
            {showPassword ? (
              <TbEyeOff
                size={18}
                className="text-[20px] max-xl:text-[17px] max-lg:text-[14px] max-md:text-[16px] max-sm:text-[18px]"
              />
            ) : (
              <TbEye
                size={18}
                className="text-[20px] max-xl:text-[17px] max-lg:text-[14px] max-md:text-[16px] max-sm:text-[18px]"
              />
            )}
          </button>
        </div>
        {touched.password && passwordError && <ErrorMessage message={passwordError} />}
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] max-md:mt-[16px] max-sm:mt-[16px] w-full max-w-[320px] max-xl:max-w-[274px] max-lg:max-w-[205px] max-md:max-w-none max-sm:max-w-none">
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
            className="absolute right-[12px] max-xl:right-[10px] max-lg:right-[8px] max-md:right-[11px] max-sm:right-[12px] top-[12px] max-xl:top-[10px] max-lg:top-[8px] max-md:top-[11px] max-sm:top-[12px] text-grey04"
          >
            {showPasswordConfirm ? (
              <TbEyeOff
                size={18}
                className="text-[20px] max-xl:text-[17px] max-lg:text-[14px] max-md:text-[16px] max-sm:text-[18px]"
              />
            ) : (
              <TbEye
                size={18}
                className="text-[20px] max-xl:text-[17px] max-lg:text-[14px] max-md:text-[16px] max-sm:text-[18px]"
              />
            )}
          </button>
        </div>
        {touched.passwordConfirm && passwordConfirmError && (
          <ErrorMessage message={passwordConfirmError} />
        )}
      </div>
    </div>
  );
};

export default PasswordInputForm;
