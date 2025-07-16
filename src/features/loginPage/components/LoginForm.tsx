import { useState } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthLinkRow from './AuthLinkRow';
import AuthDivider from './AuthDivider';
import KakaoLoginButton from './KakaoLoginButton';
import { login } from '../apis/auth';

type Props = {
  onGoToPhoneAuth: () => void;
  onGoToFindEmail: () => void;
};

const LoginForm = ({ onGoToPhoneAuth, onGoToFindEmail }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      console.log('로그인 요청 중...');
      const response = await login(email, password); //바인딩된 axios API 호출
      console.log('로그인 성공:', response.data);
      // 로그인 성공 후 토큰 저장, 라우팅 등 처리
    } catch (error) {
      console.error('로그인 실패:', error);
      // 사용자에게 실패 알림 표시
    }
  };

  return (
    <div>
      <h2 className="text-title-1 font-bold mb-[40px]">로그인</h2>

      <div className="flex flex-col gap-0 w-full items-center">
        {/* 이메일 입력 */}
        <div className="mb-[20px]">
          <AuthInput
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-[40px]">
          <AuthInput
            name="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 로그인 버튼 */}
        <AuthButton label="로그인" onClick={handleLogin} />

        <AuthLinkRow onGoToPhoneAuth={onGoToPhoneAuth} onGoToFindEmail={onGoToFindEmail} />
        <AuthDivider />

        <KakaoLoginButton
          onClick={() => {
            console.log('카카오 로그인 클릭됨');
            // TODO: 카카오 로그인 연동 예정
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm;
