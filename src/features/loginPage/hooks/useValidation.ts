import { useState, useCallback } from 'react';
import { showToast } from '../../../utils/toast';

type FormData = {
  email: string;
  password: string;
  passwordConfirm: string;
  birth?: string;
};

type Errors = {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  birth?: string;
};

const useValidation = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [emailChecked, setEmailChecked] = useState(false);

  const validateField = useCallback(
    (field: keyof FormData, value: string, formData: FormData) => {
      let message = '';

      if (field === 'email') {
        if (!value) message = '이메일을 입력해주세요.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = '올바른 이메일 형식이 아닙니다.';
        }
      }

      if (field === 'password') {
        if (!value) message = '비밀번호를 입력해주세요.';
        else if (!/^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~/-]).{6,30}$/.test(value)) {
          message = '특수문자를 포함한 6~30자로 입력해주세요.';
        }
      }

      if (field === 'passwordConfirm') {
        if (!value) message = '비밀번호 확인을 입력해주세요.';
        else if (value !== formData.password) {
          message = '비밀번호가 일치하지 않습니다.';
        }
      }

      if (field === 'birth' && value) {
        const inputDate = new Date(value);
        const today = new Date();

        // 오늘 날짜인지 확인
        if (inputDate.toDateString() === today.toDateString()) {
          showToast('오늘은 선택이 불가능해요!', 'error');
          message = '생년월일을 다시 확인해주세요.';
        }
        // 미래 날짜인지 확인
        else if (inputDate > today) {
          showToast('미래는 선택이 불가능해요!', 'error');
          message = '생년월일을 다시 확인해주세요.';
        }
        // 너무 오래된 날짜인지 확인 (예: 1900년 이전)
        else if (inputDate < new Date('1900-01-01')) {
          showToast('생년월일을 다시 확인해주세요.', 'error');
          message = '생년월일을 다시 확인해주세요.';
        }
      }

      setErrors((prev) => ({ ...prev, [field]: message }));
    },
    [] // 의존성이 없기 때문에 이 배열은 비워도 됩니다.
  );

  const validateAll = (formData: FormData) => {
    validateField('email', formData.email, formData);
    validateField('password', formData.password, formData);
    validateField('passwordConfirm', formData.passwordConfirm, formData);

    // setErrors는 validateField에서 처리됨 → 여기선 생략 가능
    return (
      formData.email &&
      formData.password &&
      formData.passwordConfirm &&
      !errors.email &&
      !errors.password &&
      !errors.passwordConfirm
    );
  };

  const checkEmail = () => {
    setEmailChecked(true); // TODO: 실제 중복확인 API 바인딩
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
