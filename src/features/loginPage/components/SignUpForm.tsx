import { useEffect, useState } from 'react';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import AuthFooter from './AuthFooter';

type SignUpFormProps = {
  nameFromPhoneAuth: string;
  phoneFromPhoneAuth: string;
  onGoToLogin: () => void;
};

const SignUpForm = ({ nameFromPhoneAuth, phoneFromPhoneAuth, onGoToLogin }: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birth: '',
    gender: '',
    membershipNumber: '',
  });

  const [disabledFields, setDisabledFields] = useState({
    name: true,
    phone: true,
    birth: false,
    gender: false,
    membershipNumber: true,
  });

  // 🔸 API 데이터 불러오기 + 병합
  useEffect(() => {
    fetch('/api/user-info')
      .then((res) => res.json())
      .then((data) => {
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
        // API 실패 시 PhoneAuth 값만 사용
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

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = formData.name && formData.phone && formData.birth && formData.gender;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 제목 */}
      <div className="w-[320px] text-left mb-[32px]">
        <p className="text-title-4">
          <span className="font-semibold">개인정보</span>를 입력해주세요
        </p>
      </div>

      {/* 이름 */}
      <div className="mb-[16px] w-full flex justify-center">
        <AuthInput
          name="name"
          placeholder="이름"
          value={formData.name}
          disabled={disabledFields.name}
        />
      </div>

      {/* 휴대폰 번호 */}
      <div className="mb-[16px] w-full flex justify-center">
        <AuthInput
          name="phone"
          placeholder="휴대폰 번호"
          value={formData.phone}
          disabled={disabledFields.phone}
        />
      </div>

      {/* 생년월일 */}
      <div className="mb-[16px] w-full flex justify-center">
        <AuthInput
          name="birth"
          placeholder="생년월일"
          value={formData.birth}
          onChange={(e) => handleChange('birth', e.target.value)}
          disabled={disabledFields.birth}
        />
      </div>

      {/* 성별 */}
      <div className="mb-[16px] w-full flex justify-center">
        <AuthInput
          name="gender"
          placeholder="성별"
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          disabled={disabledFields.gender}
        />
      </div>

      {/* 멤버십 번호 */}
      <div className="mb-[32px] w-full flex justify-center">
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
        onClick={() => console.log('회원가입 완료 or 다음 단계')}
        variant={isValid ? 'default' : 'disabled'}
        className="w-[320px] max-lg:w-full"
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
