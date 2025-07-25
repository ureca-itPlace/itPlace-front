import { Outlet } from 'react-router-dom';
import SideMenu from '../features/myPage/components/SideMenu';
import { useState } from 'react';
import LoginRequiredModal from '../features/myPage/components/MyInfo/LoginRequiredModal';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MobileHeader from '../components/MobileHeader';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

export default function MyPageLayout() {
  const { pathname } = useLocation();

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isHistory = pathname.startsWith('/mypage/history');

  // ✅ 모바일 레이아웃을 위한 조건분기
  const isSimpleLayout =
    pathname.startsWith('/mypage/favorites') || pathname.startsWith('/mypage/history');

  // ✅ Redux에서 로그인 상태 가져오기
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [showLoginModal, setShowLoginModal] = useState(true);

  // ✅ Redux에서 이번 달 혜택 금액 상태 가져오기
  const totalAmount = useSelector((state: RootState) => state.history.totalAmount);

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
    <div>
      <div className="fixed top-0 left-0 w-full z-[9999] max-md:block hidden">
        <MobileHeader title="마이잇플" />
      </div>

      <div
        className={
          `min-h-screen max-h-screen bg-grey01 p-[28px] flex gap-[28px] max-md:-mx-5 max-md:max-h-none max-md:flex-col max-md:p-0` +
          (isSimpleLayout ? ' max-md:gap-0 max-md:bg-white' : '')
        }
      >
        {/* 좌측 메뉴 */}
        <SideMenu />

        {/* ✅ 모바일 전용 배너 */}
        {isMobile && isHistory && (
          <div className="w-full bg-orange-50 px-4 py-4 flex items-center justify-center gap-1">
            <img
              src="/images/myPage/icon-money.webp"
              alt="이번 달 혜택"
              className="w-11 h-8 animate-floating"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.onerror = null;
                t.src = '/images/myPage/icon-money.png';
              }}
            />
            <p className="text-title-7 font-medium text-black animate-floating">
              이번 달 총{' '}
              <span className="text-orange04 font-bold">{totalAmount.toLocaleString()}</span>원 혜택
              받았어요!
            </p>
          </div>
        )}

        {/* 중앙+우측을 자식 페이지에서 구성 */}
        <div className="flex flex-1 gap-[28px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
