import { useState, useCallback } from 'react';

/**
 * API 호출 공통 상태 관리 훅
 * 로딩, 에러, 데이터 상태를 통합 관리하여 중복 코드 제거
 */
interface UseApiCallReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (apiCall: () => Promise<T>) => Promise<void>;
  setData: (data: T | null) => void;
  clearError: () => void;
}

export const useApiCall = <T = unknown>(initialData: T | null = null): UseApiCallReturn<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 실행 함수
  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 에러 상태 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
    clearError,
  };
};
