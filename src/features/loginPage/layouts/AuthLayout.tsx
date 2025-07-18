import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 공통 컴포넌트
import AuthFormCard from '../components/common/AuthFormCard';
import AuthSideCard from '../components/common/AuthSideCard';

// 폼 컴포넌트
import LoginForm from '../components/login/LoginForm';
import PhoneAuthForm from '../components/verification/PhoneAuthForm';
import FindEmailForm from '../components/find/FindEmailForm';
import FindPasswordForm from '../components/find/FindPasswordForm';
import OAuthIntegrationForm from '../components/signup/OAuthIntegrationForm';

// 상태 전환 관련 훅
import { AuthTransition } from '../hooks/AuthTransition';

const AuthLayout = () => {
  const {
    formStep,
    formCardRef,
    sideCardRef,
    goToLogin,
    goToPhoneAuth,
    goToVerification,
    goToSignUp,
    goToSignUpFinal,
    goToFindEmail,
    setFormStep,
  } = AuthTransition();

  const location = useLocation();

  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    registrationId: '',
  });

  const [oauthUserData, setOAuthUserData] = useState({
    name: '',
    phone: '',
    registrationId: '',
    birthday: '',
    gender: '',
    membershipId: '',
  });

  const [mode, setMode] = useState<'signup' | 'find'>('signup');
  const [showFindPasswordForm, setShowFindPasswordForm] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get('step');
    const verifiedType = params.get('verifiedType');

    if (step === 'phoneAuth' && verifiedType === 'oauth') {
      setMode('signup');
      goToPhoneAuth();
    }

    if (step === 'oauthIntegration' && verifiedType === 'oauth') {
      setOAuthUserData({
        name: params.get('name') || '',
        phone: params.get('phone') || '',
        birthday: params.get('birthday') || '',
        gender: params.get('gender') || '',
        membershipId: params.get('membershipId') || '',
        registrationId: params.get('registrationId') || '',
      });
      setFormStep('oauthIntegration');
    }
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-full max-w-[1400px] h-[700px] overflow-hidden mx-auto">
        {/* 좌측 폼 카드 */}
        <div
          ref={formCardRef}
          className="absolute top-1/2 translate-y-[-50%] w-[583px] h-[639px]"
          style={{ left: 'calc(50% - 520px)' }}
        >
          <AuthFormCard radius={formStep === 'login' ? 'left' : 'right'}>
            {/* 로그인 화면 */}
            {formStep === 'login' && (
              <LoginForm
                onGoToPhoneAuth={() => {
                  setMode('signup');
                  goToPhoneAuth();
                }}
                onGoToFindEmail={() => {
                  setMode('find');
                  goToPhoneAuth();
                }}
              />
            )}

            {/* 인증 및 회원가입 흐름 전체 */}
            {['phoneAuth', 'verification', 'signUp', 'signUpFinal'].includes(formStep) && (
              <PhoneAuthForm
                mode={mode}
                currentStep={formStep as 'phoneAuth' | 'verification' | 'signUp' | 'signUpFinal'}
                onGoToLogin={goToLogin}
                onAuthComplete={({ name, phone, registrationId }) => {
                  setUserData({ name, phone, registrationId });
                  goToVerification();
                }}
                onVerified={(verifiedType, user) => {
                  if (verifiedType === 'new' && mode === 'find') {
                    goToFindEmail();
                  } else if (verifiedType === 'new' || verifiedType === 'uplus') {
                    goToSignUp();
                  } else if (verifiedType === 'oauth') {
                    setOAuthUserData({
                      name: user.name,
                      phone: user.phone,
                      registrationId: user.registrationId,
                      birthday: user.birthday,
                      gender: user.gender,
                      membershipId: user.membershipId,
                    });
                    setFormStep('oauthIntegration');
                  } else {
                    goToLogin();
                  }
                }}
                onSignUpComplete={goToSignUpFinal}
                nameFromPhoneAuth={userData.name}
                phoneFromPhoneAuth={userData.phone}
                registrationIdFromPhoneAuth={userData.registrationId}
              />
            )}

            {/* OAuth 통합 정보 확인 화면 */}
            {formStep === 'oauthIntegration' && (
              <OAuthIntegrationForm
                name={oauthUserData.name}
                phone={oauthUserData.phone}
                birthday={oauthUserData.birthday}
                gender={oauthUserData.gender}
                membershipId={oauthUserData.membershipId}
                onGoToLogin={goToLogin}
                onNext={goToSignUpFinal}
              />
            )}

            {/* 이메일 찾기 화면 */}
            {!showFindPasswordForm && formStep === 'findEmail' && (
              <FindEmailForm
                email={userData.name + '@itple.com'}
                createdAt="2025.07.10"
                onClickResetPassword={() => {
                  goToFindEmail();
                  setShowFindPasswordForm(true);
                }}
                onClickLogin={goToLogin}
                onClickTabPassword={() => {
                  setShowFindPasswordForm(true);
                }}
              />
            )}

            {/* 비밀번호 찾기 화면 */}
            {showFindPasswordForm && (
              <FindPasswordForm
                onGoToLogin={() => {
                  setShowFindPasswordForm(false);
                  goToLogin();
                }}
                registrationId={userData.registrationId}
                onClickTabEmail={() => {
                  setShowFindPasswordForm(false);
                  goToFindEmail();
                }}
              />
            )}
          </AuthFormCard>
        </div>

        {/* 우측 사이드 카드 */}
        <div
          ref={sideCardRef}
          className="absolute top-1/2 translate-y-[-50%] w-[431px] h-[639px] z-0"
          style={{ left: 'calc(50% + 30.5px)' }}
        >
          <AuthSideCard />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
