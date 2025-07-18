import { useEffect, useState } from 'react';
import { sendEmailVerificationCode, checkEmailVerificationCode } from '../apis/verification';
import { showToast } from '../../../utils/toast';
type UseEmailVerificationProps = {
  email: string;
  registrationId: string;
  onVerifiedChange?: (verified: boolean) => void; // 인증 상태 변경 시 부모에게 알림
};

const useEmailVerification = ({
  email,
  registrationId,
  onVerifiedChange,
}: UseEmailVerificationProps) => {
  // 인증번호 전송 여부
  const [emailSent, setEmailSent] = useState(false);

  // 인증 완료 여부
  const [emailVerified, setEmailVerified] = useState(false);

  // 에러 메시지 (전송 실패 또는 인증 실패 등)
  const [errorMessage, setErrorMessage] = useState('');

  // 인증번호 전송 요청
  const sendCode = async () => {
    if (!email) return;

    try {
      await sendEmailVerificationCode({ email, registrationId });
      setEmailSent(true);
      setErrorMessage('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || '인증번호 요청에 실패했습니다.';
      setErrorMessage(msg);
      setEmailSent(false);
    }
  };

  // 인증번호 확인 요청
  const verifyCode = async (code: string) => {
    if (!code.trim()) {
      setErrorMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      await checkEmailVerificationCode(email, code, registrationId);
      setEmailVerified(true);
      setErrorMessage('');
      showToast('이메일 인증이 완료되었습니다.', 'success'); // 이 부분 추가
    } catch (err: any) {
      const errorCode = err?.response?.data?.code;
      if (errorCode === 'EMAIL_CODE_MISMATCH') {
        setErrorMessage('인증번호가 일치하지 않습니다.');
      } else if (errorCode === 'EMAIL_CODE_EXPIRED') {
        setErrorMessage('인증번호가 만료되었습니다.');
      } else {
        setErrorMessage('인증에 실패했습니다.');
      }
      setEmailVerified(false);
    }
  };

  // 인증 완료 상태가 바뀔 때 외부로 전달
  useEffect(() => {
    if (onVerifiedChange) {
      onVerifiedChange(emailVerified);
    }
  }, [emailVerified, onVerifiedChange]);

  return {
    emailSent, // 인증번호 전송 여부
    emailVerified, // 인증 완료 여부
    errorMessage, // 에러 메시지
    sendCode, // 인증번호 전송 함수
    verifyCode, // 인증번호 확인 함수
  };
};

export default useEmailVerification;
