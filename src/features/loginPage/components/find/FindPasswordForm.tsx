import { useState } from 'react';
import FindPasswordStep1 from './FindPasswordStep1';
import FindPasswordStep2 from './FindPasswordStep2';
import { sendEmailVerificationCode, checkEmailVerificationCode } from '../../apis/verification';

type Props = {
  onGoToLogin: () => void;
  registrationId: string;
  onClickTabEmail: () => void;
};

const FindPasswordForm = ({ onGoToLogin, registrationId, onClickTabEmail }: Props) => {
  // 현재 단계 상태 ('verify': 이메일 인증 단계, 'reset': 비밀번호 재설정 단계)
  const [step, setStep] = useState<'verify' | 'reset'>('verify');

  // 이메일 인증 관련 상태
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 비밀번호 입력 상태
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 인증번호 요청
  const handleSendCode = async () => {
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

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      await checkEmailVerificationCode(email, verificationCode, registrationId);
      setEmailVerified(true);
      setErrorMessage('');
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

  // 비밀번호 변경
  const handleSubmit = async () => {
    try {
      // 실제 비밀번호 변경 API 연동 필요
      // await resetPassword({ email, password });
      alert('비밀번호가 변경되었습니다.');
      onGoToLogin();
    } catch (err) {
      setErrorMessage('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <>
      {step === 'verify' ? (
        <FindPasswordStep1
          email={email}
          verificationCode={verificationCode}
          onChangeEmail={setEmail}
          onChangeCode={setVerificationCode}
          onSendCode={handleSendCode}
          onVerifyCode={handleVerifyCode}
          emailSent={emailSent}
          emailVerified={emailVerified}
          errorMessage={errorMessage}
          onClickTabEmail={onClickTabEmail}
          onGoNextStep={() => setStep('reset')} // 하단 확인 버튼 → 다음 단계
        />
      ) : (
        <FindPasswordStep2
          password={password}
          passwordConfirm={passwordConfirm}
          onChangePassword={setPassword}
          onChangeConfirm={setPasswordConfirm}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default FindPasswordForm;
