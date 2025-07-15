import { useState } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <h2 className="text-title-3 font-bold mb-[8px]">로그인</h2>
      <AuthInput
        name="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthInput
        name="password"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthButton label="로그인" onClick={() => {}} />
    </>
  );
};

export default LoginForm;
