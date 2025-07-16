// src/features/adminPage/components/Sidebar/index.tsx
import { useState } from 'react';
import { TbLayoutDashboard } from 'react-icons/tb';
import { TbUser } from 'react-icons/tb';
import { TbBuildingStore } from 'react-icons/tb';
import { TbSocial } from 'react-icons/tb';
import { TbLogout2 } from 'react-icons/tb';

interface SidebarProps {
  onTabChange: (tabId: string) => void;
}

const Sidebar = ({ onTabChange }: SidebarProps) => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '대시 보드', icon: TbLayoutDashboard },
    { id: 'users', label: '사용자 관리', icon: TbUser },
    { id: 'partners', label: '제휴 관리', icon: TbBuildingStore },
    { id: 'ai', label: 'AI 분석', icon: TbSocial },
    { id: 'logout', label: '로그아웃', icon: TbLogout2 },
  ];

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
    onTabChange(tabId);
  };

  return (
    <aside
      className="bg-[#250961] text-white flex flex-col"
      style={{ width: 370, height: 891, borderRadius: 18 }}
    >
      <div
        className="text-title-1"
        style={{ marginTop: 24, marginLeft: 34, textShadow: '0px 0px 5px rgba(255,255,255,0.6)' }}
      >
        IT: PLACE
      </div>

      <nav className="mt-14" style={{ paddingLeft: 12, paddingRight: 12 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-4 py-3 mb-4 rounded-[10px] text-body-0 transition-all duration-200 flex items-center ${
                selectedTab === item.id
                  ? 'bg-white text-[#250961] font-bold'
                  : 'bg-transparent text-white hover:bg-white/10'
              }`}
              style={{ height: 60 }}
            >
              <IconComponent size={20} />
              <span style={{ marginLeft: 23 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
