/**
 * 숫자를 천 단위 콤마가 포함된 문자열로 변환
 * @param value - 변환할 숫자 또는 문자열
 * @returns 천 단위 콤마가 포함된 문자열
 */
export const formatNumberWithCommas = (value: string | number): string => {
  const stringValue = typeof value === 'number' ? value.toString() : value;
  // 숫자가 아닌 문자 제거 후 천 단위 콤마 추가
  const numericValue = stringValue.replace(/[^0-9]/g, '');
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 콤마가 포함된 문자열에서 숫자만 추출
 * @param value - 콤마가 포함된 문자열
 * @returns 숫자만 포함된 문자열
 */
export const removeCommas = (value: string): string => {
  return value.replace(/,/g, '');
};

/**
 * 숫자를 원화 형식으로 포맷팅 (천 단위 콤마 + 원)
 * @param value - 변환할 숫자 또는 문자열
 * @returns "1,000원" 형식의 문자열
 */
export const formatCurrency = (value: string | number): string => {
  const formatted = formatNumberWithCommas(value);
  return formatted ? `${formatted}원` : '';
};