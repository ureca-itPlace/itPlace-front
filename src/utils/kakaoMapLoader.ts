/**
 * Kakao Map SDK 동적 로더
 * Chrome의 parser-blocking 경고를 해결하기 위해 수동으로 스크립트를 로드합니다.
 */

import type { KakaoMaps } from '../features/mainPage/types/kakao';

let isLoading = false;
let isLoaded = false;

export const loadKakaoMapSDK = (): Promise<KakaoMaps> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되었는지 확인
    if (isLoaded && window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }

    // 이미 로딩 중인지 확인 (중복 호출 방지)
    if (isLoading) {
      // 로딩 완료까지 대기
      const checkLoaded = setInterval(() => {
        if (isLoaded && window.kakao && window.kakao.maps) {
          clearInterval(checkLoaded);
          resolve(window.kakao);
        }
      }, 100);
      return;
    }

    isLoading = true;

    // 스크립트 태그 동적 생성
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JDK_API_KEY}&libraries=clusterer&autoload=false`;

    script.onload = () => {
      // autoload=false이므로 수동으로 초기화
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          isLoaded = true;
          isLoading = false;
          resolve(window.kakao);
        });
      } else {
        // autoload=false가 지원되지 않는 경우 폴백
        const checkKakao = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(checkKakao);
            isLoaded = true;
            isLoading = false;
            resolve(window.kakao);
          }
        }, 100);
      }
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Kakao Map SDK 로드 실패'));
    };

    document.head.appendChild(script);
  });
};
