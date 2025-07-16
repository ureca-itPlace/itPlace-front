import React from 'react';
import AuthSideCard from '../components/AuthSideCard';
import AuthFormCard from '../components/AuthFormCard';
import FindEmailForm from '../components/FindEmailForm';

const TestFindEmailLayout = () => {
  const handleResetPassword = () => {
    alert('비밀번호 재설정으로 이동');
  };

  const handleGoLogin = () => {
    alert('로그인 화면으로 이동');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-[900px] h-[600px] flex shadow-md rounded-[20px] overflow-hidden">
        {/* 좌측 사이드 카드 */}
        <AuthSideCard />

        {/* 우측 Form 카드 */}
        <AuthFormCard>
          <FindEmailForm
            email="example@itple.com"
            createdAt="2024-01-01"
            onClickResetPassword={handleResetPassword}
            onClickLogin={handleGoLogin}
          />
        </AuthFormCard>
      </div>
    </div>
  );
};

export default TestFindEmailLayout;
