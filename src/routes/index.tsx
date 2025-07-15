// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import LandingPage from '../pages/LandingPage';
import MainPage from '../pages/MainPage';
import AdminPage from '../pages/adminPage/AdminPage';
import MyPage from '../pages/myPage/MyPage';
import AllBenefitsPage from '../pages/AllBenefitsPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> }, // 기본 라우터
  { path: '/admin', element: <AdminPage /> },
  {
    element: <DefaultLayout />,
    children: [
      { path: '/main', element: <MainPage /> }, // 각 페이지별 레이아웃이나 자식 라우팅은 각자 작업하면서 자유롭게 추가
      { path: '/mypage', element: <MyPage /> },
      { path: '/benefits', element: <AllBenefitsPage /> },
    ],
    errorElement: <NotFoundPage />,
  },
]);

export default router;
