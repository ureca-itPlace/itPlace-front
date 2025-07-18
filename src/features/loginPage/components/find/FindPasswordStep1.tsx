import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import EmailVerificationBox from '../verification/EmailVerificationBox';
import AuthButton from '../common/AuthButton';
import AuthFooter from '../common/AuthFooter';
import { sendFindPasswordEmail } from '../../apis/user';
import { showToast } from '../../../../utils/toast'; // 토스트가 이미 있다면 사용

type Props = {
  email: string;
  onChangeEmail: (val: string) => void;
  onClickTabEmail: () => void;
  onGoNextStep: (resetToken: string) => void;
};

const FindPasswordStep1 = ({ email, onChangeEmail, onClickTabEmail, onGoNextStep }: Props) => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const handleSubmit = async () => {
    if (!emailVerified) return;

    setLoading(true);
    try {
      await sendFindPasswordEmail(email);
      showToast('비밀번호 재설정 이메일이 전송되었습니다.', 'success');

      // resetToken이 있을 때만 호출하도록 수정
      if (resetToken) {
        onGoNextStep(resetToken); // resetToken을 다음 단계로 넘김
      } else {
        console.error('resetToken이 비어있습니다.');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="w-[320px] mx-auto flex flex-col items-center">
      {/* 상단 탭 */}
      <div className="relative w-[320px] h-[50px] flex justify-between items-center bg-grey01 rounded-[18px] p-[4px]">
        <button
          className="w-[153px] h-[42px] text-grey05 rounded-[18px] text-title-6"
          onClick={onClickTabEmail}
        >
          아이디 찾기
        </button>
        <button className="w-[153px] h-[42px] bg-white text-purple04 rounded-[18px] text-title-6">
          비밀번호 찾기
        </button>
      </div>

      <p className="text-title-6 text-grey05 mt-[40px]">
        인증을 위해 <strong>가입된 이메일을</strong> 입력해주세요.
      </p>

      {/* 이메일 인증 */}
      <div className="mt-[20px]">
        <EmailVerificationBox
          email={email}
          onChangeEmail={onChangeEmail}
          onVerifiedChange={setEmailVerified}
          mode="reset"
          onResetTokenChange={setResetToken}
        />
      </div>

      {/* 확인 버튼 */}
      <AuthButton
        label={loading ? '처리 중...' : '확인'}
        onClick={handleSubmit}
        variant={emailVerified ? 'default' : 'disabled'}
        className="mt-[150px]"
      />

      {/* 로그인 링크 */}
      <div className="mt-[8px] w-full">
        <AuthFooter
          leftText="이미 회원이신가요?"
          rightText="로그인 하러 가기"
          onRightClick={onClickTabEmail}
        />
      </div>
    </div>
  );
};

export default FindPasswordStep1;
