import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import EmailVerificationBox from '../verification/EmailVerificationBox';
import AuthButton from '../common/AuthButton';
import AuthFooter from '../common/AuthFooter';
import ToggleTab from '../common/FindToggleTab';
import { showToast } from '../../../../utils/toast';

type Props = {
  email: string;
  onChangeEmail: (val: string) => void;
  onClickTabEmail: () => void;
  onGoToLogin: () => void;
  onGoNextStep: (resetToken: string) => void;
};

const FindPasswordStep1 = ({
  email,
  onChangeEmail,
  onClickTabEmail,
  onGoToLogin,
  onGoNextStep,
}: Props) => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const handleVerificationComplete = (verified: boolean) => {
    setEmailVerified(verified);
    if (verified) {
      showToast('이메일 인증이 완료되었습니다.', 'success');
    }
  };

  const handleNextClick = () => {
    if (emailVerified && resetToken) {
      onGoNextStep(resetToken);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] mx-auto flex flex-col items-center"
    >
      <ToggleTab active="password" onClickEmail={onClickTabEmail} onClickPassword={() => {}} />

      <p className="text-title-6 max-xl:text-title-7 max-lg:text-title-8 text-grey05 mt-[40px] max-xl:mt-[34px] max-lg:mt-[27px]">
        인증을 위해 <strong>가입된 이메일을</strong> 입력해주세요.
      </p>

      <div className="mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px]">
        <EmailVerificationBox
          email={email}
          onChangeEmail={onChangeEmail}
          onVerifiedChange={handleVerificationComplete}
          mode="reset"
          onResetTokenChange={setResetToken}
        />
      </div>

      <AuthButton
        label="다음"
        onClick={handleNextClick}
        variant={emailVerified && resetToken ? 'default' : 'disabled'}
        className="mt-[150px]"
      />

      <div className="mt-[8px] w-full">
        <AuthFooter
          leftText="이미 회원이신가요?"
          rightText="로그인 하러 가기"
          onRightClick={onGoToLogin} // 로그인 페이지로 이동하도록 수정
        />
      </div>
    </div>
  );
};

export default FindPasswordStep1;
