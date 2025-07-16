import { useState } from 'react';
import AuthFormCard from '../components/AuthFormCard';
import AuthSideCard from '../components/AuthSideCard';
import LoginForm from '../components/LoginForm';
import PhoneAuthForm from '../components/PhoneAuthForm';
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
  } = AuthTransition();

  const [userData, setUserData] = useState({ name: '', phone: '' });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-full max-w-[1400px] h-[700px] overflow-hidden mx-auto">
        {/* Form 카드 */}
        <div
          ref={formCardRef}
          className="absolute top-1/2 translate-y-[-50%] w-[583px] h-[639px]"
          style={{ left: 'calc(50% - 520px)' }}
        >
          <AuthFormCard radius={formStep === 'login' ? 'left' : 'right'}>
            {formStep === 'login' && (
              <LoginForm onGoToPhoneAuth={goToPhoneAuth} onGoToFindEmail={() => {}} />
            )}

            {(formStep === 'phoneAuth' ||
              formStep === 'verification' ||
              formStep === 'signUp' ||
              formStep === 'signUpFinal') && (
              <PhoneAuthForm
                onGoToLogin={goToLogin}
                currentStep={formStep}
                onAuthComplete={({ name, phone }) => {
                  setUserData({ name, phone });
                  goToVerification();
                }}
                onVerified={goToSignUp}
                onSignUpComplete={goToSignUpFinal}
                nameFromPhoneAuth={userData.name}
                phoneFromPhoneAuth={userData.phone}
              />
            )}
          </AuthFormCard>
        </div>

        {/* Side 카드 */}
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
