import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import AuthInput from '../common/AuthInput';
import AuthButton from '../common/AuthButton';
import AuthFooter from '../common/AuthFooter';
import useValidation from '../../hooks/UseValidation';

type SignUpFormProps = {
  nameFromPhoneAuth: string;
  phoneFromPhoneAuth: string;
  birthdayFromPhoneAuth: string;
  genderFromPhoneAuth: string;
  membershipIdFromPhoneAuth: string;
  onGoToLogin: () => void;
  onNext: (data: {
    name: string;
    phone: string;
    birthday: string;
    gender: string;
    membershipId: string;
  }) => void;
  verifiedType?: 'new' | 'uplus' | 'oauth-to-local-merge' | 'local-to-oauth-merge';
};

const SignUpForm = ({
  nameFromPhoneAuth,
  phoneFromPhoneAuth,
  birthdayFromPhoneAuth,
  genderFromPhoneAuth,
  membershipIdFromPhoneAuth,
  onGoToLogin,
  onNext,
  verifiedType = 'new',
}: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    name: nameFromPhoneAuth,
    phone: phoneFromPhoneAuth,
    birth: birthdayFromPhoneAuth || '',
    gender: genderFromPhoneAuth || '',
    membershipNumber: membershipIdFromPhoneAuth || '',
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { validateField } = useValidation();

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const [disabledFields] = useState({
    name: true,
    phone: true,
    birth:
      verifiedType === 'local-to-oauth-merge' ? !!birthdayFromPhoneAuth : !!birthdayFromPhoneAuth,
    gender: verifiedType === 'local-to-oauth-merge' ? !!genderFromPhoneAuth : !!genderFromPhoneAuth,
    membershipNumber: verifiedType === 'local-to-oauth-merge' ? !!membershipIdFromPhoneAuth : true,
  });

  // 입력값 핸들링
  const handleChange = (field: keyof typeof formData, value: string) => {
    // 생년월일 필드인 경우 검증 실행
    if (field === 'birth') {
      validateField('birth', value, {
        email: '',
        password: '',
        passwordConfirm: '',
        birth: value,
      });
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 성별 토글 핸들링
  const handleGenderToggle = (value: 'MALE' | 'FEMALE') => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  // 모든 필드가 입력됐는지 확인
  const isValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.birth.trim() &&
    (formData.gender === 'MALE' || formData.gender === 'FEMALE');

  return (
    <div ref={wrapperRef} className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full text-left mb-[51px] max-xl:mb-[44px] max-lg:mb-[34px] max-md:mb-[40px] max-sm:mb-[40px]">
        <p className="text-title-4 max-xl:text-title-5 max-lg:text-title-6 max-md:text-title-5 max-sm:text-title-5">
          <span className="font-semibold">개인정보</span>를 입력해주세요
        </p>
      </div>

      {/* 이름 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <AuthInput
          name="name"
          placeholder="이름"
          value={formData.name}
          disabled={disabledFields.name}
        />
      </div>

      {/* 휴대폰 번호 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호"
          value={formData.phone}
          disabled={disabledFields.phone}
        />
      </div>

      {/* 생년월일 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <input
          type="date"
          name="birth"
          value={formData.birth}
          onChange={(e) => handleChange('birth', e.target.value)}
          disabled={disabledFields.birth}
          className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] max-md:w-full max-sm:w-full h-[48px] max-xl:h-[41px] max-lg:h-[32px] max-md:h-[48px] max-sm:h-[50px] px-[16px] max-xl:px-[14px] max-lg:px-[11px] max-md:px-[16px] max-sm:px-[16px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[16px] max-sm:rounded-[16px] border border-grey02 text-body-2 max-xl:text-body-3 max-lg:text-body-4 max-md:text-body-3 max-sm:text-body-3 text-grey05"
        />
      </div>

      {/* 성별 */}
      <div className="mb-[20px] max-xl:mb-[17px] max-lg:mb-[13px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center gap-[16px] max-xl:gap-[14px] max-lg:gap-[11px] max-md:gap-[14px] max-sm:gap-[14px]">
        <button
          type="button"
          className={`w-[150px] max-xl:w-[128px] max-lg:w-[96px] max-md:flex-1 max-sm:flex-1 h-[48px] max-xl:h-[41px] max-lg:h-[32px] max-md:h-[46px] max-sm:h-[46px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[16px] max-sm:rounded-[16px] border text-body-2 max-xl:text-body-3 max-lg:text-body-4 max-md:text-body-3 max-sm:text-body-3 transition ${
            formData.gender === 'MALE'
              ? 'bg-purple04 text-white border-purple04'
              : 'bg-white text-grey04 border-grey02'
          }`}
          onClick={() => handleGenderToggle('MALE')}
          disabled={disabledFields.gender}
        >
          남자
        </button>
        <button
          type="button"
          className={`w-[150px] max-xl:w-[128px] max-lg:w-[96px] max-md:flex-1 max-sm:flex-1 h-[48px] max-xl:h-[41px] max-lg:h-[32px] max-md:h-[46px] max-sm:h-[46px] rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] max-md:rounded-[16px] max-sm:rounded-[16px] border text-body-2 max-xl:text-body-3 max-lg:text-body-4 max-md:text-body-3 max-sm:text-body-3 transition ${
            formData.gender === 'FEMALE'
              ? 'bg-purple04 text-white border-purple04'
              : 'bg-white text-grey04 border-grey02'
          }`}
          onClick={() => handleGenderToggle('FEMALE')}
          disabled={disabledFields.gender}
        >
          여자
        </button>
      </div>

      {/* 멤버십 번호 */}
      <div className="mb-[20px] max-md:mb-[16px] max-sm:mb-[16px] w-full flex justify-center">
        <AuthInput
          name="membershipNumber"
          placeholder="U+ 멤버십 번호"
          value={formData.membershipNumber}
          disabled
        />
      </div>

      {/* 다음 버튼 */}
      <AuthButton
        label="다음"
        onClick={() =>
          onNext({
            name: formData.name,
            phone: formData.phone,
            birthday: formData.birth,
            gender: formData.gender,
            membershipId: formData.membershipNumber,
          })
        }
        variant={isValid ? 'default' : 'disabled'}
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

export default SignUpForm;
