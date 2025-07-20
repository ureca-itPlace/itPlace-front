import { Outlet } from 'react-router-dom';
import SideMenu from '../features/myPage/components/SideMenu';
import { useState } from 'react';
import LoginRequiredModal from '../features/myPage/components/MyInfo/LoginRequiredModal';

export default function MyPageLayout() {
  const [isLoggedIn] = useState(true); // 임시로 true값 설정: 실제로는 전역 상태나 context에서 가져오기
  const [showLoginModal, setShowLoginModal] = useState(true);

  if (!isLoggedIn) {
    // ✅ 로그인 안된 경우, 뒤쪽 컨텐츠를 전혀 렌더하지 않고 모달만 반환
    return (
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          // 필요하다면 다른 로직
        }}
      />
    );
  }

  // ✅ 로그인된 경우에는 마이페이지 레이아웃 정상 렌더
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
