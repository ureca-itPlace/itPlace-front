import { useState, useEffect } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import CaptchaBox from './CaptchaBox';
import AuthLinkLogin from './AuthLinkLogin';

type Props = {
  onGoToLogin: () => void;
};

const generateRandomText = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const PhoneAuthForm = ({ onGoToLogin }: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');

  useEffect(() => {
    setCaptchaText(generateRandomText());
  }, []);

  const isValid = name && phone && userCaptchaInput;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="w-[320px] text-left">
        <p className="text-title-4">번호 인증을 위한</p>
        <p className="text-title-4">개인 정보를 입력해주세요</p>
      </div>

      {/* 이름 입력 */}
      <div className="mt-[20px]">
        <AuthInput
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* 휴대폰 번호 입력 */}
      <div className="mt-[20px]">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* 캡차 박스 */}
      <div className="mt-[20px]">
        <CaptchaBox
          captchaText={captchaText}
          onRefresh={() => setCaptchaText(generateRandomText())}
        />
      </div>

      {/* 캡차 입력 */}
      <div className="mt-[20px]">
        <AuthInput
          name="captcha"
          placeholder="보안문자 입력"
          value={userCaptchaInput}
          onChange={(e) => setUserCaptchaInput(e.target.value)}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-[20px]">
        <AuthButton
          label="다음"
          onClick={() => {
            // 다음 단계로 넘어가는 로직
          }}
          variant={isValid ? 'default' : 'disabled'}
        />
      </div>

      {/* 하단 링크 */}
      <AuthLinkLogin onClick={onGoToLogin} />
    </div>
  );
};

export default PhoneAuthForm;
