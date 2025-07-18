import { useState, useEffect } from 'react';
import AuthInput from '../common/AuthInput';
import ErrorMessage from '../common/ErrorMessage';
import Modal from '../../../../components/Modal';
import useEmailVerification from '../../hooks/useEmailVerification';

type Props = {
  email: string;
  onChangeEmail: (val: string) => void;
  onVerifiedChange?: (verified: boolean) => void;
};

const EmailVerificationBox = ({ email, onChangeEmail, onVerifiedChange }: Props) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { emailSent, emailVerified, errorMessage, sendCode, verifyCode } = useEmailVerification({
    email,
    onVerifiedChange,
  });

  // 이메일이 변경되면 인증번호 입력 초기화
  useEffect(() => {
    setCode('');
  }, [email]);

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await sendCode();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[320px]">
      {/* 이메일 입력 */}
      <div className="relative">
        <AuthInput
          name="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          disabled={emailVerified}
        />
        {!emailVerified && (
          <button
            type="button"
            onClick={handleSendCode}
            disabled={!email}
            className={`absolute right-[12px] top-[12px] w-[69px] h-[26px] rounded-[10px] text-body-4 transition
              ${!email ? 'bg-grey02 text-grey04' : 'bg-purple04 text-white'}`}
          >
            인증
          </button>
        )}
      </div>

      {/* 에러 메시지 */}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* 인증번호 입력 */}
      {emailSent && !emailVerified && (
        <div className="relative mt-[15px]">
          <AuthInput
            name="verificationCode"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            onClick={() => verifyCode(code)}
            className="absolute right-[12px] top-[12px] w-[69px] h-[26px] bg-purple04 text-white text-body-4 rounded-[10px]"
          >
            확인
          </button>
        </div>
      )}

      {/* 로딩 모달 */}
      {loading && (
        <Modal
          isOpen={loading}
          title="인증 메일을 전송 중입니다."
          onClose={() => setLoading(false)}
        >
          <div className="w-full flex justify-center mt-[16px]">
            <div className="w-[32px] h-[32px] border-4 border-purple04 border-t-transparent rounded-full animate-spin" />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmailVerificationBox;
