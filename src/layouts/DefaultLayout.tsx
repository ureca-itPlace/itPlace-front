// src/layouts/DefaultLayout.tsx
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <>
      {/* 여기에 공통 Header를 넣음 */}
      <Outlet />
    </>
  );
};

export default DefaultLayout;
