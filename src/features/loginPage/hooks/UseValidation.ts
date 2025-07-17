import { useState, useCallback } from 'react';

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
        else if (!/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~/-]).{6,30}$/.test(value)) {
          message = '특수문자를 포함한 6~30자로 입력해주세요.';
        }
      }

      if (field === 'passwordConfirm') {
        if (!value) message = '비밀번호 확인을 입력해주세요.';
        else if (value !== formData.password) {
          message = '비밀번호가 일치하지 않습니다.';
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
    console.log('📬 checkEmail called');
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
