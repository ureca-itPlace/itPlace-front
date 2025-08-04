// src/utils/toast.ts
import { toast, ToastOptions, ToastIcon } from 'react-toastify';
import { MdCheckCircle, MdError, MdInfo } from 'react-icons/md';

// ✅ 토스트 중복 방지를 위한 맵 (메시지 -> 마지막 호출 시간)
const lastToastTime = new Map<string, number>();

// ✅ 토스트 중복 방지 시간 (밀리초)
const TOAST_DEBOUNCE_TIME = 3000; // 1초

// ✅ 오래된 기록 정리 (메모리 누수 방지)
const CLEANUP_INTERVAL = 60000; // 1분마다 정리
const MAX_RECORD_AGE = 30000; // 30초 이상 된 기록은 삭제

// 주기적으로 오래된 기록 정리
setInterval(() => {
  const now = Date.now();
  for (const [key, time] of lastToastTime.entries()) {
    if (now - time > MAX_RECORD_AGE) {
      lastToastTime.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

// ✅ 공통 스타일: flex로 중앙정렬 + gap
const commonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 20px', // 세로로 납작
  borderRadius: '8px', // 둥근 모서리
  fontSize: '16px', // 텍스트 크기
  fontWeight: 400,
  whiteSpace: 'nowrap', // 줄바꿈 안 하고 한 줄로
  width: 'auto', // 토스트 너비 글자 수에 따라 자동
  maxWidth: 'none', // 토스트 최대 너비 제한 해제
};

// ✅ 타입별 스타일
const toastStyles: Record<'success' | 'error' | 'info', ToastOptions> = {
  success: {
    style: {
      ...commonStyle,
      backgroundColor: '#28A745', // 초록
      color: '#ffffff',
    },
  },
  error: {
    style: {
      ...commonStyle,
      backgroundColor: '#DC3545', // 빨강
      color: '#ffffff',
    },
  },
  info: {
    style: {
      ...commonStyle,
      backgroundColor: '#38383B', // 회색
      color: '#ffffff',
    },
  },
};

// ✅ 토스트 호출 함수
export function showToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  options?: ToastOptions
) {
  // ✅ 중복 토스트 방지 로직
  const now = Date.now();
  const toastKey = `${message}-${type}`; // 메시지와 타입을 조합한 키
  const lastTime = lastToastTime.get(toastKey);

  // 이전 토스트와 같은 메시지이고, 설정된 시간 내에 호출된 경우 무시
  if (lastTime && now - lastTime < TOAST_DEBOUNCE_TIME) {
    return;
  }

  // 현재 시간을 기록
  lastToastTime.set(toastKey, now);

  let icon: ToastIcon = <MdInfo size={20} color="#fff" />;

  if (type === 'success') {
    icon = <MdCheckCircle size={20} color="#fff" />;
  }
  if (type === 'error') {
    icon = <MdError size={20} color="#fff" />;
  }
  if (type === 'info') {
    icon = <MdInfo size={20} color="#fff" />;
  }

  // ✅ toast 호출할 때 최종 스타일 병합
  const customStyle: React.CSSProperties = {
    ...toastStyles[type].style, // 기존 색상, 글꼴, 패딩 다 가져오기
    ...options?.style, // 여기에 사용자가 넘긴 width만 덮어쓰기
  };

  // ✅ 모바일인지 아닌지 판별 (767px 이하를 모바일로 간주)
  const isMobile = window.innerWidth <= 767;

  toast(message, {
    ...options, // ✅ 먼저 사용자가 전달한 옵션을 펼치기
    position: options?.position || (isMobile ? 'bottom-center' : 'top-center'),
    icon,
    ...toastStyles[type],
    style: customStyle, // ✅ 맨 마지막에 최종 스타일을 덮어쓰기
  });
}

/*
사용법: 각자 본인이 맡은 페이지 내에서는 토스트가 일관된 너비를 유지하도록
import { showToast } from '../utils/toast';

showToast('성공했습니다!', 'success');
showToast('작업에 실패했습니다.', 'error');
showToast('안내 메시지입니다.', 'info', { position: 'bottom-right' });

👉 width를 지정해서 사용
showToast('삭제가 완료되었습니다.', 'success', {style: { width: '500px' }, });
*/
