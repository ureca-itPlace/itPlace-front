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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const handleNext = () => {
    // 🔹 실제 API 연동 전까지 임시 데이터
    setFoundEmail(`${name}@itple.com`);
    setCreatedAt('2025.07.10');
    setStep('step2');
  };

  return step === 'step1' ? (
    <FindEmailStep1
      name={name}
      phone={phone}
      onChangeName={setName}
      onChangePhone={setPhone}
      onClickNext={handleNext}
      onClickTabPassword={onClickTabPassword}
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
