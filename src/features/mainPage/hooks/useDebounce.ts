import { useState, useEffect } from 'react';

/**
 * 디바운싱 훅
 * 값이 변경된 후 지정된 시간(delay) 후에 디바운싱된 값을 반환
 * @param value 디바운싱할 값
 * @param delay 지연 시간(ms)
 * @returns 디바운싱된 값
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정 - delay 시간 후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup 함수 - 새로운 값이 들어오면 이전 타이머 취소
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
