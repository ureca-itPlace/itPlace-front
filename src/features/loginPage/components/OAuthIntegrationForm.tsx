import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFooter from './AuthFooter';

type OAuthIntegrationFormProps = {
  name: string;
  phone: string;
  birthday: string;
  gender: string; // 'MALE' | 'FEMALE'
  membershipId: string;
  onGoToLogin: () => void;
  onNext: () => void; // 다음 단계로 넘어가기
};

const OAuthIntegrationForm = ({
  name,
  phone,
  birthday,
  gender,
  membershipId,
  onGoToLogin,
  onNext,
}: OAuthIntegrationFormProps) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="w-[320px] text-left mb-[51px]">
        <p className="text-title-4">
          <span className="font-semibold">연동된 정보를</span> 확인해주세요
        </p>
      </div>

      {/* 이름 */}
      <div className="mb-[20px] w-full flex justify-center">
        <AuthInput name="name" placeholder="이름" value={name} disabled />
      </div>

      {/* 휴대폰 번호 */}
      <div className="mb-[20px] w-full flex justify-center">
        <AuthInput name="phone" placeholder="휴대폰 번호" value={phone} disabled />
      </div>

      {/* 생년월일 */}
      <div className="mb-[20px] w-full flex justify-center">
        <input
          type="date"
          name="birth"
          value={birthday}
          disabled
          className="w-[320px] h-[48px] px-[16px] rounded-[18px] border border-grey02 text-body-2 text-grey05"
        />
      </div>

      {/* 성별 */}
      <div className="mb-[20px] w-full flex justify-center gap-[16px]">
        <button
          type="button"
          className={`w-[150px] h-[48px] rounded-[18px] border text-body-2 transition ${
            gender === 'MALE'
              ? 'bg-purple04 text-white border-purple04'
              : 'bg-white text-grey04 border-grey02'
          }`}
          disabled
        >
          남자
        </button>
        <button
          type="button"
          className={`w-[150px] h-[48px] rounded-[18px] border text-body-2 transition ${
            gender === 'FEMALE'
              ? 'bg-purple04 text-white border-purple04'
              : 'bg-white text-grey04 border-grey02'
          }`}
          disabled
        >
          여자
        </button>
      </div>

      {/* 멤버십 번호 */}
      <div className="mb-[20px] w-full flex justify-center">
        <AuthInput
          name="membershipNumber"
          placeholder="U+ 멤버십 번호"
          value={membershipId}
          disabled
        />
      </div>

      {/* 가입하기 버튼 */}
      <AuthButton label="가입하기" onClick={onNext} variant="default" className="w-[320px]" />

      {/* 하단 링크 */}
      <AuthFooter
        leftText="이미 회원이신가요?"
        rightText="로그인 하러 가기"
        onRightClick={onGoToLogin}
      />
    </div>
  );
};

export default OAuthIntegrationForm;
