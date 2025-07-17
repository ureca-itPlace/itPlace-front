import { useState } from 'react';

// 공통 컴포넌트
import AuthFormCard from '../components/AuthFormCard';
import AuthSideCard from '../components/AuthSideCard';

// 폼 컴포넌트
import LoginForm from '../components/LoginForm';
import PhoneAuthForm from '../components/PhoneAuthForm';
import FindEmailForm from '../components/FindEmailForm';
import FindPasswordForm from '../components/FindPasswordForm';

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
  } = AuthTransition();

  // 사용자 인증 정보
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    registrationId: '',
  });

  // 인증 목적 상태 ('signup' | 'find')
  const [mode, setMode] = useState<'signup' | 'find'>('signup');

  // 비밀번호 찾기 상태 여부
  const [showFindPasswordForm, setShowFindPasswordForm] = useState(false);

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
                  goToPhoneAuth(); // 인증 후 이메일 찾기로 이동
                }}
              />
            )}

            {/* 인증 및 회원가입 흐름 */}
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
                onVerified={(verifiedType) => {
                  if (verifiedType === 'new' && mode === 'find') {
                    goToFindEmail();
                  } else if (verifiedType === 'new' || verifiedType === 'uplus') {
                    goToSignUp();
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
