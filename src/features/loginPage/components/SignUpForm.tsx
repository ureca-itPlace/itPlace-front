import { useEffect, useState } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFooter from './AuthFooter';
import { getUserInfo } from '../apis/user';

type SignUpFormProps = {
  nameFromPhoneAuth: string;
  phoneFromPhoneAuth: string;
  onGoToLogin: () => void;
  onNext: (data: {
    name: string;
    phone: string;
    birthday: string;
    gender: string;
    membershipId: string;
  }) => void;
};

const SignUpForm = ({
  nameFromPhoneAuth,
  phoneFromPhoneAuth,
  onGoToLogin,
  onNext,
}: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birth: '',
    gender: '', // 'MALE' 또는 'FEMALE'
    membershipNumber: '',
  });

  const [disabledFields, setDisabledFields] = useState({
    name: true,
    phone: true,
    birth: false,
    gender: false,
    membershipNumber: true,
  });

  // API 호출하여 기존 회원 정보 병합
  useEffect(() => {
    getUserInfo()
      .then((res) => {
        const data = res.data;

        setFormData({
          name: data.name || nameFromPhoneAuth,
          phone: data.phone || phoneFromPhoneAuth,
          birth: data.birth || '',
          gender: data.gender || '',
          membershipNumber: data.membershipNumber || '',
        });

        setDisabledFields({
          name: true,
          phone: true,
          birth: !!data.birth,
          gender: !!data.gender,
          membershipNumber: true,
        });
      })
      .catch(() => {
        // 실패 시 인증값만 사용
        setFormData({
          name: nameFromPhoneAuth,
          phone: phoneFromPhoneAuth,
          birth: '',
          gender: '',
          membershipNumber: '',
        });
        setDisabledFields({
          name: true,
          phone: true,
          birth: false,
          gender: false,
          membershipNumber: true,
        });
      });
  }, [nameFromPhoneAuth, phoneFromPhoneAuth]);

  // 입력값 핸들링
  const handleChange = (field: keyof typeof formData, value: string) => {
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
    <div className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="w-[320px] text-left mb-[51px]">
        <p className="text-title-4">
          <span className="font-semibold">개인정보</span>를 입력해주세요
        </p>
      </div>

      {/* 이름 */}
      <div className="mb-[20px] w-full flex justify-center">
        <AuthInput
          name="name"
          placeholder="이름"
          value={formData.name}
          disabled={disabledFields.name}
        />
      </div>

      {/* 휴대폰 번호 */}
      <div className="mb-[20px] w-full flex justify-center">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호"
          value={formData.phone}
          disabled={disabledFields.phone}
        />
      </div>

      {/* 생년월일: 달력 선택 */}
      <div className="mb-[20px] w-full flex justify-center">
        <input
          type="date"
          name="birth"
          value={formData.birth}
          onChange={(e) => handleChange('birth', e.target.value)}
          disabled={disabledFields.birth}
          className="w-[320px] h-[48px] px-[16px] rounded-[18px] border border-grey02 text-body-2 text-grey05"
        />
      </div>

      {/* 성별: 토글 버튼 */}
      <div className="mb-[20px] w-full flex justify-center gap-[16px]">
        <button
          type="button"
          className={`w-[150px] h-[48px] rounded-[18px] border text-body-2 transition ${
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
          className={`w-[150px] h-[48px] rounded-[18px] border text-body-2 transition ${
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
      <div className="mb-[20px] w-full flex justify-center">
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
