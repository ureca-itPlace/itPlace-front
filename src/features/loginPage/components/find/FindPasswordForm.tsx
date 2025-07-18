import { useState } from 'react';
import FindPasswordStep1 from './FindPasswordStep1';
import FindPasswordStep2 from './FindPasswordStep2';

type Props = {
  onGoToLogin: () => void;
  onClickTabEmail: () => void;
};

const FindPasswordForm = ({ onGoToLogin, onClickTabEmail }: Props) => {
  const [step, setStep] = useState<'verify' | 'reset'>('verify');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [serverError, setServerError] = useState('');

  const handleSubmit = async () => {
    try {
      // 실제 API 연동 필요
      // await resetPassword({ email, password });
      alert('비밀번호가 변경되었습니다.');
      onGoToLogin();
    } catch {
      setServerError('비밀번호 변경에 실패했습니다.');
    }
  };

  return step === 'verify' ? (
    <FindPasswordStep1
      email={email}
      onChangeEmail={setEmail}
      onClickTabEmail={onClickTabEmail}
      onGoNextStep={() => setStep('reset')}
    />
  ) : (
    <FindPasswordStep2
      password={password}
      passwordConfirm={passwordConfirm}
      onChangePassword={setPassword}
      onChangeConfirm={setPasswordConfirm}
      onSubmit={handleSubmit}
      errorMessage={serverError}
    />
  );
};

export default FindPasswordForm;
