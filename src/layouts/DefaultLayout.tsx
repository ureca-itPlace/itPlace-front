// src/layouts/DefaultLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const DefaultLayout = () => {
  return (
    <div className="flex">
      <Header />
      <main className="flex-1 ml-[81px]">
        {' '}
        {/* 헤더(사이드바) 너비만큼 margin-left */}
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
