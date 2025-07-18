import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoginSuccess } from '../../../../store/authSlice';
import { showToast } from '../../../../utils/toast';
import { login } from '../../apis/auth';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import AuthLinkRow from '../common/AuthLinkRow';
import AuthDivider from '../common/AuthDivider';
import KakaoLoginButton from './KakaoLoginButton';
import { useNavigate } from 'react-router-dom';

type Props = {
  onGoToPhoneAuth: () => void;
  onGoToFindEmail: () => void;
};

const LoginForm = ({ onGoToPhoneAuth, onGoToFindEmail }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      const { code, data } = response.data;

      if (code === 'LOGIN_SUCCESS') {
        dispatch(setLoginSuccess(data));
        navigate('/');
      } else {
        showToast('로그인에 실패하셨습니다.', 'error');
      }
    } catch (error) {
      showToast('로그인에 실패하셨습니다.', 'error');
    }
  };

  const handleKakaoLogin = () => {
    const kakaoLoginUrl = `http://3.34.79.67/oauth2/authorization/kakao`;
    window.location.href = kakaoLoginUrl;
  };

  return (
    <div>
      <h2 className="text-title-1 mb-[40px]">로그인</h2>

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
        <KakaoLoginButton onClick={handleKakaoLogin} />
      </div>
    </div>
  );
};

export default LoginForm;
