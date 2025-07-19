import { useState } from 'react';
import PhoneAuth from '../common/PhoneAuth';
import { sendFindEmailCode } from '../../apis/user';
import { showToast } from '../../../../utils/toast';
import ToggleTab from '../common/FindToggleTab';
import FindEmailVerificationForm from './FindEmailVerificationForm';
import { validateCaptcha } from 'react-simple-captcha';

type Props = {
  onSuccess: (email: string, createdAt: string) => void;
  onClickTabPassword: () => void;
};

const FindEmailStep1 = ({ onSuccess, onClickTabPassword }: Props) => {
  const [step, setStep] = useState('auth'); // auth | verify
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!name.trim() || !phone.trim()) {
      showToast('이름과 전화번호를 모두 입력해주세요.', 'error');
      return;
    }

    if (!validateCaptcha(userCaptchaInput)) {
      showToast('보안문자가 일치하지 않습니다.', 'error');
      return;
    }

    const payload = { name, phoneNumber: phone };
    setLoading(true);
    try {
      await sendFindEmailCode(payload);
      showToast('인증번호가 전송되었습니다.', 'success');
      setStep('verify'); // 인증번호 입력 단계로 전환
    } catch (err) {
      console.error('[❌ 인증번호 요청 실패]', err);
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
      headerSlot={<ToggleTab active="email" onClickPassword={onClickTabPassword} />}
      name={name}
      phone={phone}
      captcha={userCaptchaInput}
      onChangeName={setName}
      onChangePhone={setPhone}
      onChangeCaptcha={setUserCaptchaInput}
      onSubmit={handleSendCode}
      showCaptcha={true} // 캡챠를 보여주도록 변경
      submitLabel={'인증번호 받기'}
      loading={loading}
    />
  );
};

export default FindEmailStep1;
