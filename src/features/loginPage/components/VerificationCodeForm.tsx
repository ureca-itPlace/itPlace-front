import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AuthInput from './AuthInput';
import AuthFooter from './AuthFooter';
import AuthButton from './AuthButton';
import { TbClock } from 'react-icons/tb';

type Props = {
  onGoToLogin: () => void;
};

const VerificationCodeForm = ({ onGoToLogin }: Props) => {
  const [code, setCode] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const handleResend = () => {
    console.log('인증번호 재발송');
  };

  return (
    <div ref={wrapperRef} className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="text-left w-[320px]">
        <p className="text-title-4">
          보내드린 <span className="font-semibold">인증번호 6자리</span>를
        </p>
        <p className="text-title-4">입력해주세요</p>
      </div>

      {/* 인증번호 입력 */}
      <AuthInput
        name="code"
        placeholder="인증번호"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mt-[48px]"
      />

      {/* 타이머 + 안내 텍스트 */}
      <div className="text-body-3 text-grey03 mt-[20px] w-[320px] flex items-center gap-[4px]">
        <TbClock size={16} className="text-grey03" />
        <span>남은 시간</span>
        <span className="text-danger font-medium">2:58</span>
      </div>

      <div className="text-body-3 text-grey03 mt-[13px] w-[320px]">
        인증 번호를 받지 못하셨나요?{' '}
        <span onClick={handleResend} className="text-purple04 font-medium cursor-pointer">
          다시 보내기
        </span>
      </div>

      {/* 다음 버튼 */}
      <AuthButton
        label="다음"
        onClick={() => console.log('다음으로')}
        variant={code ? 'default' : 'disabled'}
        className="mt-[180px]"
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

export default VerificationCodeForm;
