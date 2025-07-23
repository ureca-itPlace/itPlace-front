// src/App.tsx
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import ToastProvider from './components/ToastProvider';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { logout } from './store/authSlice';
import { persistor } from './store';
import { refreshToken } from './features/loginPage/apis/auth';

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    const validateToken = async () => {
      if (isLoggedIn) {
        try {
          // refreshToken API로 토큰 유효성 검증
          await refreshToken();
        } catch (err) {
          // 토큰이 유효하지 않으면 persist 삭제 및 로그아웃
          console.log('Token validation failed, clearing persist', err);
          dispatch(logout());
          persistor.purge();
        }
      }
    };

    validateToken();
  }, [dispatch, isLoggedIn]); // dispatch와 isLoggedIn 상태 변경 시 실행

  return (
    <>
      <RouterProvider router={router} />
      <ToastProvider />
    </>
  );
};

export default App;
