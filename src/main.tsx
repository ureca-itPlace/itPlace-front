// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { setupInterceptors } from './apis/interceptorSetup';
import './index.css';

// API interceptor 설정
setupInterceptors();

// 모바일에서 input 확대 후 원래 뷰포트로 복원하는 전역 처리
if (typeof window !== 'undefined') {
  const setupMobileViewportReset = () => {
    // 모든 input, textarea에 대해 blur 이벤트 리스너 추가
    document.addEventListener(
      'blur',
      (e) => {
        const target = e.target as HTMLElement;

        // input, textarea, contenteditable 요소에서만 작동
        if (
          window.innerWidth < 768 &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.contentEditable === 'true')
        ) {
          // 뷰포트 리셋 로직
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            const originalContent =
              viewport.getAttribute('content') || 'width=device-width, initial-scale=1.0';

            // 강제 확대 해제
            viewport.setAttribute(
              'content',
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );

            // 즉시 원래 설정으로 복원
            setTimeout(() => {
              viewport.setAttribute('content', originalContent);
              window.scrollTo(0, 0);
            }, 100);
          }
        }
      },
      true
    ); // capture phase에서 실행
  };

  // DOM 로드 완료 후 설정
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileViewportReset);
  } else {
    setupMobileViewportReset();
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
