import { useState } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthLinkRow from './AuthLinkRow';
import AuthDivider from './AuthDivider';
import KakaoLoginButton from './KakaoLoginButton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <h2 className="text-title-1 font-bold mb-[40px]">로그인</h2>

      <div className="flex flex-col gap-0 w-full items-center">
        <div className="mb-[20px]">
          <AuthInput
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disableFocusEffect={false}
          />
        </div>

        <div className="mb-[40px]">
          <AuthInput
            name="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disableFocusEffect={false}
          />
        </div>

        <AuthButton label="로그인" onClick={() => {}} />

        {/* 아래 링크 */}
        <AuthLinkRow />

        {/* 구분선 */}
        <AuthDivider />

        <KakaoLoginButton
          onClick={() => {
            console.log('카카오 로그인 클릭됨');
          }}
        />
      </div>
    </>
  );
};

export default LoginForm;
