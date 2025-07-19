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
  const [resetToken, setResetToken] = useState('');

  return step === 'verify' ? (
    <FindPasswordStep1
      email={email}
      onChangeEmail={setEmail}
      onClickTabEmail={onClickTabEmail}
      onGoToLogin={onGoToLogin}
      onGoNextStep={(token) => {
        setResetToken(token);
        setStep('reset');
      }}
    />
  ) : (
    <FindPasswordStep2 onGoToLogin={onGoToLogin} resetPasswordToken={resetToken} email={email} />
  );
};

export default FindPasswordForm;
