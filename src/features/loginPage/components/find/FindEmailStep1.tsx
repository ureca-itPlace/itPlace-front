import { useState } from 'react';
import PhoneAuth from '../common/PhoneAuth';
import { sendFindEmailCode } from '../../apis/user';
import { showToast } from '../../../../utils/toast';
import FindToggleTab from '../common/FindToggleTab';
import FindEmailVerificationForm from './FindEmailVerificationForm';
// reCAPTCHA 사용으로 변경

type Props = {
  onSuccess: (email: string, createdAt: string) => void;
  onClickTabPassword: () => void;
  onGoToLogin: () => void;
};

const FindEmailStep1 = ({ onSuccess, onClickTabPassword, onGoToLogin }: Props) => {
  const [step, setStep] = useState('auth'); // auth | verify
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!name.trim() || !phone.trim()) {
      showToast('이름과 전화번호를 모두 입력해주세요.', 'error');
      return;
    }

    if (!recaptchaToken) {
      showToast('reCAPTCHA 인증을 완료해주세요.', 'error');
      return;
    }

    const payload = { name, phoneNumber: phone };
    setLoading(true);
    try {
      await sendFindEmailCode(payload);
      showToast('인증번호가 전송되었습니다.', 'success');
      setStep('verify'); // 인증번호 입력 단계로 전환
    } catch (err) {
      console.error('[인증번호 요청 실패]', err);
      showToast('인증번호 전송에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return <FindEmailVerificationForm name={name} phone={phone} onSuccess={onSuccess} />;
  }

  return (
    <PhoneAuth
      headerSlot={
        <FindToggleTab
          active="email"
          onClickPassword={onClickTabPassword}
          onClickEmail={() => {}}
        />
      }
      name={name}
      phone={phone}
      onChangeName={(e) => setName(e.target.value)}
      onChangePhone={(e) => setPhone(e.target.value)}
      onRecaptchaChange={setRecaptchaToken}
      onSubmit={handleSendCode}
      showCaptcha={true} // 캡챠를 보여주도록 변경
      submitLabel={'인증번호 받기'}
      loading={loading}
      showFooter={true}
      onClickLogin={onGoToLogin}
    />
  );
};

export default FindEmailStep1;
