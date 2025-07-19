// components/find/FindEmailForm.tsx
import { useState } from 'react';
import FindEmailStep1 from './FindEmailStep1';
import FindEmailStep2 from './FindEmailStep2';

type Props = {
  onGoToLogin: () => void;
  onClickTabPassword: () => void;
};

const FindEmailForm = ({ onGoToLogin, onClickTabPassword }: Props) => {
  const [step, setStep] = useState<'step1' | 'step2'>('step1');
  const [foundEmail, setFoundEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const handleNext = (email: string, created: string) => {
    setFoundEmail(email);
    setCreatedAt(created);
    setStep('step2');
  };

  return step === 'step1' ? (
    <FindEmailStep1
      onSuccess={handleNext}
      onClickTabPassword={onClickTabPassword}
      onGoToLogin={onGoToLogin}
    />
  ) : (
    <FindEmailStep2
      email={foundEmail}
      createdAt={createdAt}
      onClickResetPassword={onClickTabPassword}
      onClickLogin={onGoToLogin}
      onClickTabPassword={onClickTabPassword}
    />
  );
};

export default FindEmailForm;
