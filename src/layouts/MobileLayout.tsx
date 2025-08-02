// src/layouts/MobileLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';

const MobileLayout = () => {
  const location = useLocation();
  const isNoMobileLayoutPage = location.pathname === '/benefits' || location.pathname === '/event';

  return (
    <div className="max-md:block hidden bg-white min-h-screen">
      <main className={`${isNoMobileLayoutPage ? '' : 'px-5'} mt-[54px]`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MobileLayout;
