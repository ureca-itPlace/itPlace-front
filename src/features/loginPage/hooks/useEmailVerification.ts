import { useEffect, useState } from 'react';
import { sendEmailVerificationCode, checkEmailVerificationCode } from '../apis/verification';
import { showToast } from '../../../utils/toast';

type UseEmailVerificationProps = {
  email: string;
  registrationId: string;
  onVerifiedChange?: (verified: boolean) => void;
};

const useEmailVerification = ({
  email,
  registrationId,
  onVerifiedChange,
}: UseEmailVerificationProps) => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 인증번호 전송 요청
  const sendCode = async () => {
    if (!email) return;

    try {
      setLoading(true); // ✅ 스피너용 상태 true
      await sendEmailVerificationCode({ email, registrationId });
      setEmailSent(true);
      setErrorMessage('');

      // ✅ 성공 시 토스트 추가
      showToast('입력하신 이메일로 인증 번호가 전송되었습니다!', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || '인증번호 요청에 실패했습니다.';
      setErrorMessage(msg);
      setEmailSent(false);
    } finally {
      setLoading(false); // ✅ 로딩 종료
    }
  };

  // 인증번호 확인 요청
  const verifyCode = async (code: string) => {
    if (!code.trim()) {
      const msg = '인증번호를 입력해주세요.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      await checkEmailVerificationCode(email, code, registrationId);
      setEmailVerified(true);
      setErrorMessage('');
      showToast('이메일 인증이 완료되었습니다.', 'success');
    } catch (err: any) {
      const errorCode = err?.response?.data?.code;
      let msg = '인증에 실패했습니다.';

      if (errorCode === 'EMAIL_CODE_MISMATCH') {
        msg = '인증번호가 일치하지 않습니다.';
      } else if (errorCode === 'EMAIL_CODE_EXPIRED') {
        msg = '인증번호가 만료되었습니다.';
      }

      setErrorMessage(msg);
      showToast(msg, 'error');
      setEmailVerified(false);
    }
  };

  useEffect(() => {
    if (onVerifiedChange) {
      onVerifiedChange(emailVerified);
    }
  }, [emailVerified, onVerifiedChange]);

  return {
    emailSent,
    emailVerified,
    errorMessage,
    sendCode,
    verifyCode,
    loading,
  };
};

export default useEmailVerification;
