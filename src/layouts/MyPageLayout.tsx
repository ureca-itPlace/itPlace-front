import { Outlet } from 'react-router-dom';
import SideMenu from '../features/myPage/components/SideMenu';

export default function MyPageLayout() {
  return (
    <div className="min-h-screen max-h-screen bg-grey01 p-[28px] flex gap-[28px]">
      {/* 좌측 메뉴 */}
      <SideMenu />

      {/* 중앙+우측을 자식 페이지에서 구성 */}
      <div className="flex flex-1 gap-[28px]">
        <Outlet />
      </div>
    </div>
  );
}
