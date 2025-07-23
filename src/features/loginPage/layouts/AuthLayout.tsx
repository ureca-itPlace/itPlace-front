import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';

// 공통 컴포넌트
import AuthFormCard from '../components/common/AuthFormCard';
import AuthSideCard from '../components/common/AuthSideCard';
import { showToast } from '../../../utils/toast';

// 폼 컴포넌트
import LoginForm from '../components/login/LoginForm';
import PhoneAuthForm from '../components/verification/PhoneAuthForm';
import FindEmailForm from '../components/find/FindEmailForm';
import FindPasswordForm from '../components/find/FindPasswordForm';
import OAuthIntegrationForm from '../components/signup/OAuthIntegrationForm';

// API
import { oauthSignUp } from '../apis/user';

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
    verifiedType: '',
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get('step');
    const verifiedType = params.get('verifiedType');

    // OAuth 관련 URL 파라미터가 있을 때만 처리
    // 일반적인 로그인 리셋은 별도 useEffect에서 처리

    if (hasInitialized.current) return; // 이미 초기화했으면 실행하지 않음

    if (step === 'phoneAuth' && verifiedType === 'oauth') {
      setMode('signup');
      setShowTab(false);
      goToPhoneAuth();
      hasInitialized.current = true; // 초기화 완료 표시
    }

    if (step === 'oauthIntegration' && verifiedType === 'oauth') {
      setOAuthUserData({
        name: params.get('name') || '',
        phone: params.get('phone') || '',
        birthday: params.get('birthday') || '',
        gender: params.get('gender') || '',
        membershipId: params.get('membershipId') || '',
        verifiedType: verifiedType || '', // verifiedType 추가
      });
      setFormStep('oauthIntegration');
      hasInitialized.current = true; // 초기화 완료 표시
    }
  }, [location.search, goToPhoneAuth, setFormStep, formStep]);

  // sessionStorage 플래그를 통한 로그인 리셋 처리
  useEffect(() => {
    const shouldReset = sessionStorage.getItem('resetToLogin');
    if (shouldReset && formStep !== 'login') {
      console.log('🟡 AuthLayout: sessionStorage 플래그 감지 - 로그인으로 리셋');
      sessionStorage.removeItem('resetToLogin');
      setMode('signup');
      setShowTab(false);
      hasInitialized.current = false;
      goToLogin();
    }
  }, [formStep, goToLogin]);

  useEffect(() => {
    console.log('🟡 AuthLayout: 현재 formStep =', formStep);
  }, [formStep]);

  const handleOAuthSignup = async (birthday: string, gender: string) => {
    try {
      const payload = {
        name: oauthUserData.name,
        phoneNumber: oauthUserData.phone,
        gender,
        birthday,
        membershipId: oauthUserData.membershipId,
      };

      console.log('🟡 최종 payload 확인:', payload);

      await oauthSignUp(payload); // ✅ 새로운 API로 전송

      showToast('회원가입이 완료되었습니다. 로그인 해주세요.', 'success');

      sessionStorage.setItem('resetToLogin', 'true');
      setFormStep('login');

      setOAuthUserData({
        name: '',
        phone: '',
        birthday: '',
        gender: '',
        membershipId: '',
        verifiedType: '',
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      console.error('🔴 OAuth 회원가입 실패:', axiosError);

      const msg =
        axiosError.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';

      showToast(msg, 'error');
    }
  };

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
            <>
              {/* 로그인 */}
              {formStep === 'login' && (
                <LoginForm
                  onGoToPhoneAuth={() => {
                    console.log('🟡 AuthLayout: "계정이 없으신가요?" 클릭');
                    setMode('signup');
                    setShowTab(false);
                    goToPhoneAuth();
                  }}
                  onGoToFindEmail={() => {
                    console.log('🟡 AuthLayout: "아이디/비밀번호 찾기" 클릭');
                    setMode('find');
                    setShowTab(true);
                    goToFindEmail();
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
                    console.log('🟡 AuthLayout: onAuthComplete 호출됨', { name, phone });
                    setUserData({ name, phone });
                    console.log('🟡 AuthLayout: goToVerification() 호출');
                    goToVerification();
                  }}
                  onVerified={(verifiedType, user) => {
                    const urlParams = new URLSearchParams(location.search);
                    const isOAuthFlow = urlParams.get('verifiedType') === 'oauth';

                    console.log('🟡 AuthLayout: onVerified 첫 번째 파라미터:', verifiedType);
                    console.log('🟡 AuthLayout: onVerified 두 번째 파라미터:', user);
                    console.log('🟡 AuthLayout: onVerified 호출됨', {
                      verifiedType,
                      user,
                      isOAuthFlow,
                    });

                    if (isOAuthFlow || verifiedType === 'oauth-new') {
                      // OAuth 플로우는 모든 경우에 OAuthIntegrationForm으로
                      console.log('🟢 AuthLayout: OAuth 플로우 - OAuthIntegrationForm으로 이동');
                      setOAuthUserData({
                        name: user.name,
                        phone: user.phone,
                        birthday: user.birthday,
                        gender: user.gender,
                        membershipId: user.membershipId,
                        verifiedType: verifiedType,
                      });
                      setFormStep('oauthIntegration');
                    } else {
                      // 일반 플로우는 기존 분기 로직 유지
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
                          verifiedType: verifiedType,
                        });
                        setFormStep('oauthIntegration');
                      } else {
                        goToLogin();
                      }
                    }
                  }}
                  onSignUpComplete={goToSignUpFinal}
                  nameFromPhoneAuth={userData.name}
                  phoneFromPhoneAuth={userData.phone}
                />
              )}

              {/* OAuth 통합 */}
              {formStep === 'oauthIntegration' && (
                <>
                  <OAuthIntegrationForm
                    name={oauthUserData.name}
                    phone={oauthUserData.phone}
                    birthday={oauthUserData.birthday}
                    gender={oauthUserData.gender}
                    membershipId={oauthUserData.membershipId}
                    onGoToLogin={goToLogin}
                    onNext={({ birthday, gender }) => {
                      handleOAuthSignup(birthday, gender);
                    }}
                    isOAuthNew={oauthUserData.verifiedType === 'oauth-new'}
                  />
                </>
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
                  onGoToLogin={goToLogin}
                  onClickTabEmail={() => setFormStep('findEmail')}
                />
              )}
            </>
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
