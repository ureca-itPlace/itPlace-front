import { useState } from 'react';

// 공통 컴포넌트
import AuthFormCard from '../components/AuthFormCard';
import AuthSideCard from '../components/AuthSideCard';

// 폼 컴포넌트
import LoginForm from '../components/LoginForm';
import PhoneAuthForm from '../components/PhoneAuthForm';
import FindEmailForm from '../components/FindEmailForm';

// 상태 전환 관련 훅
import { AuthTransition } from '../hooks/AuthTransition';

const AuthLayout = () => {
  // 상태 및 애니메이션 위치 ref
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

  // 이름, 전화번호 저장
  const [userData, setUserData] = useState({ name: '', phone: '' });

  // 현재 인증 목적 ('signup' | 'find')
  const [mode, setMode] = useState<'signup' | 'find'>('signup');

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-full max-w-[1400px] h-[700px] overflow-hidden mx-auto">
        {/* 좌측 Form 카드 */}
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
                  goToPhoneAuth(); // 이제 findEmail로 바로 가지 않고 인증부터
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
                onAuthComplete={({ name, phone }) => {
                  setUserData({ name, phone });
                  goToVerification();
                }}
                onVerified={() => {
                  if (mode === 'find') {
                    goToFindEmail();
                  } else {
                    goToSignUp();
                  }
                }}
                onSignUpComplete={goToSignUpFinal}
                nameFromPhoneAuth={userData.name}
                phoneFromPhoneAuth={userData.phone}
              />
            )}

            {/* 이메일 찾기 완료 화면 */}
            {formStep === 'findEmail' && (
              <FindEmailForm
                email={userData.name + '@itple.com'} // 예시용 가짜 이메일
                createdAt="2025.07.10"
                onClickResetPassword={() => {
                  console.log('비밀번호 재설정 클릭됨');
                }}
                onClickLogin={goToLogin}
              />
            )}
          </AuthFormCard>
        </div>

        {/* 우측 Side 카드 */}
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
