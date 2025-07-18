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
import OAuthIntegrationForm from '../components/signup/OAuthIntegrationForm'; // OAuth 통합 폼

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

  // 사용자 인증 정보
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    registrationId: '',
  });

  // OAuth 통합 사용자 정보
  const [oauthUserData, setOAuthUserData] = useState({
    name: '',
    phone: '',
    registrationId: '',
    birthday: '',
    gender: '',
    membershipId: '',
  });

  // 인증 목적 상태 ('signup' | 'find')
  const [mode, setMode] = useState<'signup' | 'find'>('signup');

  // 비밀번호 찾기 상태 여부
  const [showFindPasswordForm, setShowFindPasswordForm] = useState(false);

  //OAuth 분기점
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

            {/* 인증 및 회원가입 전체 흐름 */}
            {(formStep === 'phoneAuth' ||
              formStep === 'verification' ||
              formStep === 'signUp' ||
              formStep === 'signUpFinal') && (
              <PhoneAuthForm
                mode={mode}
                currentStep={formStep}
                onGoToLogin={goToLogin}
                onAuthComplete={({ name, phone, registrationId }) => {
                  setUserData({ name, phone, registrationId });
                  goToVerification();
                }}
                // 분기점 처리
                onVerified={(verifiedType, user) => {
                  if (verifiedType === 'new' && mode === 'find') {
                    // 전화번호는 없고 mode가 'find'인 경우 → 이메일 찾기
                    goToFindEmail();
                  } else if (verifiedType === 'new' || verifiedType === 'uplus') {
                    // 신규 또는 U+ 멤버십 보유자 → 기본 정보 입력
                    goToSignUp();
                  } else if (verifiedType === 'oauth') {
                    // 기존 OAuth 유저 → OAuth 통합 폼으로
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
                    // 기존 잇플(local) 가입자 → 로그인 유도
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
