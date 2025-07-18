import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isNewUser = searchParams.get('isNewUser') === 'true';
    const hasLocalAccount = searchParams.get('hasLocalAccount') === 'true';
    const token = searchParams.get('token');
    const code = searchParams.get('code');
    const registrationId = searchParams.get('registrationId');
    const user = {
      name: searchParams.get('name') ?? '',
      phone: searchParams.get('phone') ?? '',
      birthday: searchParams.get('birthday') ?? '',
      gender: searchParams.get('gender') ?? '',
      membershipId: searchParams.get('membershipId') ?? '',
    };

    if (code === 'SIGNUP_REQUIRED' && registrationId) {
      console.log('🆕 신규 OAuth 유저, itPlace 계정 없음 → 전화번호 인증으로 이동');
      navigate(`/login?step=phoneAuth&verifiedType=oauth&registrationId=${registrationId}`);
      return;
    }

    if (!isNewUser && token) {
      console.log(' 기존 OAuth 유저 로그인 성공, 토큰 저장 후 메인 이동');
      localStorage.setItem('accessToken', token);
      navigate('/');
      return;
    }

    if (isNewUser && hasLocalAccount) {
      console.log('🟡 신규 OAuth 유저 + itPlace 계정 있음 → 통합 폼 이동');
      const query = new URLSearchParams({
        step: 'oauthIntegration',
        verifiedType: 'oauth',
        name: user.name,
        phone: user.phone,
        birthday: user.birthday,
        gender: user.gender,
        membershipId: user.membershipId,
        registrationId: registrationId ?? '',
      }).toString();
      navigate(`/login?${query}`);
      return;
    }

    navigate('/login');
  }, [navigate, searchParams]);

  return <div>카카오 로그인 처리 중입니다...</div>;
};

export default OAuthRedirectHandler;
