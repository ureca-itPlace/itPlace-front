// 전체 어드민 페이지 레이아웃 컴포넌트
import { useState } from 'react';
import Sidebar from '../Sidebar';
import ContentSection from '../ContentSection';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex bg-white h-screen" style={{ padding: 28, boxSizing: 'border-box' }}>
      <div className="flex-shrink-0" style={{ width: 370, height: '100%', borderRadius: 18 }}>
        <Sidebar onTabChange={handleTabChange} />
      </div>
      <ContentSection activeTab={activeTab} />
    </div>
  );
};

export default AdminLayout;
