import { useState, useEffect } from 'react';
import AuthInput from '../common/AuthInput';
import ErrorMessage from '../common/ErrorMessage';
import Modal from '../../../../components/Modal';
import useEmailVerification from '../../hooks/useEmailVerification';
import LoadingSpinner from '../../../../components/LoadingSpinner'; // LoadingSpinner 가져오기

type Props = {
  email: string;
  onChangeEmail: (val: string) => void;
  onVerifiedChange?: (verified: boolean) => void;
  mode?: 'signup' | 'reset';
  onResetTokenChange?: (token: string) => void;
};

const EmailVerificationBox = ({
  email,
  onChangeEmail,
  onVerifiedChange,
  mode,
  onResetTokenChange,
}: Props) => {
  const [code, setCode] = useState('');
  const [manualLoading, setManualLoading] = useState(false); // 버튼 로딩 전용
  const {
    emailSent,
    emailVerified,
    errorMessage,
    sendCode,
    verifyCode,
    loading, // useEmailVerification 내부 로딩
  } = useEmailVerification({ email, onVerifiedChange, mode, onResetTokenChange });

  // 이메일이 변경되면 인증번호 입력 초기화
  useEffect(() => {
    setCode('');
  }, [email]);

  const handleSendCode = async () => {
    setManualLoading(true);
    try {
      await sendCode();
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[320px] max-xl:max-w-[274px] max-lg:max-w-[205px] max-md:max-w-[280px] max-sm:w-full">
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
            disabled={!email || manualLoading}
            className={`absolute right-[12px] max-xl:right-[10px] max-lg:right-[8px] max-md:right-[11px] max-sm:right-[12px] top-[12px] max-xl:top-[10px] max-lg:top-[8px] max-md:top-[11px] max-sm:top-[12px] w-[69px] max-xl:w-[59px] max-lg:w-[44px] max-md:w-[54px] max-sm:w-[60px] h-[26px] max-xl:h-[22px] max-lg:h-[17px] max-md:h-[20px] max-sm:h-[22px] rounded-[10px] max-xl:rounded-[9px] max-lg:rounded-[7px] max-md:rounded-[8px] max-sm:rounded-[9px] text-body-4 max-xl:text-body-5 max-lg:text-body-5 max-md:text-body-5 max-sm:text-body-4 transition flex items-center justify-center
              ${!email ? 'bg-grey02 text-grey04' : 'bg-purple04 text-white'}`}
          >
            {manualLoading ? (
              <LoadingSpinner className="h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              '인증'
            )}
          </button>
        )}
      </div>

      {/* 에러 메시지 */}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* 인증번호 입력 (모드와 상관없이 emailSent가 true이면 렌더링) */}
      {emailSent && !emailVerified && (
        <div className="relative mt-[15px] max-xl:mt-[13px] max-lg:mt-[10px] max-md:mt-[12px] max-sm:mt-[14px]">
          <AuthInput
            name="verificationCode"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            onClick={() => verifyCode(code)}
            className="absolute right-[12px] max-xl:right-[10px] max-lg:right-[8px] max-md:right-[11px] max-sm:right-[12px] top-[12px] max-xl:top-[10px] max-lg:top-[8px] max-md:top-[11px] max-sm:top-[12px] w-[69px] max-xl:w-[59px] max-lg:w-[44px] max-md:w-[54px] max-sm:w-[60px] h-[26px] max-xl:h-[22px] max-lg:h-[17px] max-md:h-[20px] max-sm:h-[22px] bg-purple04 text-white text-body-4 max-xl:text-body-5 max-lg:text-body-5 max-md:text-body-5 max-sm:text-body-4 rounded-[10px] max-xl:rounded-[9px] max-lg:rounded-[7px] max-md:rounded-[8px] max-sm:rounded-[9px]"
          >
            확인
          </button>
        </div>
      )}

      {/* 로딩 모달 */}
      {loading && (
        <Modal isOpen={loading} title="인증 메일을 전송 중입니다." onClose={() => {}}>
          <div className="w-full flex justify-center mt-[16px] max-xl:mt-[14px] max-lg:mt-[11px] max-md:mt-[12px] max-sm:mt-[14px]">
            <LoadingSpinner />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmailVerificationBox;
