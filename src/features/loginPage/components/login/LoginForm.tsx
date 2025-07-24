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
        showToast('로그인에 성공하셨습니다!', 'success');
        navigate('/main');
      } else {
        showToast('로그인에 실패하셨습니다.', 'error');
      }
    } catch {
      showToast('로그인에 실패하셨습니다.', 'error');
    }
  };

  const handleKakaoLogin = () => {
    console.log('🟡 카카오 로그인 버튼 클릭');

    const kakaoLoginUrl = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    console.log('🟡 카카오 인증 URL로 이동:', kakaoLoginUrl);
    window.location.href = kakaoLoginUrl;
  };

  return (
    <div>
      <h2 className="text-title-1 max-xl:text-title-2 max-lg:text-title-3 max-md:text-title-3 max-sm:text-title-2 mb-[40px] max-xl:mb-[34px] max-lg:mb-[27px] max-md:mb-[30px] max-sm:mb-[32px]">
        로그인
      </h2>

      <div className="flex flex-col gap-0 w-full items-center">
        {/* 이메일 입력 */}
        <div className="mb-[20px] max-md:mb-[18px] max-sm:mb-[16px] w-full">
          <AuthInput
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-[40px] max-md:mb-[36px] max-sm:mb-[32px] w-full">
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
