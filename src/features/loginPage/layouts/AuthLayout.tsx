import AuthFormCard from '../components/AuthFormCard';
import AuthSideCard from '../components/AuthSideCard';
import LoginForm from '../components/LoginForm';
import PhoneAuthForm from '../components/PhoneAuthForm';
import { AuthTransition } from '../hooks/AuthTransition';

const AuthLayout = () => {
  const { formStep, goToPhoneAuth, goToLogin, formCardRef, sideCardRef } = AuthTransition();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-[1014px] h-[639px] flex items-center justify-between">
        {/* 왼쪽: 로그인 카드 */}
        <div
          ref={formCardRef}
          className="w-[583px] h-full translate-x-[30.5px] transition-transform"
        >
          <AuthFormCard radius="left">
            {formStep === 'login' ? (
              <LoginForm
                onGoToPhoneAuth={goToPhoneAuth}
                onGoToFindEmail={() => {
                  // TODO: 아이디/비밀번호 찾기 이동 함수
                }}
              />
            ) : (
              <PhoneAuthForm onGoToLogin={goToLogin} />
            )}
          </AuthFormCard>
        </div>

        {/* 오른쪽: 사이드 카드 */}
        <div
          ref={sideCardRef}
          className="w-[431px] h-full -translate-x-[30.5px] transition-transform z-"
        >
          <AuthSideCard />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
