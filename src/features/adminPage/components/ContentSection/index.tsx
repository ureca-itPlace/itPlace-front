import Dashboard from '../Dashboard';
import MemberManagement from '../MemberManagement';
import PartnershipManagement from '../PartnershipManagement';

// 오른쪽 콘텐츠 영역 컴포넌트
interface ContentSectionProps {
  activeTab: string;
}

const ContentSection = ({ activeTab }: ContentSectionProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <MemberManagement />;
      case 'partners':
        return <PartnershipManagement />;
      case 'ai':
        return (
          <div className="pl-[28px] pt-[32px]">
            <h2 className="text-title-3 mb-6">AI 분석</h2>
            <p className="text-body-1">AI 분석 내용이 여기에 표시됩니다.</p>
          </div>
        );
      case 'logout':
        return (
          <div className="pl-[28px] pt-[32px]">
            <h2 className="text-title-3 mb-6">로그아웃</h2>
            <p className="text-body-1">로그아웃 처리 중...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <section
      className="flex flex-col bg-grey01 rounded-[18px]"
      style={{ width: 1466, height: 891, marginLeft: 28 }}
    >
      {renderContent()}
    </section>
  );
};

export default ContentSection;
