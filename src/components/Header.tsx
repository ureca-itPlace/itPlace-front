import {
  TbSparkles,
  TbMap2,
  TbUser,
  TbLogout,
  TbLogin,
  TbMapPin,
  TbLayoutList,
} from 'react-icons/tb';
import clsx from 'clsx';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../apis/axiosInstance';

type HeaderProps = {
  isLoggedIn?: boolean;
  variant?: 'default' | 'glass';
};

const menus = [
  { id: 'intro', label: '잇플 소개', icon: TbSparkles, path: '/' },
  { id: 'map', label: '잇플 맵', icon: TbMap2, path: '/main' },
  { id: 'benefits', label: '전체 혜택', icon: TbLayoutList, path: '/benefits' },
  { id: 'mypage', label: '마이페이지', icon: TbUser, path: '/mypage/info' },
];

export default function Header({ isLoggedIn = false, variant = 'default' }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/logout'); // 🚨 추후 api완성된 후 경로 수정 필요
      navigate('/main'); // 로그아웃 후 메인페이지로 이동
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen w-[81px] flex flex-col items-center py-4 rounded-tr-xl rounded-br-xl',
        variant === 'glass' ? 'header-glass bg-[rgba(255,255,255,0.05)]' : 'bg-gradient-header'
      )}
    >
      {/* 로고 영역 */}
      <div className="mb-16 flex flex-col items-center text-white">
        <TbMapPin
          className="text-3xl mb-2 drop-shadow-[0_0_5px_rgba(255,255,255)]"
          strokeWidth={1.3}
        />
        <span className="font-bold text-title-8 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">
          IT: PLACE
        </span>
      </div>

      {/* 메뉴들 */}
      <nav className="flex-1 flex flex-col items-center gap-y-6">
        {menus.map((m) => {
          const Icon = m.icon;
          const isActive = location.pathname === m.path;
          return (
            <Link
              to={m.path}
              key={m.id}
              className={clsx(
                'relative flex flex-col items-center justify-center text-white text-title-8 group w-[72px] h-[76px] hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]'
              )}
            >
              {/* 선택된 메뉴 하이라이트 */}
              {isActive && (
                <div className="absolute top-1/2 left-1/2 w-[72px] h-[76px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white opacity-25 -z-10 drop-shadow-basic"></div>
              )}
              <Icon className="text-3xl" />
              <span className="mt-1">{m.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 로그인 / 로그아웃 */}
      <div className="mb-1">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-white text-sm hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]"
          >
            <TbLogout className="text-3xl" strokeWidth={1.3} />
            <span className="mt-1 text-title-8">로그아웃</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center text-white text-title-8 hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]"
          >
            <TbLogin className="text-3xl" strokeWidth={1.3} />
            <span className="mt-1">로그인</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
