import {
  TbUser,
  TbUserFilled,
  TbStar,
  TbStarFilled,
  TbClockHour4,
  TbClockHour4Filled,
} from 'react-icons/tb';
import { NavLink } from 'react-router-dom';

const menuItems = [
  {
    to: '/mypage/info',
    label: '나의 회원 정보',
    icon: TbUser, // inactive icon
    activeIcon: TbUserFilled, // active icon
  },
  {
    to: '/mypage/favorites',
    label: '나의 관심 혜택',
    icon: TbStar,
    activeIcon: TbStarFilled,
  },
  {
    to: '/mypage/history',
    label: '혜택 사용 이력',
    icon: TbClockHour4,
    activeIcon: TbClockHour4Filled,
  },
];

export default function SideMenu() {
  return (
    <>
      {/* ✅ 데스크탑용 사이드 메뉴*/}
      <aside className="w-[370px] bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] px-3 max-xl:w-[310px] max-xl:pt-[56px] max-md:hidden">
        <h1 className="text-title-1 text-purple06 pl-[34px] pb-[80px] max-xl:text-title-2 max-xl:pb-[60px]">
          MY PAGE
        </h1>
        <nav className="flex flex-col gap-5 max-xl:gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const ActiveIcon = item.activeIcon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center h-[66px] gap-3 p-3 rounded-[10px] max-xl:h-[56px] ${
                    isActive
                      ? 'bg-purple04 text-white text-title-4 max-xl:text-title-5'
                      : 'bg-white text-grey05 text-[24px] max-xl:text-[20px]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <div className="pl-3 pr-1">
                        <ActiveIcon size={24} strokeWidth={1} />
                      </div>
                    ) : (
                      <div className="pl-3 pr-1">
                        <Icon size={24} strokeWidth={1} />
                      </div>
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* ✅ 모바일용 사이드 메뉴: 아이콘 제거 + 라벨 변경 + 상단 고정 */}
      <aside
        className="
          hidden
          max-md:flex
          sticky top-0 z-50
          w-full
          bg-white
          border-b border-grey03
        "
      >
        {[
          { to: '/mypage/info', label: '회원 정보' },
          { to: '/mypage/favorites', label: '관심 혜택' },
          { to: '/mypage/history', label: '혜택 이력' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex items-center justify-center py-3 text-sm font-medium
              ${isActive ? 'text-purple04 border-b-2 border-purple04' : 'text-grey05'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </aside>
    </>
  );
}
