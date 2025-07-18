import { useState } from 'react';
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
  // 사용자 입력 상태
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  // 입력 필드 터치 여부
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  });

  // 이메일 인증 성공 여부
  const [emailVerified, setEmailVerified] = useState(false);

  // 비밀번호 보기 토글 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 모달 상태
  const [modal, setModal] = useState({
    open: false,
    title: '',
    loading: false,
  });

  // 유효성 검사 훅
  const { errors, validateAll, validateField } = useValidation();

  // 입력 필드 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (name === 'email' || name === 'password' || name === 'passwordConfirm') {
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name as 'email' | 'password' | 'passwordConfirm', value, updated);
    }
  };

  // 회원가입 요청
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

        if (response.status === 201 && response.data.code === 'SIGNUP_SUCCESS') {
          showToast('회원가입이 완료되었습니다. 로그인 해주세요.', 'success');
          onGoToLogin(); // 로그인 화면으로 이동
        }
      } catch (error: any) {
        const res = error?.response?.data;
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

        // ✅ 입력값 초기화
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
      {/* 제목 안내 문구 */}
      <div className="w-[320px] text-left">
        <p className="text-title-4">개인정보를 입력해주세요</p>
      </div>

      {/* 이메일 인증 영역 */}
      <div className="w-full max-w-[320px] mt-[51px]">
        <EmailVerificationBox
          email={formData.email}
          onChangeEmail={(val) =>
            handleChange({
              target: { name: 'email', value: val },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          registrationId={registrationId}
          onVerifiedChange={setEmailVerified}
        />
      </div>

      {/* 비밀번호 입력 필드 */}
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

      {/* 비밀번호 확인 필드 */}
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
