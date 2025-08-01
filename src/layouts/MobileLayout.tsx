// src/layouts/MobileLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';

const MobileLayout = () => {
  const location = useLocation();
  const isAllBenefitsPage = location.pathname === '/benefits';

  return (
    <div className="max-md:block hidden bg-white min-h-screen">
      <main className={`${isAllBenefitsPage ? '' : 'px-5'} mt-[54px]`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MobileLayout;
