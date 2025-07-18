import { useState, useEffect, useRef } from 'react';
import { AxiosError } from 'axios';
import gsap from 'gsap';
import Modal from '../../../../components/Modal';
import { showToast } from '../../../../utils/toast';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import ErrorMessage from '../common/ErrorMessage';
import EmailVerificationBox from '../verification/EmailVerificationBox';
import AuthFooter from '../common/AuthFooter';
import { TbEye, TbEyeOff } from 'react-icons/tb';
import useValidation from '../../hooks/UseValidation';
import { signUpFinal } from '../../apis/user';

type SignUpFinalFormProps = {
  onGoToLogin: () => void;
  name: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  membershipId: string;
};

const SignUpFinalForm = ({
  onGoToLogin,
  name,
  phoneNumber,
  birthday,
  gender,
  membershipId,
}: SignUpFinalFormProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

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

  const [emailVerified, setEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    title: '',
    loading: false,
  });

  const { errors, validateAll, validateField } = useValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (name === 'email' || name === 'password' || name === 'passwordConfirm') {
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name as 'email' | 'password' | 'passwordConfirm', value, updated);
    }
  };

  const handleNext = async () => {
    const valid = validateAll(formData);
    if (valid && emailVerified) {
      try {
        const payload = {
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

        if (response.status === 200 && response.data.code === 'SIGNUP_SUCCESS') {
          // 회원가입 성공 처리
          showToast('회원가입이 완료되었습니다. 로그인 해주세요.', 'success');

          // 0ms 지연으로 goToLogin 트리거 (애니메이션 렌더 충돌 방지)
          setTimeout(() => {
            onGoToLogin();
          }, 0);
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ code: string; message: string }>;
        const res = axiosError.response?.data;
        let message = '회원가입에 실패했습니다. 다시 시도해주세요.';

        if (res) {
          switch (res.code) {
            case 'PASSWORD_MISMATCH':
              message = '비밀번호가 일치하지 않습니다.';
              break;
            case 'DUPLICATE_EMAIL':
              message = '이미 사용 중인 이메일입니다.';
              break;
            default:
              message = res.message || message;
          }
        }

        showToast(message, 'error');

        // 인증 상태 및 입력 초기화
        setFormData({
          email: '',
          password: '',
          passwordConfirm: '',
        });
        setTouched({
          email: false,
          password: false,
          passwordConfirm: false,
        });
        setEmailVerified(false);
      }
    }
  };

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
    <div ref={wrapperRef} className="w-full flex flex-col items-center">
      {/* 제목 안내 */}
      <div className="w-[320px] text-left">
        <p className="text-title-4">개인정보를 입력해주세요</p>
      </div>

      {/* 이메일 인증 */}
      <div className="w-full max-w-[320px] mt-[51px]">
        <EmailVerificationBox
          email={formData.email} // email 값을 formData에서 가져옴
          onChangeEmail={(val) => {
            setFormData((prev) => ({
              ...prev,
              email: val,
            }));
          }} // 직접 email만 업데이트
          onVerifiedChange={setEmailVerified}
          mode="signup"
        />
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

      {/* 모달 */}
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
