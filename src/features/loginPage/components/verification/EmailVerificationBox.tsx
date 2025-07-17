// components/EmailVerificationBox.tsx
import AuthInput from '../common/AuthInput';
import ErrorMessage from '../common/ErrorMessage';

type Props = {
  email: string;
  onChangeEmail: (val: string) => void;
  verificationCode: string;
  onChangeCode: (val: string) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  emailSent: boolean;
  emailVerified: boolean;
  errorMessage?: string;
};

const EmailVerificationBox = ({
  email,
  onChangeEmail,
  verificationCode,
  onChangeCode,
  onSendCode,
  onVerifyCode,
  emailSent,
  emailVerified,
  errorMessage,
}: Props) => {
  return (
    <div className="w-full max-w-[320px]">
      {/* 이메일 입력 필드 */}
      <div className="relative">
        <AuthInput
          name="email"
          value={email}
          placeholder="이메일"
          onChange={(e) => onChangeEmail(e.target.value)}
          disabled={emailVerified}
        />
        {/* 인증 버튼 */}
        {!emailVerified && (
          <button
            type="button"
            onClick={onSendCode}
            disabled={!email}
            className={`absolute right-[12px] top-[12px] w-[69px] h-[26px] rounded-[10px] text-body-4 transition
              ${!email ? 'bg-grey02 text-grey04 cursor-not-allowed' : 'bg-purple04 text-white'}`}
          >
            인증
          </button>
        )}
      </div>

      {/* 이메일 유효성 또는 인증 관련 에러 메시지 */}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* 인증번호 입력 필드 */}
      {emailSent && !emailVerified && (
        <div className="relative mt-[15px]">
          <AuthInput
            name="verificationCode"
            placeholder="인증번호 입력"
            value={verificationCode}
            onChange={(e) => onChangeCode(e.target.value)}
          />
          {/* 인증 확인 버튼 */}
          <button
            type="button"
            onClick={onVerifyCode}
            className="absolute right-[12px] top-[12px] w-[69px] h-[26px] bg-purple04 text-white text-body-4 rounded-[10px]"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationBox;
