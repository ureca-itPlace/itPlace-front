import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { kakaoOAuthLogin } from '../apis/auth';

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      console.log('🟡 카카오 콜백 처리 시작');
      console.log('🟡 받은 파라미터:', { code, error });

      if (error) {
        console.error('🔴 카카오 인증 에러:', error);
        navigate('/login');
        return;
      }

      if (!code) {
        console.error('🔴 인증 코드가 없습니다.');
        navigate('/login');
        return;
      }

      try {
        console.log('🟡 백엔드로 인증 코드 전송 중...');
        const response = await kakaoOAuthLogin(code);
        const { code: responseCode } = response.data;

        console.log('🟢 백엔드 응답:', response.data);
        console.log('🟢 응답 코드:', responseCode);

        if (responseCode === 'PRE_AUTHENTICATION_SUCCESS') {
          console.log('🟡 추가 정보 입력 필요 → PhoneAuthForm으로 이동');
          navigate('/login?step=phoneAuth&verifiedType=oauth');
        } else if (responseCode === 'LOGIN_SUCCESS') {
          console.log('🟢 로그인 성공 → 메인 페이지로 이동');
          // TODO: 로그인 성공 처리 (Redux 상태 업데이트 등)
          navigate('/main');
        } else {
          console.log('🟡 알 수 없는 응답 → 로그인 페이지로 이동');
          navigate('/login');
        }
      } catch (error) {
        console.error('🔴 카카오 로그인 처리 실패:', error);
        navigate('/login');
      }
    };

    handleKakaoCallback();
  }, [navigate, searchParams]);

  return <div>카카오 로그인 처리 중입니다...</div>;
};

export default OAuthRedirectHandler;
