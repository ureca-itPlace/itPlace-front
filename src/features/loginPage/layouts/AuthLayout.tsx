import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { getOAuthResult, oauthAccountLink } from '../apis/auth';

// 상태 전환 관련 훅
import { AuthTransition } from '../hooks/AuthTransition';
import { useDispatch } from 'react-redux';
import { setLoginSuccess } from '../../../store/authSlice';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Modal from '../../../components/Modal';

const AuthLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    birthday: '',
    gender: '',
    membershipId: '',
    verifiedType: '',
  });

  const [oauthUserData, setOAuthUserData] = useState({
    name: '',
    phone: '',
    birthday: '',
    gender: '',
    membershipId: '',
    verifiedType: '',
  });

  const [showOAuthModal, setShowOAuthModal] = useState(false);

  const hasInitialized = useRef(false);

  const checkOAuthResult = useCallback(async () => {
    try {
      console.log('🟡 OAuth 결과 확인 중...');

      // 최소 1초는 모달을 표시하기 위해 Promise.all 사용
      const [response] = await Promise.all([
        getOAuthResult(),
        new Promise((resolve) => setTimeout(resolve, 1000)), // 1초 대기
      ]);

      const { code, data } = response.data;

      console.log('🟢 OAuth 결과:', response.data);

      if (code === 'OAUTH_INFO_FOUND') {
        const userData = data;
        if (userData) {
          dispatch(
            setLoginSuccess({
              name: userData.name,
              membershipGrade: userData.membershipGrade || 'NORMAL',
            })
          );
          console.log('🟢 Redux에 OAuth 로그인 정보 저장 완료:', userData);
        }

        showToast('로그인에 성공하셨습니다!', 'success');

        // URL에서 oauth 파라미터 제거
        window.history.replaceState({}, '', '/login');

        navigate('/main');
      } else if (code === 'PRE_AUTHENTICATION_SUCCESS') {
        console.log('🟡 추가 정보 입력 필요 → PhoneAuthForm으로 이동');

        // URL에서 oauth 파라미터 제거
        window.history.replaceState({}, '', '/login?step=phoneAuth&verifiedType=oauth');

        setMode('signup');
        setShowTab(false);
        goToPhoneAuth();
      } else {
        showToast('로그인에 실패했습니다.', 'error');

        // URL에서 oauth 파라미터 제거
        window.history.replaceState({}, '', '/login');
      }
    } catch (error) {
      console.error('🔴 OAuth 결과 확인 실패:', error);
      showToast('로그인에 실패했습니다.', 'error');

      // URL에서 oauth 파라미터 제거
      window.history.replaceState({}, '', '/login');
    } finally {
      setShowOAuthModal(false);
    }
  }, [dispatch, navigate, goToPhoneAuth, setMode, setShowTab]);

  const handleOAuthToLocalMerge = async (phoneNumber: string) => {
    try {
      console.log('🟡 OAuth → 로컬 계정 통합 시작:', phoneNumber);
      const response = await oauthAccountLink(phoneNumber);

      console.log('🟢 계정 통합 성공:', response.data);
      showToast('계정이 성공적으로 통합되었습니다!', 'success');

      // 통합 완료 후 로그인 성공 처리 (필요시)
      if (response.data?.data) {
        const userData = response.data.data;
        dispatch(
          setLoginSuccess({
            name: userData.name,
            membershipGrade: userData.membershipGrade || 'NORMAL',
          })
        );
        navigate('/main');
      } else {
        // 통합만 완료, 로그인은 별도로
        showToast('이제 카카오 로그인을 사용하실 수 있습니다!', 'success');
        goToLogin();
      }
    } catch (error) {
      console.error('🔴 계정 통합 실패:', error);
      showToast('계정 통합에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get('step');
    const verifiedType = params.get('verifiedType');
    const oauth = params.get('oauth');

    console.log('🟡 AuthLayout useEffect 실행:', { step, verifiedType, oauth, showOAuthModal });
    console.log('🟡 현재 URL:', location.search);

    // OAuth 처리 중 파라미터가 있으면 모달 표시하고 결과 확인
    if (oauth === 'processing' && !showOAuthModal) {
      console.log('🟡 OAuth 모달 표시 조건 충족');
      setShowOAuthModal(true);
      checkOAuthResult();
      return;
    }

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
  }, [location.search, goToPhoneAuth, setFormStep, formStep, checkOAuthResult, showOAuthModal]);

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

      const response = await oauthSignUp(payload);

      // 회원가입 성공 후 반환된 사용자 정보 확인
      console.log('🟢 OAuth 회원가입 성공:', response.data);

      // 회원가입 성공 - 로그인 화면으로 이동
      showToast('회원가입에 성공하셨습니다!', 'success');
      sessionStorage.setItem('resetToLogin', 'true');
      setFormStep('login');

      // 상태 초기화
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

  console.log('🟡 AuthLayout 렌더링:', { showOAuthModal });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* OAuth 로딩 모달 */}
      <Modal
        isOpen={showOAuthModal}
        onClose={() => {}} // 사용자가 직접 닫을 수 없도록 빈 함수
      >
        <div className="flex flex-col items-center py-4">
          <LoadingSpinner />
          <p className="mt-4 text-body-2 text-grey04">카카오 로그인 처리 중입니다...</p>
        </div>
      </Modal>

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
                    setUserData({
                      name,
                      phone,
                      birthday: '',
                      gender: '',
                      membershipId: '',
                      verifiedType: '',
                    });
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
                      } else if (verifiedType === 'oauth-to-local-merge') {
                        // OAuth → 로컬 통합: 바로 계정 연결 API 호출
                        handleOAuthToLocalMerge(user.phone);
                      } else if (verifiedType === 'local-to-oauth-merge') {
                        // 로컬 → OAuth 통합: 회원가입 폼으로 이동
                        setUserData({
                          name: user.name,
                          phone: user.phone,
                          birthday: user.birthday,
                          gender: user.gender,
                          membershipId: user.membershipId,
                          verifiedType: verifiedType,
                        });
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
