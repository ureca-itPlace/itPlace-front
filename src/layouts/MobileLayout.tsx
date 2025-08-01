// src/layouts/MobileLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';

const MobileLayout = () => {
  const location = useLocation();
  const isAllBenefitsPage = location.pathname === '/benefits';
  const isMainPage = location.pathname === '/main';

  return (
    <div className="max-md:block hidden bg-white min-h-screen">
      <main
        className={`
          ${isMainPage ? '' : 'mt-[54px]'} 
          ${isAllBenefitsPage || isMainPage ? '' : 'px-5'}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MobileLayout;
