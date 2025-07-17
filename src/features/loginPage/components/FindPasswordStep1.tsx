import { useState } from 'react';
import Modal from '../../../components/Modal';
import EmailVerificationBox from './EmailVerificationBox';
import AuthButton from './AuthButton';
import AuthFooter from './AuthFooter';

type Props = {
  email: string;
  verificationCode: string;
  onChangeEmail: (val: string) => void;
  onChangeCode: (val: string) => void;
  onSendCode: () => Promise<void>;
  onVerifyCode: () => Promise<void>;
  emailSent: boolean;
  emailVerified: boolean;
  errorMessage?: string;
  onClickTabEmail: () => void;
  onGoNextStep: () => void;
};

const FindPasswordStep1 = ({
  email,
  verificationCode,
  onChangeEmail,
  onChangeCode,
  onSendCode,
  onVerifyCode,
  emailSent,
  emailVerified,
  errorMessage,
  onClickTabEmail,
  onGoNextStep,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  // 인증 요청 버튼 클릭 시 로딩 모달을 띄우고 이메일 전송 요청
  const handleSendCodeClick = async () => {
    setModalOpen(true);
    try {
      await onSendCode();
    } finally {
      setModalOpen(false);
    }
  };

  // 인증번호 확인 버튼 클릭 시 인증 확인 요청
  const handleVerifyCodeClick = async () => {
    try {
      await onVerifyCode();
    } catch {
      // 실패 시 errorMessage는 상위에서 처리
    }
  };

  return (
    <div className="w-[320px] mx-auto flex flex-col items-center">
      {/* 상단 탭 버튼 영역 */}
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

      {/* 설명 문구 */}
      <p className="text-title-6 text-grey05 mt-[40px]">
        가입한 이메일로 <strong>전송 받은 링크</strong>를 통해 새 비밀번호를 등록해주세요.
      </p>

      {/* 이메일 인증 입력 영역 */}
      <div className="mt-[20px]">
        <EmailVerificationBox
          email={email}
          onChangeEmail={onChangeEmail}
          verificationCode={verificationCode}
          onChangeCode={onChangeCode}
          onSendCode={handleSendCodeClick}
          onVerifyCode={handleVerifyCodeClick}
          emailSent={emailSent}
          emailVerified={emailVerified}
          errorMessage={errorMessage}
        />
      </div>

      {/* 하단 확인 버튼 (인증 완료 시 활성화) */}
      <AuthButton
        label="확인"
        onClick={onGoNextStep}
        variant={emailVerified ? 'default' : 'disabled'}
        className="mt-[150px]"
      />

      {/* 로그인 이동 링크 */}
      <div className="mt-[8px] w-full">
        <AuthFooter
          leftText="이미 회원이신가요?"
          rightText="로그인 하러 가기"
          onRightClick={onClickTabEmail}
        />
      </div>

      {/* 이메일 전송 로딩 모달 */}
      <Modal
        isOpen={modalOpen}
        title="인증 메일을 전송 중입니다."
        onClose={() => setModalOpen(false)}
      >
        <div className="w-full flex justify-center mt-[16px]">
          <div className="w-[32px] h-[32px] border-4 border-purple04 border-t-transparent rounded-full animate-spin" />
        </div>
      </Modal>
    </div>
  );
};

export default FindPasswordStep1;
