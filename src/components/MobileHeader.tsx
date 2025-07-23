// src/components/MobileHeader.tsx
import { useState } from 'react';
import { TbMenu2, TbX } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import api from '../apis/axiosInstance';
import Modal from './Modal';

interface MobileHeaderProps {
  title?: string;
  backgroundColor?: string; // Tailwind 클래스명 등
  onMenuClick?: () => void;
}

const MobileHeader = ({ title, backgroundColor = 'bg-white', onMenuClick }: MobileHeaderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      await api.post('api/v1/auth/logout');
      // 상태 초기화
      dispatch(logout());
      // 페이지 이동
      navigate('/main');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    } finally {
      setShowLogoutModal(false); // 모달 닫기
      setIsSidebarOpen(false); // 사이드바 닫기
    }
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
    onMenuClick?.();
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header
        className={`w-full h-[54px] flex items-center px-4 z-[9999] border-b border-grey01 max-md:flex ${backgroundColor}`}
      >
        <div className="flex flex-row items-center h-full ">
          <button
            className="w-8 flex items-center justify-center mr-3 h-full"
            aria-label="메뉴"
            onClick={handleMenuClick}
          >
            <TbMenu2 className="w-5 h-5 text-black" />
          </button>
          <span className="text-body-2 text-black leading-none flex items-center h-full mt-[5px]">
            {title}
          </span>
        </div>
      </header>

      {/* 오버레이 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000]" onClick={closeSidebar} />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[10001] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-grey01">
          <h2 className="text-body-0-bold items-center text-purple04 mt-1">IT: PLACE</h2>
          <button
            className="w-6 h-6 flex items-center justify-center"
            onClick={closeSidebar}
            aria-label="닫기"
          >
            <TbX className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* 메뉴 항목들 */}
        <nav className="p-4">
          <ul className="space-y-6">
            <li>
              <Link
                to="/"
                className="text-body-0 text-black hover:text-purple04 transition-colors"
                onClick={closeSidebar}
              >
                잇플 소개
              </Link>
            </li>
            <li>
              <Link
                to="/main"
                className="text-body-0 text-black hover:text-purple04 transition-colors"
                onClick={closeSidebar}
              >
                잇플 맵
              </Link>
            </li>
            <li>
              <Link
                to="/benefits"
                className="text-body-0 text-black hover:text-purple04 transition-colors"
                onClick={closeSidebar}
              >
                전체 혜택
              </Link>
            </li>
            <li>
              <Link
                to="/mypage/info"
                className="text-body-0 text-black hover:text-purple04 transition-colors"
                onClick={closeSidebar}
              >
                마이페이지
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-body-0 text-black hover:text-purple04 transition-colors text-left"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-body-0 text-purple04 hover:text-purple05 transition-colors text-left"
                  onClick={closeSidebar}
                >
                  로그인
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* 로그아웃 확인 모달 */}
      <Modal
        isOpen={showLogoutModal}
        title="로그아웃"
        message="로그아웃 하시겠습니까?"
        onClose={() => setShowLogoutModal(false)}
        buttons={[
          {
            label: '아니오',
            type: 'secondary',
            onClick: () => setShowLogoutModal(false),
          },
          {
            label: '예',
            type: 'primary',
            onClick: handleLogout,
          },
        ]}
      />
    </>
  );
};

export default MobileHeader;
