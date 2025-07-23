// src/layouts/MobileLayout.tsx
import { Outlet } from 'react-router-dom';
import MobileHeader from '../components/MobileHeader';

const MobileLayout = () => {
  return (
    <div className="max-md:block hidden bg-white min-h-screen">
      <MobileHeader />
      <main className="px-5">
        <Outlet />
      </main>
    </div>
  );
};

export default MobileLayout;
