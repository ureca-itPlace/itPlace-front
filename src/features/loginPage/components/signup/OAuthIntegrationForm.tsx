import { useState } from 'react';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import AuthFooter from '../common/AuthFooter';

type OAuthIntegrationFormProps = {
  name: string;
  phone: string;
  birthday: string;
  gender: string; // 'MALE' | 'FEMALE'
  membershipId: string;
  onGoToLogin: () => void;
  onNext: (data: { birthday: string; gender: string }) => void; // 다음 단계로 넘어가기
  isOAuthNew?: boolean; // oauth-new일 때 생년월일/성별 입력 가능
};

const OAuthIntegrationForm = ({
  name,
  phone,
  birthday: initialBirthday,
  gender: initialGender,
  membershipId,
  onGoToLogin,
  onNext,
  isOAuthNew = false,
}: OAuthIntegrationFormProps) => {
  const [birthday, setBirthday] = useState(initialBirthday);
  const [gender, setGender] = useState(initialGender);

  console.log('🟡 OAuthIntegrationForm props:', { isOAuthNew, birthday, gender });

  return (
    <div className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full text-left mb-[51px] max-xl:mb-[44px] max-lg:mb-[34px] max-md:mb-[30px] max-sm:mb-[30px]">
        <p className="text-title-4 max-xl:text-title-5 max-lg:text-title-6 max-md:text-title-7 max-sm:text-title-7">
          <span className="font-semibold">연동된 정보를</span> 확인해주세요
        </p>
      </div>

      {/* 이름 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <AuthInput name="name" placeholder="이름" value={name} disabled />
      </div>

      {/* 휴대폰 번호 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <AuthInput name="phone" placeholder="휴대폰 번호" value={phone} disabled />
      </div>

      {/* 생년월일 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <input
          type="date"
          name="birth"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          disabled={!isOAuthNew}
          className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full h-[48px] max-xl:h-[41px] max-lg:h-[32px] max-md:h-[46px] max-sm:h-[46px] px-[16px] max-xl:px-[14px] max-lg:px-[11px] max-md:px-[16px] max-sm:px-[16px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[16px] max-sm:rounded-[16px] border border-grey02 text-body-2 max-md:text-body-3 max-sm:text-body-3 text-grey05"
        />
      </div>

      {/* 성별 */}
      <div className="mb-[20px] max-xl:mb-[17px] max-lg:mb-[13px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center gap-[16px] max-xl:gap-[14px] max-lg:gap-[11px] max-md:gap-[14px] max-sm:gap-[14px]">
        <button
          type="button"
          onClick={() => setGender('MALE')}
          className={`w-[150px] max-xl:w-[128px] max-lg:w-[96px] max-md:flex-1 max-sm:flex-1 h-[48px] max-xl:h-[41px] max-lg:h-[32px] max-md:h-[46px] max-sm:h-[46px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[16px] max-sm:rounded-[16px] border text-body-2 max-md:text-body-3 max-sm:text-body-3 transition ${
            gender === 'MALE'
              ? 'bg-purple04 text-white border-purple04'
              : 'bg-white text-grey04 border-grey02'
          }`}
          disabled={!isOAuthNew}
        >
          남자
        </button>
        <button
          type="button"
          onClick={() => setGender('FEMALE')}
          className={`w-[150px] max-xl:w-[128px] max-lg:w-[96px] max-md:flex-1 max-sm:flex-1 h-[48px] max-xl:h-[41px] max-lg:h-[32px] max-md:h-[46px] max-sm:h-[46px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[16px] max-sm:rounded-[16px] border text-body-2 max-md:text-body-3 max-sm:text-body-3 transition ${
            gender === 'FEMALE'
              ? 'bg-purple04 text-white border-purple04'
              : 'bg-white text-grey04 border-grey02'
          }`}
          disabled={!isOAuthNew}
        >
          여자
        </button>
      </div>

      {/* 멤버십 번호 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <AuthInput
          name="membershipNumber"
          placeholder="U+ 멤버십 번호"
          value={membershipId}
          disabled
        />
      </div>

      {/* 가입하기 버튼 */}
      <AuthButton
        label="가입하기"
        onClick={() => onNext({ birthday, gender })}
        variant="default"
        className=""
      />

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
