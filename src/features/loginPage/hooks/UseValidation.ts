import { useState } from 'react';

type FormData = {
  email: string;
  password: string;
  passwordConfirm: string;
};

type Errors = {
  email?: string;
  password?: string;
  passwordConfirm?: string;
};

const useValidation = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [emailChecked, setEmailChecked] = useState(false);

  const validateAll = (formData: FormData) => {
    const newErrors: Errors = {};

    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (!/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~/-]).{6,30}$/.test(formData.password)) {
      newErrors.password = '특수문자를 포함한 6~30자로 입력해주세요.';
    }

    if (!formData.passwordConfirm) newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (field: keyof FormData, value: string, formData: FormData) => {
    const dummy = { ...formData, [field]: value };
    validateAll(dummy); // 실시간 필드 유효성 검사도 전체 다시 평가
  };

  const checkEmail = () => {
    console.log('📬 checkEmail called');
    setEmailChecked(true);
  };

  return {
    errors,
    emailChecked,
    checkEmail,
    validateAll,
    validateField,
  };
};

export default useValidation;
