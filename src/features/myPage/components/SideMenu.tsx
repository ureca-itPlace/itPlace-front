import { NavLink } from 'react-router-dom';

export default function SideMenu() {
  const menuItems = [
    { to: '/mypage/info', label: '내 정보' },
    { to: '/mypage/favorites', label: '찜한 혜택' },
    { to: '/mypage/history', label: '이용 내역' },
  ];

  return (
    <aside className="w-[370px] bg-white rounded-[18px] drop-shadow-basic pt-[76px] pb-[56px] px-3">
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block p-3 rounded-lg text-center font-medium ${
                isActive ? 'bg-purple04 text-white' : 'bg-grey02 text-grey06'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
