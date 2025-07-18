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
    setFormStep,
    formCardRef,
    sideCardRef,
    goToLogin,
    goToPhoneAuth,
    goToVerification,
    goToSignUp,
    goToSignUpFinal,
    goToFindEmail,
  } = AuthTransition();

  const location = useLocation();

  const [mode, setMode] = useState<'signup' | 'find'>('signup');
  const [showTab, setShowTab] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    phone: '',
  });

  const [oauthUserData, setOAuthUserData] = useState({
    name: '',
    phone: '',
    birthday: '',
    gender: '',
    membershipId: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get('step');
    const verifiedType = params.get('verifiedType');

    if (step === 'phoneAuth' && verifiedType === 'oauth') {
      setMode('signup');
      setShowTab(false);
      goToPhoneAuth();
    }

    if (step === 'oauthIntegration' && verifiedType === 'oauth') {
      setOAuthUserData({
        name: params.get('name') || '',
        phone: params.get('phone') || '',
        birthday: params.get('birthday') || '',
        gender: params.get('gender') || '',
        membershipId: params.get('membershipId') || '',
      });
      setFormStep('oauthIntegration');
    }
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-full max-w-[1400px] h-[700px] overflow-hidden mx-auto">
        {/* 좌측 카드 */}
        <div
          ref={formCardRef}
          className="absolute top-1/2 translate-y-[-50%] w-[583px] h-[639px]"
          style={{ left: 'calc(50% - 520px)' }}
        >
          <AuthFormCard radius={formStep === 'login' ? 'left' : 'right'}>
            {/* 로그인 */}
            {formStep === 'login' && (
              <LoginForm
                onGoToPhoneAuth={() => {
                  setMode('signup');
                  setShowTab(false);
                  goToPhoneAuth();
                }}
                onGoToFindEmail={() => {
                  setMode('find');
                  setShowTab(true);
                  setFormStep('findEmail');
                }}
              />
            )}

            {/* 인증 / 회원가입 / 아이디/비번 찾기 진입 */}
            {(formStep === 'phoneAuth' ||
              formStep === 'verification' ||
              formStep === 'signUp' ||
              formStep === 'signUpFinal') && (
              <PhoneAuthForm
                mode={mode}
                title={mode === 'find' ? '' : '번호 인증을 위한\n개인 정보를 입력해주세요'}
                currentStep={formStep}
                showTab={showTab}
                onGoToLogin={goToLogin}
                onAuthComplete={({ name, phone }) => {
                  setUserData({ name, phone });
                  goToVerification();
                }}
                onVerified={(verifiedType, user) => {
                  if (verifiedType === 'new' && mode === 'find') {
                    setFormStep('findEmail');
                  } else if (verifiedType === 'new' || verifiedType === 'uplus') {
                    goToSignUp();
                  } else if (verifiedType === 'oauth') {
                    setOAuthUserData({
                      name: user.name,
                      phone: user.phone,
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
              />
            )}

            {/* OAuth 통합 */}
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

            {/* 아이디 찾기 */}
            {formStep === 'findEmail' && (
              <FindEmailForm
                onGoToLogin={goToLogin}
                onClickTabPassword={() => setFormStep('findPassword')}
              />
            )}

            {/* 비밀번호 찾기 */}
            {formStep === 'findPassword' && (
              <FindPasswordForm
                onGoToLogin={() => setFormStep('login')}
                onClickTabEmail={() => setFormStep('findEmail')}
              />
            )}
          </AuthFormCard>
        </div>

        {/* 우측 카드 */}
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
