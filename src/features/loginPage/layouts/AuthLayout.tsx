import AuthFormCard from '../components/AuthFormCard';
import AuthSideCard from '../components/AuthSideCard';
import LoginForm from '../components/LoginForm';
import PhoneAuthForm from '../components/PhoneAuthForm';
import { AuthTransition } from '../hooks/AuthTransition';

const AuthLayout = () => {
  const { formStep, formCardRef, sideCardRef, goToPhoneAuth, goToLogin } = AuthTransition();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* 슬라이드 영역 + 중앙 배치 */}
      <div className="relative w-full max-w-[1400px] h-[700px] overflow-hidden mx-auto">
        {/* Form 카드 Swap */}
        <div
          ref={formCardRef}
          className="absolute top-1/2 translate-y-[-50%] w-[583px] h-[639px]"
          style={{ left: 'calc(50% - 520px)' }} // 중앙 기준 왼쪽 배치
        >
          <AuthFormCard radius={formStep === 'login' ? 'left' : 'right'}>
            {formStep === 'login' ? (
              <LoginForm onGoToPhoneAuth={goToPhoneAuth} onGoToFindEmail={() => {}} />
            ) : (
              <PhoneAuthForm onGoToLogin={goToLogin} />
            )}
          </AuthFormCard>
        </div>

        {/* Side 카드 */}
        <div
          ref={sideCardRef}
          className="absolute top-1/2 translate-y-[-50%] w-[431px] h-[639px] z-0"
          style={{ left: 'calc(50% + 30.5px)' }} // 중앙 기준 오른쪽 배치
        >
          <AuthSideCard />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
