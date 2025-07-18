import { useState } from 'react';
import EmailVerificationBox from '../verification/EmailVerificationBox';
import AuthButton from '../common/AuthButton';
import AuthFooter from '../common/AuthFooter';

type Props = {
  email: string;
  onChangeEmail: (val: string) => void;
  onClickTabEmail: () => void;
  onGoNextStep: () => void;
};

const FindPasswordStep1 = ({ email, onChangeEmail, onClickTabEmail, onGoNextStep }: Props) => {
  const [emailVerified, setEmailVerified] = useState(false);

  return (
    <div className="w-[320px] mx-auto flex flex-col items-center">
      {/* 상단 탭 */}
      <div className="relative w-[320px] h-[50px] flex justify-between items-center bg-grey01 rounded-[18px] p-[4px]">
        <button
          className="w-[153px] h-[42px] text-grey05 rounded-[18px] text-title-6"
          onClick={onClickTabEmail}
        >
          아이디 찾기
        </button>
        <button className="w-[153px] h-[42px] bg-white text-purple04 rounded-[18px] text-title-6">
          비밀번호 찾기
        </button>
      </div>

      <p className="text-title-6 text-grey05 mt-[40px]">
        가입한 이메일로 <strong>인증 번호를</strong>전송해드렸어요.
      </p>

      {/* 이메일 인증 */}
      <div className="mt-[20px]">
        <EmailVerificationBox
          email={email}
          onChangeEmail={onChangeEmail}
          onVerifiedChange={setEmailVerified}
        />
      </div>

      {/* 확인 버튼 */}
      <AuthButton
        label="확인"
        onClick={onGoNextStep}
        variant={emailVerified ? 'default' : 'disabled'}
        className="mt-[150px]"
      />

      {/* 로그인 링크 */}
      <div className="mt-[8px] w-full">
        <AuthFooter
          leftText="이미 회원이신가요?"
          rightText="로그인 하러 가기"
          onRightClick={onClickTabEmail}
        />
      </div>
    </div>
  );
};

export default FindPasswordStep1;
